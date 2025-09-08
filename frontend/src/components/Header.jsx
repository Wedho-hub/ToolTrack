import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
      <div className="container-fluid">
        <button 
          className="btn btn-outline-light me-3 d-lg-none"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="bi bi-list fs-4"></i>
        </button>
        
        <a className="navbar-brand fw-bold" href="/">
          <i className="bi bi-tools me-2"></i>
          ToolTrack
        </a>

        <div className="ms-auto d-flex align-items-center">
          <div className="dropdown">
            <button 
              className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                   style={{width: '32px', height: '32px', color: '#2563eb'}}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="d-none d-md-inline">{user?.name}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <div className="dropdown-item-text">
                  <div className="fw-bold">{user?.name}</div>
                  <div className="text-muted small">{user?.email}</div>
                </div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={() => navigate('/dashboard')}>
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => navigate('/view-tools')}>
                  <i className="bi bi-grid me-2"></i>
                  View All Tools
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => navigate('/manage-tools')}>
                  <i className="bi bi-gear me-2"></i>
                  Manage Tools
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
