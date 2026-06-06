import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toolsAPI } from '../../api';
import Navbar from '../components/Navbar';

const statusColors = {
  available: 'bg-success',
  'in-use': 'bg-warning text-dark',
  damaged: 'bg-secondary',
};

const ViewTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await toolsAPI.getAll();
        setTools(response.data.tools);
      } catch {
        setTools([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const categories = ['All', ...new Set(tools.map(t => t.category).filter(Boolean))];

  const filtered = tools.filter(tool => {
    const matchSearch = !search ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      (tool.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || tool.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || tool.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <>
      <Navbar />
      <div className="container py-5">

        {/* Page header */}
        <div className="mb-4">
          <h1 className="fw-bold mb-1">Tool Inventory</h1>
          <p className="text-muted mb-0">Browse and search all tools in the system.</p>
        </div>

        {/* Search & Filters */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-5">
                <label className="form-label text-muted small fw-semibold">SEARCH</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by name or description…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small fw-semibold">CATEGORY</label>
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small fw-semibold">STATUS</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option>All</option>
                  <option value="available">Available</option>
                  <option value="in-use">In Use</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
              <div className="col-md-1 d-flex">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => { setSearch(''); setCategoryFilter('All'); setStatusFilter('All'); }}
                  title="Clear filters"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">
              Showing <strong>{filtered.length}</strong> of <strong>{tools.length}</strong> tools
            </span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading inventory…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card border-0 shadow-sm text-center py-5">
            <div className="card-body">
              <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">No tools match your filters</h5>
              <button className="btn btn-link text-primary" onClick={() => { setSearch(''); setCategoryFilter('All'); setStatusFilter('All'); }}>
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map(tool => (
              <div key={tool._id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm hover-lift">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      {tool.imageUrl ? (
                        <img
                          src={tool.imageUrl}
                          alt={tool.name}
                          style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
                          onError={e => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 64, height: 64, background: '#f1f5f9' }}>
                          <i className="bi bi-tools fs-3 text-muted"></i>
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

                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <span className={`badge rounded-pill px-3 ${statusColors[tool.status] || 'bg-secondary'}`}>
                        {tool.status}
                      </span>
                      <span className="badge bg-light text-dark rounded-pill px-3">
                        {tool.availableQuantity}/{tool.totalQuantity} available
                      </span>
                    </div>

                    {tool.assignedTo && (
                      <div className="text-muted small mt-2">
                        <i className="bi bi-person me-1"></i>
                        Assigned to <strong>{tool.assignedTo.name}</strong>
                      </div>
                    )}
                    {tool.location && (
                      <div className="text-muted small mt-1">
                        <i className="bi bi-geo-alt me-1"></i>{tool.location}
                      </div>
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

export default ViewTools;
