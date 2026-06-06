import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'worker',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      triggerShake();
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      login(response.data.token, response.data);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1400);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: '#ef4444', width: '25%' };
    if (p.length < 8) return { label: 'Weak', color: '#f59e0b', width: '50%' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Strong', color: '#10b981', width: '100%' };
    return { label: 'Fair', color: '#3b82f6', width: '75%' };
  };
  const strength = passwordStrength();

  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="d-flex min-vh-100" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>

      {/* Left panel */}
      <div className="d-none d-lg-flex flex-column justify-content-between p-5 text-white" style={{ flex: '0 0 42%' }}>
        <button className="btn btn-link text-white text-decoration-none p-0 d-flex align-items-center gap-2" onClick={() => navigate('/')}>
          <img src="/toolTrackIcon.png" alt="ToolTrack" style={{ width: 36, height: 36, borderRadius: 10 }} onError={e => { e.currentTarget.style.display = 'none'; }} />
          <span className="fw-bold fs-4" style={{ letterSpacing: '-0.5px' }}>ToolTrack</span>
        </button>

        <div className="slide-in-left">
          <h2 className="fw-black mb-4" style={{ fontSize: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
            Get started in<br />under a minute.
          </h2>
          <p className="opacity-80 mb-5" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            Create your account and start managing your tool inventory immediately. No credit card required.
          </p>
          <div className="d-flex flex-column gap-3">
            {[
              ['bi-person-fill', 'Admin role: full control over tools and users'],
              ['bi-person-badge', 'Worker role: view and return assigned tools'],
              ['bi-lock-fill', 'JWT-secured authentication from day one'],
            ].map(([icon, text], i) => (
              <div key={text} className={`d-flex align-items-center gap-2 fade-in-up stagger-${i + 1}`} style={{ opacity: 0.9 }}>
                <i className={`bi ${icon}`} style={{ color: '#93c5fd', flexShrink: 0 }}></i>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Tool icon decorations */}
          <div className="d-flex gap-4 mt-5 opacity-25">
            <i className="bi bi-tools float-b" style={{ fontSize: '1.8rem' }}></i>
            <i className="bi bi-box-seam float-a" style={{ fontSize: '1.8rem' }}></i>
            <i className="bi bi-rulers float-c" style={{ fontSize: '1.8rem' }}></i>
            <i className="bi bi-lightning-charge float-b" style={{ fontSize: '1.8rem', animationDelay: '1.5s' }}></i>
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

          <div className={`card border-0 shadow-lg ${shaking ? 'shake' : ''}`} style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-5">

              {success ? (
                /* ── Success state ── */
                <div className="text-center py-3 success-reveal">
                  <div className="pop-in d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: 80, height: 80, background: '#d1fae5' }}>
                    <i className="bi bi-check-lg text-success" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                  <h4 className="fw-black text-success mb-1">Account created!</h4>
                  <p className="text-muted mb-1">Welcome to ToolTrack,</p>
                  <p className="fw-semibold mb-0">{formData.name}</p>
                  <div className="spinner-border spinner-border-sm text-success mt-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                /* ── Registration form ── */
                <>
                  <h3 className="fw-black mb-1" style={{ letterSpacing: '-0.5px' }}>Create your account</h3>
                  <p className="text-muted mb-4">Join ToolTrack and start managing tools today.</p>

                  {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2 fade-in-up" style={{ borderRadius: '0.75rem' }}>
                      <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Full name</label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${formData.name.length >= 2 ? 'field-valid' : ''}`}
                        id="name"
                        name="name"
                        placeholder="Jane Smith"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0.75rem' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Email address</label>
                      <input
                        type="email"
                        className={`form-control form-control-lg ${formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'field-valid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0.75rem' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="role" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Role</label>
                      <div className="d-flex gap-2">
                        {['worker', 'admin'].map(r => (
                          <label
                            key={r}
                            className="flex-fill d-flex align-items-center gap-2 p-3 rounded-3 border"
                            style={{
                              cursor: 'pointer',
                              borderColor: formData.role === r ? '#2563eb' : '#e2e8f0',
                              background: formData.role === r ? '#dbeafe' : '#fff',
                              transition: 'all 0.15s',
                            }}
                          >
                            <input
                              type="radio"
                              name="role"
                              value={r}
                              checked={formData.role === r}
                              onChange={handleChange}
                              className="d-none"
                            />
                            <i className={`bi ${r === 'admin' ? 'bi-shield-lock' : 'bi-person'}`}
                              style={{ color: formData.role === r ? '#2563eb' : '#64748b' }}></i>
                            <div>
                              <div className="fw-semibold text-capitalize" style={{ fontSize: '0.85rem' }}>{r}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {r === 'admin' ? 'Full access' : 'View & return'}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-control form-control-lg border-end-0 ${strength?.label === 'Strong' ? 'field-valid' : ''}`}
                          id="password"
                          name="password"
                          placeholder="Min. 6 characters"
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
                      {strength && (
                        <div className="mt-2">
                          <div className="d-flex justify-content-between mb-1">
                            <small className="text-muted">Password strength</small>
                            <small style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</small>
                          </div>
                          <div className="progress" style={{ height: 4, borderRadius: 2 }}>
                            <div className="progress-bar" style={{ width: strength.width, background: strength.color, transition: 'width 0.3s' }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Confirm password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-control form-control-lg ${passwordsMatch ? 'field-valid' : ''} ${passwordsMismatch ? 'field-invalid' : ''}`}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          style={{ borderRadius: '0.75rem' }}
                        />
                        {passwordsMatch && (
                          <span className="input-group-text bg-white" style={{ borderRadius: '0 0.75rem 0.75rem 0', color: '#10b981' }}>
                            <i className="bi bi-check-circle-fill"></i>
                          </span>
                        )}
                      </div>
                      {passwordsMismatch && (
                        <small className="text-danger mt-1 d-block">
                          <i className="bi bi-exclamation-circle me-1"></i>Passwords do not match
                        </small>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 fw-semibold"
                      disabled={loading || passwordsMismatch}
                      style={{ borderRadius: '0.75rem' }}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Creating account…</>
                      ) : (
                        <><i className="bi bi-person-plus me-2"></i>Create Account</>
                      )}
                    </button>
                  </form>

                  <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">Sign in</Link>
                  </p>
                </>
              )}
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

export default Register;
