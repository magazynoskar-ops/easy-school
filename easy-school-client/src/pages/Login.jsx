import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Blad logowania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-centered">
      <form onSubmit={handleSubmit} acceptCharset="UTF-8" className="surface form-card stack-md">
        <h2 className="title">Logowanie</h2>
        {error && <div className="alert-error">{error}</div>}
        <div className="stack-sm">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            required
          />
        </div>
        <div className="stack-sm">
          <label htmlFor="login-password">Haslo</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-block">
          {loading ? 'Logowanie...' : 'Zaloguj'}
        </button>
        <p className="muted">
          Nie masz konta? <Link to="/register">Zarejestruj sie</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

