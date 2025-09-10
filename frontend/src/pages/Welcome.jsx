import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">Welcome to ToolTrack!</h1>
      <p className="lead">Easily manage, assign, and track your organization's tools.<br />
      Use the quick links below to get started as an admin or worker.</p>
      <img 
        src="/toolTrackIcon.png"
        alt="ToolTrack Logo" 
        style={{ 
          width: 120, 
          margin: '2rem auto', 
          boxShadow: '0 8px 24px 0 rgba(37,99,235,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10), 0 0.5px 1.5px 0 rgba(0,0,0,0.08)',
          borderRadius: '1.5rem',
          transform: 'perspective(600px) rotateX(8deg) scale(1.04)',
          transition: 'box-shadow 0.3s, transform 0.3s',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'perspective(600px) rotateX(0deg) scale(1.08)'; e.currentTarget.style.boxShadow = '0 16px 48px 0 rgba(37,99,235,0.35), 0 3px 16px 0 rgba(0,0,0,0.13)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'perspective(600px) rotateX(8deg) scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 24px 0 rgba(37,99,235,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10), 0 0.5px 1.5px 0 rgba(0,0,0,0.08)'; }}
      />
      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        {!user && <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>}
        {!user && <button className="btn btn-outline-primary" onClick={() => navigate('/register')}>Register</button>}
        <button className="btn btn-success" onClick={() => navigate('/view-tools')}>View All Tools</button>
        {user && <button className="btn btn-info" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>}
        {user && <button className="btn btn-danger" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>}
      </div>
    </div>
  );
};

export default Welcome;
