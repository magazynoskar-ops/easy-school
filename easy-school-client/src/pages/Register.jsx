import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      setError('Nazwa uzytkownika jest wymagana');
      return;
    }
    if (!trimmedEmail) {
      setError('Email jest wymagany');
      return;
    }
    if (password.length < 6) {
      setError('Haslo musi miec co najmniej 6 znakow');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await register(trimmedUsername, trimmedEmail, password);
      if (data.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Blad rejestracji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-centered">
      <form onSubmit={handleSubmit} acceptCharset="UTF-8" className="surface form-card stack-md">
        <h2 className="title">Rejestracja</h2>
        {error && <div className="alert-error">{error}</div>}
        <div className="stack-sm">
          <label htmlFor="register-username">Nazwa uzytkownika</label>
          <input
            id="register-username"
            type="text"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="field"
            required
          />
        </div>
        <div className="stack-sm">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            required
          />
        </div>
        <div className="stack-sm">
          <label htmlFor="register-password">Haslo</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            required
          />
        </div>
        <button type="submit" className="btn btn-block" disabled={loading}>
          {loading ? 'Rejestrowanie...' : 'Zarejestruj'}
        </button>
        <p className="muted">
          Masz konto? <Link to="/login">Zaloguj sie</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

