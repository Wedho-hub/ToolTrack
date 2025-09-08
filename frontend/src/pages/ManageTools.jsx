import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toolsAPI, usersAPI } from '../../api';

const ManageTools = () => {
  const { user, loading } = useAuth();
  const [tools, setTools] = useState([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [users, setUsers] = useState([]);
  const [showAssignForm, setShowAssignForm] = useState(null);
  const [assignData, setAssignData] = useState({ userId: '' });
  const navigate = useNavigate();

  // Prevent non-admins from accessing this page
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!loading) {
      fetchTools();
      fetchUsers();
    }
  }, [loading]);

  const fetchTools = async () => {
    try {
      const response = await toolsAPI.getAll();
      setTools(response.data.tools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoadingTools(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        await toolsAPI.delete(id);
        fetchTools(); // Refresh the list
      } catch (error) {
        console.error('Error deleting tool:', error);
        alert('Failed to delete tool');
      }
    }
  };

  const handleAssign = async (toolId) => {
    try {
      await toolsAPI.assign(toolId, { userId: assignData.userId });
      setShowAssignForm(null);
      setAssignData({ userId: '' });
      fetchTools(); // Refresh the list
    } catch (error) {
      console.error('Error assigning tool:', error);
      alert('Failed to assign tool');
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
        <div className="col-12 d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div>
            <h1 className="mb-2">Manage Tools</h1>
            <p className="mb-0">Welcome, {user?.name}!</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-primary" onClick={() => navigate('/dashboard')}>
              <i className="bi bi-speedometer2 me-1"></i> Dashboard
            </button>
            <button className="btn btn-outline-success" onClick={() => navigate('/view-tools')}>
              <i className="bi bi-grid me-1"></i> View All Tools
            </button>
            {/* Removed duplicate Add Tool button */}
            <button className="btn btn-outline-danger" onClick={() => { localStorage.clear(); navigate('/login'); }}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>All Tools</h2>
            {user?.role === 'admin' && (
              <button className="btn btn-primary" onClick={() => navigate('/add-tool')}>
                <i className="bi bi-plus-circle me-1"></i> Add Tool
              </button>
            )}
          </div>
          
          {tools.length === 0 ? (
            <p>No tools available.</p>
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
                          Quantity: {tool.availableQuantity}/{tool.totalQuantity}
                        </small>
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          Status: {tool.status}
                        </small>
                      </p>
                      {tool.assignedTo && (
                        <p className="card-text">
                          <small className="text-muted">
                            Assigned to: {tool.assignedTo.name}
                          </small>
                        </p>
                      )}
                      
                      {user?.role === 'admin' && (
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/manage-tools/edit/${tool._id}`)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(tool._id)}
                          >
                            Delete
                          </button>
                          {tool.status === 'available' && (
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => setShowAssignForm(tool._id)}
                            >
                              Assign
                            </button>
                          )}
                          {tool.status === 'in-use' && (
                            <button 
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleReturn(tool._id)}
                            >
                              Return
                            </button>
                          )}
                        </div>
                      )}
                      
                      {showAssignForm === tool._id && (
                        <div className="mt-3">
                          <div className="form-group">
                            <label>User:</label>
                            <select 
                              className="form-control"
                              value={assignData.userId}
                              onChange={(e) => setAssignData({ userId: e.target.value })}
                            >
                              <option value="">Select a user</option>
                              {users.map(user => (
                                <option key={user._id} value={user._id}>
                                  {user.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mt-2">
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleAssign(tool._id)}
                            >
                              Confirm Assignment
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary ms-2"
                              onClick={() => setShowAssignForm(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
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

export default ManageTools;
