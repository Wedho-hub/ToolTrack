import React, { useEffect, useState } from 'react';
import { toolsAPI } from '../../api';
import { useAuth } from '../contexts/AuthContext';

const ViewTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await toolsAPI.getAll();
        setTools(response.data.tools);
      } catch (error) {
        setTools([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h1 className="mb-0 text-primary">All Tools</h1>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-primary" onClick={() => window.location.href = '/dashboard'}>
            <i className="bi bi-speedometer2 me-1"></i> Dashboard
          </button>
          <button className="btn btn-outline-secondary" onClick={() => window.location.href = '/manage-tools'}>
            <i className="bi bi-gear me-1"></i> Manage Tools
          </button>
          <button className="btn btn-outline-danger" onClick={() => { logout(); window.location.href = '/login'; }}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : tools.length === 0 ? (
        <div className="alert alert-warning">No tools found.</div>
      ) : (
        <div className="row">
          {tools.map(tool => (
            <div key={tool._id} className="col-md-4 mb-4">
              <div className="card shadow pop-in" style={{ borderRadius: '1rem', background: '#fff', border: '1px solid var(--border-color)' }}>
                <div className="card-body" style={{ padding: '1.5rem' }}>
                  <div className="d-flex align-items-center mb-3" style={{ gap: '1rem' }}>
                    <img
                      src={tool.imageUrl || '/public/vite.svg'}
                      alt={tool.name}
                      style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)', background: '#f3f4f6' }}
                      onError={e => { e.currentTarget.src = '/public/vite.svg'; }}
                    />
                    <div>
                      <h5 className="card-title mb-1" style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{tool.name}</h5>
                      <p className="card-text mb-0" style={{ color: 'var(--text-secondary)' }}>{tool.description}</p>
                    </div>
                  </div>
                  <div className="mb-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '0.95rem', borderRadius: '0.5rem' }}>Category: {tool.category}</span>
                    <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '0.95rem', borderRadius: '0.5rem' }}>Quantity: {tool.availableQuantity}/{tool.totalQuantity}</span>
                    <span className={`badge px-3 py-2 ${tool.status === 'available' ? 'bg-success' : tool.status === 'in-use' ? 'bg-warning text-dark' : 'bg-secondary'}`} style={{ fontSize: '0.95rem', borderRadius: '0.5rem' }}>Status: {tool.status}</span>
                    <span className={`badge px-3 py-2 ${tool.assignedTo ? 'bg-info text-dark' : 'bg-light text-muted'}`} style={{ fontSize: '0.95rem', borderRadius: '0.5rem' }}>
                      Assigned to: {tool.assignedTo ? tool.assignedTo.name : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewTools;
