import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: 'bi-tools',
    title: 'Inventory Management',
    desc: 'Maintain a complete record of every tool — category, condition, location, and quantity — all in one place.',
    color: '#2563eb',
    bg: '#dbeafe',
  },
  {
    icon: 'bi-person-check',
    title: 'Tool Assignment',
    desc: 'Assign tools to workers in seconds. Track who has what and when it was checked out.',
    color: '#059669',
    bg: '#d1fae5',
  },
  {
    icon: 'bi-shield-lock',
    title: 'Role-Based Access',
    desc: "Admins manage everything; workers see only what's relevant to them. Secure by design.",
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    icon: 'bi-graph-up',
    title: 'Live Status Tracking',
    desc: 'Know at a glance which tools are available, in use, or damaged — in real time.',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    icon: 'bi-arrow-return-left',
    title: 'Easy Returns',
    desc: 'Workers can return tools with a single click, automatically updating availability counts.',
    color: '#0891b2',
    bg: '#cffafe',
  },
  {
    icon: 'bi-search',
    title: 'Search & Filter',
    desc: 'Find any tool instantly by name, category, or status — even across large inventories.',
    color: '#e11d48',
    bg: '#ffe4e6',
  },
];

const steps = [
  { step: '01', title: 'Register your team', desc: 'Create admin and worker accounts with role-based permissions.' },
  { step: '02', title: 'Add your tools', desc: 'Enter tools with details like category, condition, quantity, and location.' },
  { step: '03', title: 'Assign & track', desc: 'Assign tools to workers and monitor availability in real time.' },
];

const stats = [
  { value: 'Real-time', label: 'Status Updates' },
  { value: '2 Roles', label: 'Admin & Worker' },
  { value: 'REST API', label: 'Clean Architecture' },
  { value: 'JWT', label: 'Secure Auth' },
];

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f8fafc' }}>

      {/* ── Navigation ── */}
      <nav className="navbar navbar-expand shadow-sm sticky-top" style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-2">
            <img src="/toolTrackIcon.png" alt="ToolTrack" style={{ width: 32, height: 32, borderRadius: 8 }} onError={e => { e.currentTarget.style.display = 'none'; }} />
            <span className="fw-bold fs-5" style={{ color: '#2563eb', letterSpacing: '-0.3px' }}>ToolTrack</span>
          </div>
          <div className="d-flex gap-2 ms-auto">
            {user ? (
              <>
                <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/dashboard')}>Dashboard</button>
              </>
            ) : (
              <>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/login')}>Sign In</button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)', padding: '6rem 0 5rem' }}>
        <div className="container text-center text-white">
          <div className="mb-3">
            <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(255,255,255,0.15)', fontSize: '0.85rem' }}>
              <i className="bi bi-lightning-charge-fill me-1"></i>Full-Stack MERN Application
            </span>
          </div>
          <h1 className="fw-black mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Tool Management,<br />
            <span style={{ color: '#93c5fd' }}>Simplified.</span>
          </h1>
          <p className="mb-5 mx-auto opacity-90" style={{ fontSize: '1.2rem', maxWidth: 580, lineHeight: 1.7 }}>
            ToolTrack gives your organization a single source of truth for every tool — who has it, where it is, and whether it's ready to use.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {user ? (
              <button className="btn btn-light btn-lg fw-semibold px-5" onClick={() => navigate('/dashboard')}>
                <i className="bi bi-speedometer2 me-2"></i>Go to Dashboard
              </button>
            ) : (
              <>
                <button className="btn btn-light btn-lg fw-semibold px-5" onClick={() => navigate('/register')}>
                  Get Started Free
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
                <button className="btn btn-outline-light btn-lg px-5" onClick={() => navigate('/login')}>
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Hero visual */}
          <div className="mt-5 pt-2">
            <div className="card border-0 shadow-xl mx-auto text-start" style={{ maxWidth: 680, borderRadius: '1rem', overflow: 'hidden' }}>
              <div style={{ background: '#1e293b', padding: '0.6rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ width: 12, height: 12, background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ width: 12, height: 12, background: '#f59e0b', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ width: 12, height: 12, background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ marginLeft: '0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>ToolTrack Dashboard</span>
              </div>
              <div className="p-4" style={{ background: '#f8fafc' }}>
                <div className="row g-3 mb-3">
                  {[['12', 'Total Tools', '#2563eb', '#dbeafe'], ['8', 'Available', '#059669', '#d1fae5'], ['3', 'In Use', '#d97706', '#fef9c3']].map(([v, l, c, bg]) => (
                    <div key={l} className="col-4">
                      <div className="card border-0 shadow-sm text-center py-2">
                        <div className="fw-black fs-3" style={{ color: c }}>{v}</div>
                        <div className="text-muted small">{l}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {[
                  ['Cordless Drill', 'Power Tools', 'available', '✓ Available'],
                  ['Tape Measure', 'Measuring Tools', 'in-use', '● In Use'],
                  ['Safety Helmet', 'Safety Equipment', 'available', '✓ Available'],
                ].map(([name, cat, status, label]) => (
                  <div key={name} className="card border-0 mb-2 px-3 py-2 d-flex flex-row align-items-center justify-content-between shadow-sm">
                    <div>
                      <div className="fw-semibold small">{name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{cat}</div>
                    </div>
                    <span className={`badge rounded-pill px-3 ${status === 'available' ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: '0.75rem' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: '#1e3a8a', padding: '2rem 0' }}>
        <div className="container">
          <div className="row g-3 text-center text-white">
            {stats.map(({ value, label }) => (
              <div key={label} className="col-6 col-md-3">
                <div className="fw-black fs-4" style={{ color: '#93c5fd' }}>{value}</div>
                <div style={{ opacity: 0.75, fontSize: '0.875rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-black mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.5px' }}>
              Everything you need to manage tools
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 520, fontSize: '1.05rem' }}>
              A complete toolkit built for teams that rely on physical equipment every day.
            </p>
          </div>
          <div className="row g-4">
            {features.map(({ icon, title, desc, color, bg }) => (
              <div key={title} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100 hover-lift" style={{ borderRadius: '1rem' }}>
                  <div className="card-body p-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3" style={{ width: 48, height: 48, background: bg }}>
                      <i className={`bi ${icon} fs-4`} style={{ color }}></i>
                    </div>
                    <h5 className="fw-bold mb-2">{title}</h5>
                    <p className="text-muted mb-0" style={{ lineHeight: 1.65 }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: '#f1f5f9', padding: '5rem 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-black mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.5px' }}>
              Up and running in minutes
            </h2>
            <p className="text-muted" style={{ fontSize: '1.05rem' }}>Three simple steps to get your team tracking tools.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="col-md-4">
                <div className="text-center">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 fw-black fs-4"
                    style={{ width: 64, height: 64, background: '#2563eb', color: '#fff' }}>
                    {step}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="d-none d-md-block position-absolute" style={{ top: '2rem', left: '75%', width: '50%', height: 2, background: '#cbd5e1' }}></div>
                  )}
                  <h5 className="fw-bold mb-2">{title}</h5>
                  <p className="text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-black mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.5px' }}>
              Built on a modern stack
            </h2>
            <p className="text-muted" style={{ fontSize: '1.05rem' }}>Production-ready MERN architecture with clean separation of concerns.</p>
          </div>
          <div className="row g-3 justify-content-center text-center">
            {[
              ['bi-database', 'MongoDB', 'Atlas cloud database', '#10b981', '#d1fae5'],
              ['bi-server', 'Express.js', 'RESTful API backend', '#6366f1', '#e0e7ff'],
              ['bi-code-square', 'React 18', 'Vite-powered frontend', '#3b82f6', '#dbeafe'],
              ['bi-cpu', 'Node.js', 'JavaScript runtime', '#22c55e', '#dcfce7'],
            ].map(([icon, name, sub, color, bg]) => (
              <div key={name} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm h-100 hover-lift" style={{ borderRadius: '1rem' }}>
                  <div className="card-body py-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3" style={{ width: 52, height: 52, background: bg }}>
                      <i className={`bi ${icon} fs-3`} style={{ color }}></i>
                    </div>
                    <div className="fw-bold">{name}</div>
                    <div className="text-muted small">{sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '5rem 0' }}>
        <div className="container text-center text-white">
          <h2 className="fw-black mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.5px' }}>
            Ready to take control of your tools?
          </h2>
          <p className="mb-5 opacity-80" style={{ fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 2.5rem' }}>
            Create an account and start managing your organization's tool inventory today.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {user ? (
              <button className="btn btn-light btn-lg fw-semibold px-5" onClick={() => navigate('/dashboard')}>
                <i className="bi bi-speedometer2 me-2"></i>Go to Dashboard
              </button>
            ) : (
              <>
                <button className="btn btn-light btn-lg fw-semibold px-5" onClick={() => navigate('/register')}>
                  Create Free Account
                </button>
                <button className="btn btn-outline-light btn-lg px-5" onClick={() => navigate('/view-tools')}>
                  Browse Demo
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0f172a', padding: '2rem 0' }}>
        <div className="container text-center" style={{ color: '#64748b', fontSize: '0.875rem' }}>
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <img src="/toolTrackIcon.png" alt="ToolTrack" style={{ width: 22, height: 22, borderRadius: 5, opacity: 0.7 }} onError={e => { e.currentTarget.style.display = 'none'; }} />
            <span className="fw-semibold" style={{ color: '#94a3b8' }}>ToolTrack</span>
          </div>
          <p className="mb-0">© {new Date().getFullYear()} ToolTrack. Built with React, Node.js, Express &amp; MongoDB.</p>
        </div>
      </footer>

    </div>
  );
};

export default Welcome;
