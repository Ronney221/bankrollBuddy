// src/Navbar.jsx
import React from 'react';

const Navbar = ({ setCurrentPage }) => {
  return (
    <div className="navbar bg-base-300 ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl"
          >
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Light"
                value="light"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Dark"
                value="dark"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Retro"
                value="retro"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Dim"
                value="dim"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Nord"
                value="nord"
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">

            <button className="btn btn-ghost text-xl" onClick={() => setCurrentPage("home")}>
            home
          </button>
          <button className="btn btn-ghost text-xl" onClick={() => setCurrentPage("game")}>
            game
        </button>
            
        
        <button
          className="btn btn-ghost normal-case text-xl"
          onClick={() => setCurrentPage("stats")}
        >
          bankrollBuddy
        </button>

        <button className="btn btn-ghost text-xl" onClick={() => setCurrentPage("notes")}>
            notes
        </button>
        <button className="btn btn-ghost text-xl" onClick={() => setCurrentPage("graph")}>
            graph
        </button>
      </div>
      <div className="navbar-end">
      <button className="btn btn-ghost text-xl" onClick={() => setCurrentPage("advice")}>
            ai
          </button>
        
      </div>
    </div>
  );
};

export default Navbar;
