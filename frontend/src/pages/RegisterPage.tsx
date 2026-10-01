import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (token) return <Navigate to="/" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Registration failed';
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
          <h1>Join your campus workspace.</h1>
          <p>Create a student account and explore the shared course catalog.</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="muted">Self-registration creates a student role.</p>

          <form onSubmit={onSubmit}>
            <label>
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
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
                minLength={6}
                required
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Register'}
            </button>
          </form>

          <p className="muted" style={{ marginTop: '1rem' }}>
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
