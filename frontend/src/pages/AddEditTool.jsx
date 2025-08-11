import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toolsAPI } from '../../api';
import ToolForm from '../components/ToolForm';

const AddEditTool = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchTool();
    }
  }, [id]);

  const fetchTool = async () => {
    try {
      setLoading(true);
      const response = await toolsAPI.getById(id);
      setTool(response.data.tool);
    } catch (error) {
      console.error('Error fetching tool:', error);
      setError('Failed to fetch tool');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (id) {
        // Update existing tool
        await toolsAPI.update(id, data);
      } else {
        // Create new tool
        await toolsAPI.create(data);
      }
      navigate('/manage-tools');
    } catch (error) {
      console.error('Error saving tool:', error);
      setError(error.response?.data?.message || 'Failed to save tool');
    }
  };

  if (loading) {
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
          <h1 className="mb-4">{id ? 'Edit Tool' : 'Add New Tool'}</h1>
        </div>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-md-8">
          <ToolForm tool={tool} onSubmit={handleSubmit} />
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-12">
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/manage-tools')}
          >
            Back to Manage Tools
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTool;
