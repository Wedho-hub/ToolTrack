import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toolsAPI, usersAPI } from '../../api';
import Navbar from '../components/Navbar';

const statusConfig = {
  available:        { cls: 'bg-success',           label: 'Available' },
  'in-use':         { cls: 'bg-warning text-dark', label: 'In Use' },
  'pending-return': { cls: 'bg-info text-dark',    label: 'Pending Return' },
  damaged:          { cls: 'bg-secondary',          label: 'Damaged' },
};

// How long ago was the return requested?
const timeAgo = (date) => {
  if (!date) return '';
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ManageTools = () => {
  const { user, loading } = useAuth();
  const [tools, setTools] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [assignUserId, setAssignUserId] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    if (!loading) {
      fetchTools();
      fetchUsers();
    }
  }, [loading]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTools = async () => {
    try {
      const response = await toolsAPI.getAll();
      setTools(response.data.tools);
    } catch {
      showToast('Failed to load tools.', 'danger');
    } finally {
      setLoadingTools(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.users);
    } catch { /* non-fatal */ }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setActionLoading(id + '-delete');
    try {
      await toolsAPI.delete(id);
      showToast(`"${name}" deleted.`);
      setTools(prev => prev.filter(t => t._id !== id));
    } catch {
      showToast('Failed to delete tool.', 'danger');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssign = async () => {
    if (!assignUserId) { showToast('Please select a user.', 'warning'); return; }
    const tool = tools.find(t => t._id === showAssignModal);
    setActionLoading(showAssignModal + '-assign');
    try {
      await toolsAPI.assign(showAssignModal, { userId: assignUserId });
      showToast(`"${tool?.name}" assigned successfully.`);
      setShowAssignModal(null);
      setAssignUserId('');
      fetchTools();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign tool.', 'danger');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmReturn = async (toolId, toolName) => {
    setActionLoading(toolId + '-confirm');
    try {
      await toolsAPI.confirmReturn(toolId);
      showToast(`Return confirmed — "${toolName}" is now available.`);
      fetchTools();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to confirm return.', 'danger');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectReturn = async () => {
    const tool = tools.find(t => t._id === showRejectModal);
    setActionLoading(showRejectModal + '-reject');
    try {
      await toolsAPI.rejectReturn(showRejectModal, rejectReason);
      showToast(`Return rejected — "${tool?.name}" stays assigned to ${tool?.assignedTo?.name}.`, 'warning');
      setShowRejectModal(null);
      setRejectReason('');
      fetchTools();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject return.', 'danger');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingReturns = tools.filter(t => t.status === 'pending-return');

  const filtered = tools
    .filter(t => t.status !== 'pending-return') // shown separately above
    .filter(t =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignedTo?.name || '').toLowerCase().includes(search.toLowerCase())
    );

  const stats = {
    total:    tools.length,
    available: tools.filter(t => t.status === 'available').length,
    inUse:    tools.filter(t => t.status === 'in-use').length,
    pending:  pendingReturns.length,
  };

  if (loading || loadingTools) {
    return (
      <>
        <Navbar />
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading tool inventory…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Toast */}
      {toast && (
        <div
          className={`alert alert-${toast.type} alert-dismissible position-fixed`}
          style={{ top: '80px', right: '1.5rem', zIndex: 9999, minWidth: '280px', maxWidth: '420px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          {toast.message}
          <button type="button" className="btn-close" onClick={() => setToast(null)} />
        </div>
      )}

      <div className="container py-5">

        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-3">
          <div>
            <h1 className="fw-bold mb-1">Manage Tools</h1>
            <p className="text-muted mb-0">Admin panel — add, edit, assign, and manage returns.</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => navigate('/manage-tools/add')}>
            <i className="bi bi-plus-circle"></i>Add New Tool
          </button>
        </div>

        {/* Stats row */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Tools',    value: stats.total,    icon: 'bi-box-seam',       color: 'text-primary', bg: '#dbeafe' },
            { label: 'Available',      value: stats.available,icon: 'bi-check-circle',   color: 'text-success', bg: '#dcfce7' },
            { label: 'In Use',         value: stats.inUse,    icon: 'bi-arrow-repeat',   color: 'text-warning', bg: '#fef9c3' },
            { label: 'Pending Return', value: stats.pending,  icon: 'bi-hourglass-split',color: 'text-info',    bg: '#cffafe' },
          ].map(({ label, value, icon, color, bg }, i) => (
            <div key={label} className={`col-6 col-md-3 fade-in-up stagger-${i + 1}`}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex align-items-center gap-3 py-3">
                  <div className="rounded-3 p-2" style={{ background: bg }}>
                    <i className={`bi ${icon} fs-5 ${color}`}></i>
                  </div>
                  <div>
                    <div className={`fw-bold fs-4 stat-pop ${color}`}>{value}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PENDING RETURNS PANEL ── */}
        {pendingReturns.length > 0 && (
          <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '1rem', border: '2px solid #0ea5e9' }}>
            <div className="card-header border-0 d-flex align-items-center gap-2 px-4 py-3"
              style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)', borderRadius: '1rem 1rem 0 0' }}>
              <i className="bi bi-hourglass-split fs-5 text-white"></i>
              <h5 className="mb-0 fw-bold text-white">
                Pending Returns
                <span className="badge bg-white text-info ms-2 pulse-ring">{pendingReturns.length}</span>
              </h5>
              <div className="ms-auto text-white opacity-75 small">
                Action required — verify physical receipt before accepting
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: '#f0f9ff' }}>
                    <tr>
                      <th className="px-4 py-3 fw-semibold text-muted border-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tool</th>
                      <th className="py-3 fw-semibold text-muted border-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Held By</th>
                      <th className="py-3 fw-semibold text-muted border-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requested By</th>
                      <th className="py-3 fw-semibold text-muted border-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requested</th>
                      <th className="py-3 pe-4 fw-semibold text-muted border-0 text-end" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReturns.map(tool => (
                      <tr key={tool._id} style={{ background: '#f0f9ff' }}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {tool.imageUrl ? (
                              <img src={tool.imageUrl} alt={tool.name}
                                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }}
                                onError={e => { e.currentTarget.style.display = 'none'; }} />
                            ) : (
                              <div className="rounded-2 d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40, background: '#e0f2fe', flexShrink: 0 }}>
                                <i className="bi bi-tools" style={{ color: '#0ea5e9' }}></i>
                              </div>
                            )}
                            <div>
                              <div className="fw-semibold">{tool.name}</div>
                              <div className="text-muted small">{tool.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          {tool.assignedTo ? (
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                                style={{ width: 28, height: 28, background: '#2563eb', fontSize: '0.75rem', flexShrink: 0 }}>
                                {tool.assignedTo.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="small fw-semibold">{tool.assignedTo.name}</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{tool.assignedTo.email}</div>
                              </div>
                            </div>
                          ) : <span className="text-muted small">—</span>}
                        </td>
                        <td className="py-3">
                          {tool.returnRequestedBy ? (
                            <span className="small fw-semibold">{tool.returnRequestedBy.name || 'Worker'}</span>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="text-muted small">{timeAgo(tool.returnRequestedAt)}</span>
                        </td>
                        <td className="py-3 pe-4">
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-success btn-sm d-flex align-items-center gap-1"
                              onClick={() => handleConfirmReturn(tool._id, tool.name)}
                              disabled={actionLoading === tool._id + '-confirm'}
                              title="Physically verify and accept the returned tool"
                            >
                              {actionLoading === tool._id + '-confirm'
                                ? <span className="spinner-border spinner-border-sm" />
                                : <><i className="bi bi-check-lg"></i> Accept</>}
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                              onClick={() => { setShowRejectModal(tool._id); setRejectReason(''); }}
                              title="Reject — tool was not actually returned"
                            >
                              <i className="bi bi-x-lg"></i> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 d-flex align-items-center gap-2" style={{ background: '#e0f2fe', borderRadius: '0 0 1rem 1rem' }}>
                <i className="bi bi-info-circle text-info"></i>
                <small className="text-info">
                  <strong>Important:</strong> Only accept a return after physically inspecting and receiving the tool.
                  Accepting without verification defeats the purpose of this workflow.
                </small>
              </div>
            </div>
          </div>
        )}

        {/* ── ALL TOOLS TABLE ── */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="fw-semibold fs-5 mb-0">All Tools</h2>
          <div className="input-group" style={{ maxWidth: 340 }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search tools or user…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card border-0 shadow-sm text-center py-5">
            <div className="card-body">
              <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">
                {tools.filter(t => t.status !== 'pending-return').length === 0 ? 'No tools yet' : 'No results found'}
              </h5>
              {tools.filter(t => t.status !== 'pending-return').length === 0 && (
                <button className="btn btn-primary mt-2" onClick={() => navigate('/manage-tools/add')}>
                  Add your first tool
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th className="px-4 py-3 fw-semibold text-muted border-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tool</th>
                    <th className="py-3 fw-semibold text-muted border-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                    <th className="py-3 fw-semibold text-muted border-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th className="py-3 fw-semibold text-muted border-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
                    <th className="py-3 fw-semibold text-muted border-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To</th>
                    <th className="py-3 pe-4 fw-semibold text-muted border-0 text-end" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(tool => {
                    const sc = statusConfig[tool.status] || { cls: 'bg-secondary', label: tool.status };
                    return (
                      <tr key={tool._id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {tool.imageUrl ? (
                              <img src={tool.imageUrl} alt={tool.name}
                                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }}
                                onError={e => { e.currentTarget.style.display = 'none'; }} />
                            ) : (
                              <div className="rounded-2 d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40, background: '#f1f5f9' }}>
                                <i className="bi bi-tools text-muted"></i>
                              </div>
                            )}
                            <div>
                              <div className="fw-semibold">{tool.name}</div>
                              {tool.location && <div className="text-muted small"><i className="bi bi-geo-alt me-1"></i>{tool.location}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-muted small">{tool.category}</td>
                        <td className="py-3">
                          <span className={`badge rounded-pill px-3 ${sc.cls}`}>{sc.label}</span>
                        </td>
                        <td className="py-3 text-muted small">{tool.availableQuantity}/{tool.totalQuantity}</td>
                        <td className="py-3">
                          {tool.assignedTo ? (
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                                style={{ width: 28, height: 28, background: '#2563eb', fontSize: '0.75rem', flexShrink: 0 }}>
                                {tool.assignedTo.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="small">{tool.assignedTo.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                        <td className="py-3 pe-4">
                          <div className="d-flex gap-1 justify-content-end flex-wrap">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => navigate(`/manage-tools/edit/${tool._id}`)}
                              title="Edit"
                            ><i className="bi bi-pencil"></i></button>

                            {tool.status === 'available' && (
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() => { setShowAssignModal(tool._id); setAssignUserId(''); }}
                                title="Assign to worker"
                              ><i className="bi bi-person-plus"></i></button>
                            )}

                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(tool._id, tool.name)}
                              disabled={actionLoading === tool._id + '-delete'}
                              title="Delete"
                            >
                              {actionLoading === tool._id + '-delete'
                                ? <span className="spinner-border spinner-border-sm" />
                                : <i className="bi bi-trash"></i>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Assign Modal ── */}
      {showAssignModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: '1rem' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Assign Tool</h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignModal(null)} />
              </div>
              <div className="modal-body pt-2">
                <p className="text-muted mb-3">
                  Assigning: <strong>{tools.find(t => t._id === showAssignModal)?.name}</strong>
                </p>
                <label className="form-label fw-semibold">Select worker</label>
                <select
                  className="form-select"
                  value={assignUserId}
                  onChange={e => setAssignUserId(e.target.value)}
                  style={{ borderRadius: '0.75rem' }}
                >
                  <option value="">Choose a user…</option>
                  {users.filter(u => u.role === 'worker').map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary" onClick={() => setShowAssignModal(null)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={handleAssign}
                  disabled={!assignUserId || actionLoading}
                >
                  {actionLoading ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Return Modal ── */}
      {showRejectModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: '1rem' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">
                  <i className="bi bi-x-circle me-2"></i>Reject Return
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowRejectModal(null)} />
              </div>
              <div className="modal-body pt-2">
                <div className="alert alert-warning py-2 mb-3 d-flex gap-2 align-items-start" style={{ borderRadius: '0.75rem' }}>
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0 mt-1"></i>
                  <small>
                    Rejecting means the tool was <strong>not physically received</strong>.
                    The tool will remain assigned to <strong>{tools.find(t => t._id === showRejectModal)?.assignedTo?.name}</strong> and they will be notified.
                  </small>
                </div>
                <label className="form-label fw-semibold">
                  Reason for rejection <span className="text-muted fw-normal">(optional)</span>
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Tool was not found at the drop-off location, missing serial sticker…"
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  style={{ borderRadius: '0.75rem' }}
                />
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary" onClick={() => setShowRejectModal(null)}>Cancel</button>
                <button
                  className="btn btn-danger"
                  onClick={handleRejectReturn}
                  disabled={actionLoading === showRejectModal + '-reject'}
                >
                  {actionLoading === showRejectModal + '-reject'
                    ? <span className="spinner-border spinner-border-sm me-1" />
                    : <i className="bi bi-x-lg me-1"></i>}
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageTools;
