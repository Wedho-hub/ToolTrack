import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const [tools, setTools] = useState([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    if (!loading) {
      fetchTools();
    }
    // eslint-disable-next-line
  }, [loading]);

  const fetchTools = async () => {
    try {
      // Fetch only tools assigned to the current user
      const response = await import('../../api').then(mod => mod.toolsAPI.getMyTools());
      setTools(response.data.tools);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setTools([]);
    } finally {
      setLoadingTools(false);
    }
  };

  const handleReturn = async (toolId) => {
    try {
      // Call API to return tool (implement as needed)
      // await toolsAPI.returnTool(toolId);
      fetchTools();
    } catch (error) {
      console.error('Error returning tool:', error);
    }
  };

  if (loading || loadingTools) {
    return <div className="container mt-5"><p>Loading...</p></div>;
  }

  // Stats summary
  const totalTools = tools.length;
  const inUse = tools.filter(t => t.status === 'in-use').length;
  const available = tools.filter(t => t.status === 'available').length;

  return (
    <div className="container py-4">
      {/* Header and Navigation */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 p-3 bg-white rounded shadow-sm">
        <div>
          <h1 className="mb-1 fw-bold">Dashboard</h1>
          <div className="text-muted">Welcome, {user?.name}!</div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-primary" onClick={() => navigate('/view-tools')}>
            <i className="bi bi-grid me-1"></i> View All Tools
          </button>
          {user?.role === 'admin' && (
            <button className="btn btn-outline-secondary" onClick={() => navigate('/manage-tools')}>
              <i className="bi bi-gear me-1"></i> Manage Tools
            </button>
          )}
          <button className="btn btn-outline-danger" onClick={() => { logout(); navigate('/login'); }}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-center border-0 shadow-sm h-100">
            <div className="card-body py-4">
              <div className="fs-2 fw-bold text-primary">{totalTools}</div>
              <div className="text-muted">Total Tools Assigned</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-0 shadow-sm h-100">
            <div className="card-body py-4">
              <div className="fs-2 fw-bold text-success">{available}</div>
              <div className="text-muted">Available</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-0 shadow-sm h-100">
            <div className="card-body py-4">
              <div className="fs-2 fw-bold text-warning">{inUse}</div>
              <div className="text-muted">In Use</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="mb-3 d-flex align-items-center gap-2">
        <h2 className="mb-0 fw-semibold">Your Tools</h2>
        <span className="badge bg-light text-dark">{totalTools}</span>
      </div>
      {tools.length === 0 ? (
        <div className="alert alert-warning">No tools assigned to you yet.</div>
      ) : (
        <div className="row g-4">
          {tools.map((tool) => (
            <div key={tool._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3 gap-3">
                    {tool.imageUrl && (
                      <img src={tool.imageUrl} alt={tool.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
                    )}
                    <div>
                      <h5 className="card-title mb-1 fw-bold">{tool.name}</h5>
                      <div className="text-muted small">{tool.category}</div>
                    </div>
                  </div>
                  <div className="mb-2 flex-grow-1">
                    <div className="mb-1 text-secondary">{tool.description}</div>
                    <div className="d-flex flex-wrap gap-2">
                      <span className={`badge px-3 py-2 ${tool.status === 'available' ? 'bg-success' : tool.status === 'in-use' ? 'bg-warning text-dark' : 'bg-secondary'}`}>Status: {tool.status}</span>
                    </div>
                  </div>
                  {tool.status === 'in-use' && (
                    <button 
                      className="btn btn-sm btn-warning align-self-end mt-auto"
                      onClick={() => handleReturn(tool._id)}
                    >
                      Return Tool
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
