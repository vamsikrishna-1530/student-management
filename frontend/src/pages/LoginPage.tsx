import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sms.edu');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (token) return <Navigate to="/" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Login failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div>
          <div className="brand-mark" style={{ marginBottom: '1.5rem' }}>
            CampusLedger
          </div>
          <h1>Manage every student journey in one place.</h1>
          <p>
            Track enrollments, courses, and academic status with a clean MERN
            workflow built for colleges.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="muted">Sign in to continue to your campus dashboard.</p>

          <form onSubmit={onSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="muted" style={{ marginTop: '1rem' }}>
            New here? <Link to="/register">Create an account</Link>
          </p>

          <div className="demo-box">
            Demo admin: <code>admin@sms.edu</code> / <code>Admin@123</code>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
