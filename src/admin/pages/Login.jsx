import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import '../admin.css';

function Login() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    const redirectTo = location.state?.from || '/admin';
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      // Only a 400/401 means the credentials were rejected. Everything else
      // (rate limiting, a blocked origin, server or network errors) must not
      // be reported as "wrong password", or the real cause stays hidden.
      if (err.status === 400 || err.status === 401) {
        setError('Unable to sign in. Check your credentials and try again.');
      } else if (err.status === 429) {
        setError('Too many sign-in attempts. Please wait 15 minutes and try again.');
      } else {
        setError(`Sign-in is unavailable right now (${err.status ? `HTTP ${err.status}` : 'network error'}). Please try again later.`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">Wolfpack.fm Admin</div>

        <form onSubmit={handleSubmit}>
          {error && <div className="admin-error">{error}</div>}

          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-button admin-button--primary" disabled={submitting}>
            {submitting ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
