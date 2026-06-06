import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toolsAPI } from '../../api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const CATEGORIES = ['Hand Tools', 'Power Tools', 'Measuring Tools', 'Safety Equipment', 'Other'];
const CONDITIONS = ['new', 'good', 'fair', 'poor', 'damaged'];

const AddEditTool = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Hand Tools',
    quantity: 1,
    location: '',
    condition: 'good',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    if (isEditing) {
      toolsAPI.getById(id)
        .then(res => {
          const t = res.data.tool;
          setFormData({
            name: t.name || '',
            description: t.description || '',
            category: t.category || 'Hand Tools',
            quantity: t.totalQuantity || 1,
            location: t.location || '',
            condition: t.condition || 'good',
            imageUrl: t.imageUrl || '',
          });
        })
        .catch(() => setError('Failed to load tool details.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEditing) {
        await toolsAPI.update(id, formData);
      } else {
        await toolsAPI.create(formData);
      }
      navigate('/manage-tools');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save tool. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading tool…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">

            {/* Breadcrumb */}
            <nav className="mb-4">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.875rem' }}>
                <li className="breadcrumb-item">
                  <button className="btn btn-link p-0 text-muted text-decoration-none" onClick={() => navigate('/manage-tools')}>
                    Manage Tools
                  </button>
                </li>
                <li className="breadcrumb-item active">{isEditing ? 'Edit Tool' : 'Add Tool'}</li>
              </ol>
            </nav>

            {/* Header */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: '#dbeafe' }}>
                <i className={`bi ${isEditing ? 'bi-pencil' : 'bi-plus-circle'} fs-4 text-primary`}></i>
              </div>
              <div>
                <h1 className="fw-bold mb-0 fs-3">{isEditing ? 'Edit Tool' : 'Add New Tool'}</h1>
                <p className="text-muted mb-0 small">{isEditing ? 'Update the details below.' : 'Fill in the details to add a tool to your inventory.'}</p>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" style={{ borderRadius: '0.75rem' }}>
                <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>

                  {/* Basic info */}
                  <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <h6 className="fw-bold text-muted mb-3 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>Basic Information</h6>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                        Tool Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="name"
                        name="name"
                        placeholder="e.g. Cordless Drill"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0.75rem' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        placeholder="Brief description of the tool and its use…"
                        value={formData.description}
                        onChange={handleChange}
                        style={{ borderRadius: '0.75rem' }}
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="category" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Category <span className="text-danger">*</span></label>
                        <select
                          className="form-select form-select-lg"
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          style={{ borderRadius: '0.75rem' }}
                        >
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="condition" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Condition <span className="text-danger">*</span></label>
                        <select
                          className="form-select form-select-lg"
                          id="condition"
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          style={{ borderRadius: '0.75rem' }}
                        >
                          {CONDITIONS.map(c => <option key={c} value={c} className="text-capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <h6 className="fw-bold text-muted mb-3 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>Inventory Details</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="quantity" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Quantity <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          id="quantity"
                          name="quantity"
                          min="1"
                          value={formData.quantity}
                          onChange={handleChange}
                          required
                          style={{ borderRadius: '0.75rem' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="location" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Storage Location <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="location"
                          name="location"
                          placeholder="e.g. Shelf B-3, Storage Room"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          style={{ borderRadius: '0.75rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="mb-5">
                    <h6 className="fw-bold text-muted mb-3 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>Image (optional)</h6>
                    <label htmlFor="imageUrl" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="https://example.com/tool-image.jpg"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      style={{ borderRadius: '0.75rem' }}
                    />
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          style={{ height: 80, width: 80, objectFit: 'cover', borderRadius: 12, border: '2px solid #e2e8f0' }}
                          onError={e => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg flex-grow-1 fw-semibold"
                      disabled={saving}
                      style={{ borderRadius: '0.75rem' }}
                    >
                      {saving ? (
                        <><span className="spinner-border spinner-border-sm me-2" />{isEditing ? 'Saving…' : 'Adding…'}</>
                      ) : (
                        <><i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-plus-circle'} me-2`}></i>{isEditing ? 'Save Changes' : 'Add Tool'}</>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg px-4"
                      onClick={() => navigate('/manage-tools')}
                      style={{ borderRadius: '0.75rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditTool;
