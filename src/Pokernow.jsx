import React, { useState } from 'react';
import Papa from 'papaparse';
import stringSimilarity from 'string-similarity';

const Pokernow = () => {
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState(null);
  const [aliasGroups, setAliasGroups] = useState([]); // Array of { group: string[], canonical: string, totals: {...} }
  const [groupingConfirmed, setGroupingConfirmed] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [aliasSummary, setAliasSummary] = useState({}); // Mapping: alias -> { buyIn, buyOut, stack, combined }

  // Helper: Compute aggregate data for each alias from parsedData
  const computeAliasSummary = (data) => {
    const summary = {};
    data.forEach((row) => {
      const name = row.player_nickname.trim();
      const buyIn = parseFloat(row.buy_in) || 0;
      const buyOut = parseFloat(row.buy_out) || 0;
      const stack = parseFloat(row.stack) || 0;
      if (!summary[name]) {
        summary[name] = { buyIn: 0, buyOut: 0, stack: 0 };
      }
      summary[name].buyIn += buyIn;
      summary[name].buyOut += buyOut;
      summary[name].stack += stack;
    });
    // Compute combined cash-out (buy_out + stack)
    Object.keys(summary).forEach((name) => {
      summary[name].combined = summary[name].buyOut + summary[name].stack;
    });
    return summary;
  };

  // Fuzzy grouping function using string-similarity
  const groupNicknames = (names, threshold = 0.7) => {
    const groups = [];
    const assigned = new Set();

    names.forEach((name) => {
      if (assigned.has(name)) return;
      // Create a new group for this name
      const group = [name];
      assigned.add(name);
      names.forEach((otherName) => {
        if (!assigned.has(otherName)) {
          const similarityScore = stringSimilarity.compareTwoStrings(
            name.toLowerCase(),
            otherName.toLowerCase()
          );
          if (similarityScore >= threshold) {
            group.push(otherName);
            assigned.add(otherName);
          }
        }
      });
      groups.push(group);
    });
    return groups;
  };

  // Handle CSV upload and parsing
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Reset state for new file
    setGroupingConfirmed(false);
    setTransactions([]);
    setAliasGroups([]);
    setAliasSummary({});

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data;
          setParsedData(data);
          // Compute aggregated alias summary data
          const summary = computeAliasSummary(data);
          setAliasSummary(summary);
          // Get unique aliases
          const uniqueNames = Object.keys(summary);
          // Run fuzzy grouping on the unique names
          const groups = groupNicknames(uniqueNames);
          // For each group, compute total aggregates and set a default player name (first alias)
          const initialAliasGroups = groups.map((group) => {
            const totals = group.reduce(
              (acc, alias) => {
                const { buyIn, buyOut, stack, combined } = summary[alias];
                return {
                  buyIn: acc.buyIn + buyIn,
                  buyOut: acc.buyOut + buyOut,
                  stack: acc.stack + stack,
                  combined: acc.combined + combined,
                };
              },
              { buyIn: 0, buyOut: 0, stack: 0, combined: 0 }
            );
            return { group, canonical: group[0], totals };
          });
          setAliasGroups(initialAliasGroups);
        } catch (err) {
          setError("Error processing CSV data.");
          console.error(err);
        }
      },
      error: (err) => {
        setError("Error reading file.");
        console.error(err);
      },
    });
  };

  // Update player name for a group
  const handleCanonicalChange = (index, newCanonical) => {
    const updatedGroups = [...aliasGroups];
    updatedGroups[index].canonical = newCanonical;
    setAliasGroups(updatedGroups);
  };

  // When the user confirms the grouping, remap the parsedData to use player names
  const confirmGrouping = () => {
    // Build a mapping from each alias to its player name
    const aliasMapping = {};
    aliasGroups.forEach(({ group, canonical }) => {
      group.forEach((alias) => {
        aliasMapping[alias] = canonical;
      });
    });

    // Update the parsedData with player names
    const newData = parsedData.map((row) => {
      const original = row.player_nickname.trim();
      return { ...row, player_nickname: aliasMapping[original] || original };
    });
    setParsedData(newData);
    setGroupingConfirmed(true);
  };

  // Go back to grouping view
  const backToGrouping = () => {
    setGroupingConfirmed(false);
  };

  // Settlement calculation function (using updated parsedData)
  const calculateSettlement = () => {
    // Group data by player_nickname
    const playerMap = {};
    parsedData.forEach((row) => {
      const name = row.player_nickname;
      const buyIn = parseFloat(row.buy_in) || 0;
      const buyOut = parseFloat(row.buy_out) || 0;
      const stack = parseFloat(row.stack) || 0;

      if (!playerMap[name]) {
        playerMap[name] = { totalBuyIn: 0, totalBuyOutStack: 0 };
      }
      playerMap[name].totalBuyIn += buyIn;
      playerMap[name].totalBuyOutStack += (buyOut + stack);
    });

    // Calculate each player's net balance (in dollars)
    const netBalances = [];
    Object.keys(playerMap).forEach((name) => {
      const { totalBuyIn, totalBuyOutStack } = playerMap[name];
      const net = (totalBuyOutStack - totalBuyIn) / 100;
      netBalances.push({ name, net });
    });

    // Compute settlement transactions
    const settlements = settleDebts(netBalances);
    setTransactions(settlements);
  };

  // Simple settlement algorithm to minimize transactions:
  function settleDebts(netBalances) {
    const creditors = [];
    const debtors = [];
    netBalances.forEach((player) => {
      if (player.net > 0) {
        creditors.push({ ...player });
      } else if (player.net < 0) {
        debtors.push({ ...player });
      }
    });
    // Sort creditors (largest net first) and debtors (most negative first)
    creditors.sort((a, b) => b.net - a.net);
    debtors.sort((a, b) => a.net - b.net);
    const transactions = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(creditor.net, -debtor.net);
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: amount.toFixed(2),
      });
      debtor.net += amount;
      creditor.net -= amount;
      if (Math.abs(debtor.net) < 0.01) i++;
      if (Math.abs(creditor.net) < 0.01) j++;
    }
    return transactions;
  }

  // Aggregate confirmed groupings by player name so that duplicates are combined
  const aggregatedGroups = () => {
    const aggregated = {};
    aliasGroups.forEach((groupObj) => {
      const key = groupObj.canonical;
      if (!aggregated[key]) {
        aggregated[key] = {
          aliases: new Set(groupObj.group),
          totals: { ...groupObj.totals },
        };
      } else {
        groupObj.group.forEach((alias) => aggregated[key].aliases.add(alias));
        aggregated[key].totals.buyIn += groupObj.totals.buyIn;
        aggregated[key].totals.combined += groupObj.totals.combined;
      }
    });
    return Object.entries(aggregated); // [ [playerName, { aliases: Set, totals }], ... ]
  };

  return (
    <div className="w-full sm:max-w-3xl md:max-w-7xl mx-auto px-4">
    <div className="mockup-browser bg-base-300 max-w-5xl mx-auto my-20 rounded-box shadow-2xl">
      <div className="mockup-browser-toolbar">
        <div className="input">https://payouts.com</div>
      </div>
      <div className="bg-base-200 flex flex-col justify-center items-center px-4 py-16">
        <h2 className="text-xl font-bold mb-4">Pokernow Ledger Calculator</h2>
        <p className="mb-4 text-center">
          Upload your CSV file. The CSV should include columns:{' '}
          <code>player_nickname</code>, <code>buy_in</code>, <code>buy_out</code>, and <code>stack</code>.
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file-input file-input-bordered file-input-accent w-full max-w-xs btn-outline "
        />
        <br></br>
        {error && <p className="text-red-600">{error}</p>}

        {/* Fuzzy grouping suggestions */}
        {aliasGroups.length > 0 && !groupingConfirmed && (
          <div className="w-full mb-6">
            <h3 className="text-lg font-semibold mb-2">Confirm Alias Grouping</h3>
            <p className="mb-2">
              We detected similar nicknames with their aggregated financial data.
              Adjust the Player Name if needed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aliasGroups.map((groupObj, index) => (
                <div key={index} className="p-4 border rounded bg-white">
                  <div className="mb-2 text-sm">
                    <strong>Aliases:</strong> {groupObj.group.join(', ')}
                  </div>
                  <div className="mb-2 text-sm">
                    {groupObj.group.length > 1 ? (
                      <>
                        <strong>Group Totals:</strong> Buy‑in: $
                        {(groupObj.totals.buyIn / 100).toFixed(2)}, Combined Cash‑out: $
                        {(groupObj.totals.combined / 100).toFixed(2)}
                      </>
                    ) : (
                      <>
                        <strong>Buy‑in:</strong> $
                        {(aliasSummary[groupObj.group[0]].buyIn / 100).toFixed(2)},{' '}
                        <strong>Combined Cash‑out:</strong> $
                        {(aliasSummary[groupObj.group[0]].combined / 100).toFixed(2)}
                      </>
                    )}
                  </div>
                  <label>
                    Player Name:{' '}
                    <input
                      type="text"
                      value={groupObj.canonical}
                      onChange={(e) => handleCanonicalChange(index, e.target.value)}
                      className="border rounded p-1 ml-2"
                    />
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={confirmGrouping}
              className="mt-4 px-4 py-2 btn btn-outline btn-accent "
            >
              Confirm Groupings
            </button>
          </div>
        )}

        {/* Confirmed groupings displayed in a table with header centered and back button top left */}
        {groupingConfirmed && (
          <>
          
        <div className="divider"></div>
              <h3 className="text-lg font-semibold text-center mb-4">Confirmed Groupings</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">Player Name</th>
                      <th className="px-4 py-2 border-b">Aliases</th>
                      <th className="px-4 py-2 border-b">Buy‑in</th>
                      <th className="px-4 py-2 border-b">Combined Cash‑out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedGroups().map(([playerName, { aliases, totals }]) => (
                      <tr key={playerName} className="hover:bg-green-100">
                        <td className="px-4 py-2 border-b">{playerName}</td>
                        <td className="px-4 py-2 border-b">{Array.from(aliases).join(", ")}</td>
                        <td className="px-4 py-2 border-b">${(totals.buyIn / 100).toFixed(2)}</td>
                        <td className="px-4 py-2 border-b">${(totals.combined / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            
          </>
        )}


        {/* Back Button */}
        
        {/* Once grouping is confirmed, allow calculation of settlement */}
       

      
        {groupingConfirmed && (
        
          <div className="join p-6">
            <button onClick={backToGrouping} className="join-item btn btn-neutral">«</button>
            <button  onClick={calculateSettlement} className="join-item btn btn-outline btn-accent ">Calculate Settlement</button>
          </div>
        )}
        

        {/* Settlement Transactions displayed in a table */}
        {transactions.length > 0 && (
          
          <div className="w-1/2">
                    
          <div className="divider"></div>
            <h3 className="text-lg font-semibold text-center mb-4">Settlement Transactions</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">From</th>
                    <th className="px-4 py-2 border-b">To</th>
                    <th className="px-4 py-2 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => (
                    <tr key={index} className="hover:bg-green-100">
                      <td className="px-4 py-2 border-b">{t.from}</td>
                      <td className="px-4 py-2 border-b">{t.to}</td>
                      <td className="px-4 py-2 border-b">${t.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Pokernow;
