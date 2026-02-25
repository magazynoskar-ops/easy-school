import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

const HamburgerMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="menu-wrap">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="menu-icon-button legacy-menu"
        aria-label="Open menu"
      >
        {'\u2630'}
      </button>
      {open && (
        <div className="menu-panel">
          <Link to="/" className="menu-link" onClick={closeMenu}>Zestawy</Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="menu-link" onClick={closeMenu}>Admin users</Link>
              <Link to="/admin/sets" className="menu-link" onClick={closeMenu}>Admin sets</Link>
            </>
          )}
          {user && (
            <button
              type="button"
              className="menu-link menu-action"
              onClick={() => {
                closeMenu();
                logout();
              }}
            >
              Wyloguj sie
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
