import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <div style={{ fontSize: '6rem', lineHeight: 1, color: '#e2e8f0', fontWeight: 900, letterSpacing: '-4px' }}>404</div>
      <h2 className="fw-bold mt-2 mb-2">Page not found</h2>
      <p className="text-muted mb-4" style={{ maxWidth: 380 }}>
        The page you were looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="d-flex gap-3">
        <button className="btn btn-primary px-4" onClick={() => navigate('/')}>
          <i className="bi bi-house me-2"></i>Go Home
        </button>
        <button className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i>Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
