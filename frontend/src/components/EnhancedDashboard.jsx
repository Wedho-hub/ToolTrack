import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toolsAPI } from '../../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EnhancedDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalTools: 0,
    availableTools: 0,
    inUseTools: 0,
    assignedToMe: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReturn = async (toolId) => {
    try {
      await toolsAPI.return(toolId);
      fetchDashboardData();
      toast.success('Tool returned successfully');
    } catch (error) {
      console.error('Error returning tool:', error);
      toast.error('Failed to return tool');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await toolsAPI.getAllTools();
      const tools = response.data.tools;
      
      // Calculate statistics
      const totalTools = tools.length;
      const availableTools = tools.filter(tool => tool.status === 'available').length;
      const inUseTools = tools.filter(tool => tool.status === 'in-use').length;
      
      // For workers, get assigned tools
      let assignedToMe = 0;
      if (user?.role === 'worker') {
        const myTools = await toolsAPI.getMyTools();
        assignedToMe = myTools.data.tools.length;
      }

      setStats({
        totalTools,
        availableTools,
        inUseTools,
        assignedToMe
      });

      // Get recent activity (last 5 tool assignments)
      const recent = tools
        .filter(tool => tool.assignedTo)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);
      
      setRecentActivity(recent);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="col-md-3 mb-4">
      <div className={`stats-card stats-card-${color}`}>
        <div className="stats-card-header">
          <h5 className="stats-card-title">{title}</h5>
          <div className={`stats-card-icon ${color}`}>
            <i className={`fas ${icon}`}></i>
          </div>
        </div>
        <div className="stats-card-value">{value}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Dashboard Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="dashboard-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Dashboard</h1>
                <p className="text-muted mb-0">Welcome back, {user?.name}!</p>
              </div>
              <button 
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row">
        {user?.role === 'admin' && (
          <>
            <StatCard 
              title="Total Tools" 
              value={stats.totalTools} 
              icon="fa-tools" 
              color="primary" 
            />
            <StatCard 
              title="Available Tools" 
              value={stats.availableTools} 
              icon="fa-check-circle" 
              color="success" 
            />
            <StatCard 
              title="In Use" 
              value={stats.inUseTools} 
              icon="fa-clock" 
              color="warning" 
            />
            <StatCard 
              title="Total Users" 
              value="12" 
              icon="fa-users" 
              color="info" 
            />
          </>
        )}
        
        {user?.role === 'worker' && (
          <>
            <StatCard 
              title="Assigned Tools" 
              value={stats.assignedToMe} 
              icon="fa-hand-holding" 
              color="primary" 
            />
            <StatCard 
              title="Available Tools" 
              value={stats.availableTools} 
              icon="fa-check-circle" 
              color="success" 
            />
            <StatCard 
              title="In Use" 
              value={stats.inUseTools} 
              icon="fa-clock" 
              color="warning" 
            />
            <StatCard 
              title="Completed Tasks" 
              value="8" 
              icon="fa-tasks" 
              color="info" 
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h6 className="dashboard-card-title">Recent Activity</h6>
            </div>
            <div className="dashboard-card-body">
              {recentActivity.length === 0 ? (
                <p className="text-muted">No recent activity</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Tool</th>
                        <th>Assigned To</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((tool) => (
                        <tr key={tool._id}>
                          <td>{tool.name}</td>
                          <td>{tool.assignedTo?.name || 'N/A'}</td>
                          <td>{new Date(tool.updatedAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`table-badge ${tool.status}`}>
                              {tool.status}
                            </span>
                          </td>
                          <td>
                            {tool.status === 'in-use' && user?.role === 'worker' && (
                              <button 
                                className="btn btn-sm btn-warning"
                                onClick={() => handleReturn(tool._id)}
                              >
                                Return
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h6 className="dashboard-card-title">Quick Actions</h6>
            </div>
            <div className="dashboard-card-body">
              <div className="btn-group-vertical w-100">
                {user?.role === 'admin' && (
                  <>
                    <button 
                      className="btn btn-primary mb-2"
                      onClick={() => navigate('/manage-tools/add')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add New Tool
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/manage-tools')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                      </svg>
                      Manage Tools
                    </button>
                  </>
                )}
                
                {user?.role === 'worker' && (
                  <>
                    <button 
                      className="btn btn-primary mb-2"
                      onClick={() => navigate('/manage-tools')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      Browse Tools
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={fetchDashboardData}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23,4 23,10 17,10"></polyline>
                        <polyline points="1,20 1,14 7,14"></polyline>
                        <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                      </svg>
                      Refresh Data
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
