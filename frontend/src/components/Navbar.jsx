import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-md shadow-sm sticky-top" style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Brand */}
        <button
          className="navbar-brand btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2"
          onClick={() => navigate('/')}
        >
          <img src="/toolTrackIcon.png" alt="ToolTrack" style={{ width: 32, height: 32, borderRadius: 8 }} onError={e => { e.currentTarget.style.display = 'none'; }} />
          <span className="fw-bold fs-5" style={{ color: '#2563eb', letterSpacing: '-0.3px' }}>ToolTrack</span>
        </button>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
        >
          <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
        </button>

        {/* Nav links */}
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-md-0 gap-1">
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none ${isActive('/dashboard')}`}
                onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
              >
                <i className="bi bi-speedometer2 me-1"></i>Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none ${isActive('/view-tools')}`}
                onClick={() => { navigate('/view-tools'); setMenuOpen(false); }}
              >
                <i className="bi bi-grid me-1"></i>All Tools
              </button>
            </li>
            {user?.role === 'admin' && (
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link text-decoration-none ${isActive('/manage-tools')}`}
                  onClick={() => { navigate('/manage-tools'); setMenuOpen(false); }}
                >
                  <i className="bi bi-gear me-1"></i>Manage Tools
                </button>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user && (
              <div className="d-none d-md-flex align-items-center gap-2 me-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                  style={{ width: 34, height: 34, background: '#2563eb', fontSize: '0.85rem' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="fw-semibold" style={{ fontSize: '0.85rem', lineHeight: 1.2 }}>{user.name}</div>
                  <div className="text-muted text-capitalize" style={{ fontSize: '0.75rem' }}>{user.role}</div>
                </div>
              </div>
            )}
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
