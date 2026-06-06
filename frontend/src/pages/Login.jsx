import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../../api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      login(response.data.token, response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>

      {/* Left panel — branding */}
      <div className="d-none d-lg-flex flex-column justify-content-between p-5 text-white" style={{ flex: '0 0 42%' }}>
        <button className="btn btn-link text-white text-decoration-none p-0 d-flex align-items-center gap-2" onClick={() => navigate('/')}>
          <img src="/toolTrackIcon.png" alt="ToolTrack" style={{ width: 36, height: 36, borderRadius: 10 }} onError={e => { e.currentTarget.style.display = 'none'; }} />
          <span className="fw-bold fs-4" style={{ letterSpacing: '-0.5px' }}>ToolTrack</span>
        </button>

        <div>
          <h2 className="fw-black mb-4" style={{ fontSize: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
            Manage your tools.<br />Empower your team.
          </h2>
          <p className="opacity-80 mb-5" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            ToolTrack gives your organization real-time visibility into every tool — who has it, where it is, and whether it's ready to use.
          </p>
          <div className="d-flex flex-column gap-3">
            {[
              ['bi-check-circle-fill', 'Role-based access for admins and workers'],
              ['bi-check-circle-fill', 'Assign, track, and return tools easily'],
              ['bi-check-circle-fill', 'Real-time availability status'],
            ].map(([icon, text]) => (
              <div key={text} className="d-flex align-items-center gap-2" style={{ opacity: 0.9 }}>
                <i className={`bi ${icon}`} style={{ color: '#93c5fd', flexShrink: 0 }}></i>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mb-0 opacity-50" style={{ fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} ToolTrack
        </p>
      </div>

      {/* Right panel — form */}
      <div className="d-flex flex-grow-1 align-items-center justify-content-center p-4" style={{ background: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div className="d-flex d-lg-none align-items-center gap-2 justify-content-center mb-4">
            <img src="/toolTrackIcon.png" alt="ToolTrack" style={{ width: 32, height: 32, borderRadius: 8 }} onError={e => { e.currentTarget.style.display = 'none'; }} />
            <span className="fw-bold fs-5" style={{ color: '#2563eb' }}>ToolTrack</span>
          </div>

          <div className="card border-0 shadow-lg" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-5">
              <h3 className="fw-black mb-1" style={{ letterSpacing: '-0.5px' }}>Welcome back</h3>
              <p className="text-muted mb-4">Sign in to your ToolTrack account.</p>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2" style={{ borderRadius: '0.75rem' }}>
                  <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Email address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '0.75rem' }}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-control-lg border-end-0"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '0.75rem 0 0 0.75rem' }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ borderRadius: '0 0.75rem 0.75rem 0' }}
                      tabIndex={-1}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 fw-semibold"
                  disabled={loading}
                  style={{ borderRadius: '0.75rem' }}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Signing in…</>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-primary fw-semibold text-decoration-none">Create one</Link>
              </p>
            </div>
          </div>

          <p className="text-center mt-3 text-muted" style={{ fontSize: '0.8rem' }}>
            <Link to="/" className="text-muted text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i>Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
