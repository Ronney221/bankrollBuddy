import React, { useState, useRef, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";

const Navbar = ({ setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Close mobile menu if clicked outside, but ignore clicks on the toggle button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Nav items (used in both mobile and desktop)
  const navItems = (
    <>
      <li onClick={() => { setCurrentPage("home"); setMobileMenuOpen(false); }}>
        <button className="btn btn-ghost text-base sm:text-xl">home</button>
      </li>
      <li onClick={() => { setCurrentPage("game"); setMobileMenuOpen(false); }}>
        <button className="btn btn-ghost text-base sm:text-xl">game</button>
      </li>
      <li onClick={() => { setCurrentPage("stats"); setMobileMenuOpen(false); }}>
        <button className="btn btn-ghost text-base sm:text-xl">bankrollBuddy</button>
      </li>
      <li onClick={() => { setCurrentPage("graph"); setMobileMenuOpen(false); }}>
        <button className="btn btn-ghost text-base sm:text-xl">graph</button>
      </li>
      <li onClick={() => { setCurrentPage("notes"); setMobileMenuOpen(false); }}>
        <button className="btn btn-ghost text-base sm:text-xl">notes</button>
      </li>
      <li onClick={() => { setCurrentPage("pokernow"); setMobileMenuOpen(false); }}>
        <button className="btn btn-ghost text-base sm:text-xl">pokernow</button>
      </li>
    </>
  );

  // Theme changer dropdown content
  const themeChanger = (
    <ul
      tabIndex={0}
      className="dropdown-content bg-base-300 rounded-box w-52 p-2 shadow-2xl left-0 top-full"
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
  );

  return (
    // Navbar is sticky at the top with a high z-index so it sits on top of other content
    <div className="navbar bg-base-300 sticky top-0 z-50 shadow-md">
      <Analytics />
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile: Hamburger Menu & Home Button */}
        <div className="flex items-center lg:hidden">
          <button
            ref={toggleButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-circle mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              )}
            </svg>
          </button>
          {/* Mobile Home (bankrollBuddy) Button */}
          <button
            className="btn btn-ghost normal-case text-xl"
            onClick={() => { setCurrentPage("stats"); setMobileMenuOpen(false); }}
          >
            bankrollBuddy
          </button>
        </div>
        {/* Desktop: Theme changer dropdown on the left */}
        <div className="hidden lg:flex">
          <div className="dropdown">
            <button
              tabIndex={0}
              role="button"
              onClick={() => setThemeOpen(!themeOpen)}
              className="btn btn-ghost btn-circle"
            >
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
            </button>
            {themeOpen && themeChanger}
          </div>
        </div>
      </div>

      {/* Navbar Center (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">{navItems}</ul>
      </div>

      {/* Navbar End (Desktop) */}
      <div className="navbar-end hidden lg:flex">
        <button
          className="btn btn-ghost text-xl"
          onClick={() => setCurrentPage("advice")}
        >
          ai
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 bg-base-300 z-50 shadow-md lg:hidden"
        >
          <ul className="menu menu-compact p-4">
            {navItems}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
