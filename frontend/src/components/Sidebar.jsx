import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items for all users
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'speedometer2' },
    { path: '/view-tools', label: 'View All Tools', icon: 'grid' },
  { path: '/manage-tools', label: 'Manage Tools', icon: 'gear', admin: true },
  { path: '/add-tool', label: 'Add Tool', icon: 'plus-circle', admin: true },
    { path: '/dashboard', label: 'View My Tools', icon: 'box', admin: true },
    { path: '/login', label: 'Login', icon: 'box-arrow-in-right', guest: true },
    { path: '/register', label: 'Register', icon: 'person-plus', guest: true },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''} d-lg-none`}
        tabIndex="-1"
        id="sidebar"
        style={{visibility: isOpen ? 'visible' : 'hidden'}}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">
            <i className="bi bi-tools me-2"></i>
            ToolTrack
          </h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={toggleSidebar}
          ></button>
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column">
            {navItems.map((item) => {
              // Show admin-only links if user is admin, guest links if not logged in
              if (item.admin && user?.role !== 'admin') return null;
              if (item.guest && user) return null;
              return (
                <button
                  key={item.path}
                  className={`nav-link d-flex align-items-center mb-2 ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    toggleSidebar();
                  }}
                >
                  <i className={`bi bi-${item.icon} me-3`}></i>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`d-none d-lg-block sidebar ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <div className="p-3">
          <div className="d-flex align-items-center mb-4">
            <i className="bi bi-tools fs-4 text-primary me-2"></i>
            {isOpen && <h5 className="mb-0 fw-bold">ToolTrack</h5>}
          </div>
          
          <nav className="nav flex-column">
            {navItems.map((item) => {
              if (item.admin && user?.role !== 'admin') return null;
              if (item.guest && user) return null;
              return (
                <button
                  key={item.path}
                  className={`nav-link d-flex align-items-center mb-2 ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  title={!isOpen ? item.label : ''}
                >
                  <i className={`bi bi-${item.icon} ${isOpen ? 'me-3' : ''} fs-5`}></i>
                  {isOpen && item.label}
                </button>
              );
            })}
          </nav>

          {isOpen && (
            <div className="mt-auto pt-4">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                     style={{width: '48px', height: '48px'}}>
                  <i className="bi bi-person fs-4 text-primary"></i>
                </div>
                <div className="small text-muted">{user?.name}</div>
                <div className="small text-muted">{user?.role}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
