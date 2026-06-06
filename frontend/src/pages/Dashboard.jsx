import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toolsAPI } from '../../api';
import Navbar from '../components/Navbar';

const conditionColors = {
  new: 'bg-primary',
  good: 'bg-success',
  fair: 'bg-warning text-dark',
  poor: 'bg-danger',
  damaged: 'bg-secondary',
};

const statusColors = {
  available: 'bg-success',
  'in-use': 'bg-warning text-dark',
  damaged: 'bg-secondary',
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [tools, setTools] = useState([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [returning, setReturning] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) fetchTools();
  }, [loading]);

  const fetchTools = async () => {
    try {
      const response = await toolsAPI.getMyTools();
      setTools(response.data.tools);
    } catch {
      setTools([]);
    } finally {
      setLoadingTools(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleReturn = async (toolId, toolName) => {
    setReturning(toolId);
    try {
      await toolsAPI.return(toolId);
      showToast(`"${toolName}" returned successfully.`);
      await fetchTools();
    } catch {
      showToast('Failed to return tool. Please try again.', 'danger');
    } finally {
      setReturning(null);
    }
  };

  if (loading || loadingTools) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const inUse = tools.filter(t => t.status === 'in-use').length;
  const available = tools.filter(t => t.status === 'available').length;

  return (
    <>
      <Navbar />

      {toast && (
        <div
          className={`alert alert-${toast.type} alert-dismissible position-fixed`}
          style={{ top: '80px', right: '1.5rem', zIndex: 9999, minWidth: '280px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          {toast.message}
          <button type="button" className="btn-close" onClick={() => setToast(null)} />
        </div>
      )}

      <div className="container py-5">
        {/* Welcome banner */}
        <div className="rounded-4 p-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 fs-3">Welcome back, {user?.name}!</h1>
              <p className="mb-0 opacity-75">Here's a summary of the tools assigned to you.</p>
            </div>
            <div className="badge bg-white text-primary fs-6 px-3 py-2 text-capitalize">
              {user?.role}
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Assigned to You', value: tools.length, icon: 'bi-tools', color: 'text-primary', bg: '#dbeafe' },
            { label: 'In Use', value: inUse, icon: 'bi-arrow-repeat', color: 'text-warning', bg: '#fef9c3' },
            { label: 'Available', value: available, icon: 'bi-check-circle', color: 'text-success', bg: '#dcfce7' },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className="col-sm-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex align-items-center gap-3 py-3">
                  <div className="rounded-3 p-3" style={{ background: bg }}>
                    <i className={`bi ${icon} fs-4 ${color}`}></i>
                  </div>
                  <div>
                    <div className={`fw-bold fs-3 ${color}`}>{value}</div>
                    <div className="text-muted small">{label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools list */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <h2 className="fw-semibold mb-0 fs-4">Your Assigned Tools</h2>
          <span className="badge bg-secondary rounded-pill">{tools.length}</span>
        </div>

        {tools.length === 0 ? (
          <div className="card border-0 shadow-sm text-center py-5">
            <div className="card-body">
              <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted fw-semibold">No tools assigned yet</h5>
              <p className="text-muted mb-3">Contact your admin to get tools assigned to your account.</p>
              <button className="btn btn-outline-primary" onClick={() => navigate('/view-tools')}>
                Browse Available Tools
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {tools.map((tool) => (
              <div key={tool._id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 hover-lift">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      {tool.imageUrl ? (
                        <img
                          src={tool.imageUrl}
                          alt={tool.name}
                          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 12 }}
                          onError={e => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, background: '#f1f5f9' }}>
                          <i className="bi bi-tools fs-4 text-muted"></i>
                        </div>
                      )}
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="fw-bold mb-0 text-truncate">{tool.name}</h6>
                        <small className="text-muted">{tool.category}</small>
                      </div>
                    </div>

                    {tool.description && (
                      <p className="text-muted small mb-3" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {tool.description}
                      </p>
                    )}

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className={`badge ${statusColors[tool.status] || 'bg-secondary'} rounded-pill px-3`}>
                        {tool.status}
                      </span>
                      <span className={`badge ${conditionColors[tool.condition] || 'bg-secondary'} rounded-pill px-3`}>
                        {tool.condition}
                      </span>
                    </div>

                    {tool.location && (
                      <div className="text-muted small mb-3">
                        <i className="bi bi-geo-alt me-1"></i>{tool.location}
                      </div>
                    )}

                    {tool.status === 'in-use' && (
                      <button
                        className="btn btn-warning btn-sm mt-auto align-self-start"
                        onClick={() => handleReturn(tool._id, tool.name)}
                        disabled={returning === tool._id}
                      >
                        {returning === tool._id ? (
                          <><span className="spinner-border spinner-border-sm me-1" />Returning…</>
                        ) : (
                          <><i className="bi bi-arrow-return-left me-1" />Return Tool</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
