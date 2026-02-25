import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';
import HamburgerMenu from './HamburgerMenu.jsx';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="brand-wrap">
          <Link to="/" className="nav-brand">
            <img src="/logo.png" alt="Easy School Logo" className="brand-logo" />
            <span>Easy School</span>
          </Link>
          <p className="nav-subtitle">Nauka staje sie latwiejsza</p>
        </div>
        <div className="nav-actions">
          {!user && (
            <Link to="/login" className="btn login-btn">
              Zaloguj sie
            </Link>
          )}
          <HamburgerMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
