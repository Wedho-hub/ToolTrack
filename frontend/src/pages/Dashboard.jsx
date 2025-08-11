import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toolsAPI } from '../../api';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [tools, setTools] = useState([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const navigate = useNavigate();

  // Load tools when auth is ready
  useEffect(() => {
    if (!loading) {
      fetchTools();
    }
  }, [loading]);

  const fetchTools = async () => {
    try {
      const response = await toolsAPI.getMyTools();
      setTools(response.data.tools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoadingTools(false);
    }
  };

  const handleReturn = async (toolId) => {
    try {
      await toolsAPI.return(toolId);
      fetchTools(); // Refresh the list
    } catch (error) {
      console.error('Error returning tool:', error);
      alert('Failed to return tool');
    }
  };

  if (loading || loadingTools) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Dashboard</h1>
          <p>Welcome, {user?.name}!</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <h2>Your Tools</h2>
          {tools.length === 0 ? (
            <p>No tools assigned to you yet.</p>
          ) : (
            <div className="row">
              {tools.map((tool) => (
                <div key={tool._id} className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{tool.name}</h5>
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

        <div className="col-md-4">
          <h2>Quick Actions</h2>
          <div className="list-group">
            <button 
              className="list-group-item list-group-item-action"
              onClick={() => navigate('/manage-tools')}
            >
              View All Tools
            </button>
            <button 
              className="list-group-item list-group-item-action"
              onClick={fetchTools}
            >
              Refresh Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
