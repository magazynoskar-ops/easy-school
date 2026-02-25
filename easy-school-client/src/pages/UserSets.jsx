import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api.js';
import { useAuth } from '../context/useAuth.jsx';

const MODES = [
  { id: 'en-pl', label: 'angielski -> polski' },
  { id: 'pl-en', label: 'polski -> angielski' },
  { id: 'mixed', label: 'mieszany' }
];

const UserSets = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sets, setSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = user ? await api.getSets() : await api.getPublicSets();
        if (!ignore) {
          setSets(res.data);
          setError(null);
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 && user) {
          logout();
          try {
            const fallbackRes = await api.getPublicSets();
            if (!ignore) {
              setSets(fallbackRes.data);
              setError(null);
            }
          } catch (fallbackErr) {
            if (!ignore) {
              setError(fallbackErr.response?.data?.message || 'Nie mozna pobrac zestawow');
            }
          }
          return;
        }
        if (!ignore) setError(err.response?.data?.message || 'Nie mozna pobrac zestawow');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [user, logout]);

  useEffect(() => {
    document.body.style.overflow = selectedSetId ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSetId]);

  const selectedSet = useMemo(
    () => sets.find((set) => set._id === selectedSetId) || null,
    [sets, selectedSetId]
  );

  return (
    <main className="page stack-md">
      <h1 className="title">Zestawy slowek</h1>
      {error && <div className="alert-error">{error}</div>}
      {loading && <div className="surface form-card">Ladowanie...</div>}

      {!loading && (
        <section className="sets-grid">
          {sets.map((set) => (
            <article
              key={set._id}
              className="set-tile stack-sm"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedSetId(set._id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') setSelectedSetId(set._id);
              }}
            >
              <h3>{set.name}</h3>
              <p className="muted">Liczba slow: {(set.words || []).length}</p>
              {set.isPublic && <span className="pill">Publiczny</span>}
            </article>
          ))}
        </section>
      )}

      {selectedSet && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card stack-md">
            <h2 className="title">Wybierz tryb nauki</h2>
            <p><strong>{selectedSet.name}</strong></p>
            <div className="mode-grid">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className="mode-tile"
                  onClick={() => navigate(`/learn/${selectedSet._id}/${mode.id}`)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-block" onClick={() => setSelectedSetId(null)}>
              Powrot
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserSets;
