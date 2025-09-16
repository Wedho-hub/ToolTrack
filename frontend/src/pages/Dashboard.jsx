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

  return (
    <div className="container mt-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h1 className="mb-2">Dashboard</h1>
          <p className="mb-0">Welcome, {user?.name}!</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-primary" onClick={() => navigate('/view-tools')}>
            <i className="bi bi-grid me-1"></i> View All Tools
          </button>
          {/* Only show Manage Tools for admin users */}
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
      <div className="row">
        <div className="col-12">
          <h2>Your Tools</h2>
          {tools.length === 0 ? (
            <p>No tools assigned to you yet.</p>
          ) : (
            <div className="row">
              {tools.map((tool) => (
                <div key={tool._id} className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        {tool.imageUrl && (
                          <img src={tool.imageUrl} alt={tool.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, marginRight: 12 }} onError={e => { e.currentTarget.style.display = 'none'; }} />
                        )}
                        <h5 className="card-title mb-0">{tool.name}</h5>
                      </div>
                      <p className="card-text">{tool.description}</p>
                      <p className="card-text">
                        <small className="text-muted">
                          Category: {tool.category}
                        </small>
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          Status: {tool.status}
                        </small>
                      </p>
                      {tool.status === 'in-use' && (
                        <button 
                          className="btn btn-sm btn-warning"
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
      </div>
    </div>
  );
};

export default Dashboard;
