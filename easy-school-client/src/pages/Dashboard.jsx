import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api.js';
import WordSetCard from '../components/WordSetCard.jsx';
import { useAuth } from '../context/useAuth.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sets, setSets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await api.getSets();
        if (!ignore) setSets(res.data);
      } catch {
        if (!ignore) setError('Nie mozna pobrac zestawow');
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="page stack-md">
      <h1 className="title">
        Witaj, {user.role === 'admin' ? 'Administratorze' : 'Uzytkowniku'}
      </h1>

      {user.role === 'admin' && (
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="btn"
        >
          Panel admina
        </button>
      )}

      {error && <div className="alert-error">{error}</div>}

      <section className="sets-grid">
        {sets.map((set) => (
          <WordSetCard key={set._id} set={set} />
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
