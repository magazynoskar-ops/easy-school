import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api.js';

const emptySetForm = { name: '', isPublic: true };
const emptyWordDraft = { polish: '', english: '' };

const rowStyle = { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' };
const growStyle = { flex: '1 1 180px' };

const AdminSets = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [setForm, setSetForm] = useState(emptySetForm);
  const [words, setWords] = useState([]);
  const [wordDraft, setWordDraft] = useState(emptyWordDraft);
  const [editingWordIndex, setEditingWordIndex] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSets = async () => {
    try {
      setLoading(true);
      const res = await api.getSets();
      setSets(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Nie mozna pobrac zestawow');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, []);

  const openCreate = () => {
    setEditingId('new');
    setSetForm(emptySetForm);
    setWords([]);
    setWordDraft(emptyWordDraft);
    setEditingWordIndex(null);
    setError(null);
  };

  const openEdit = (setItem) => {
    setEditingId(setItem._id);
    setSetForm({ name: setItem.name, isPublic: !!setItem.isPublic });
    setWords((setItem.words || []).map((w) => ({ polish: w.polish, english: w.english })));
    setWordDraft(emptyWordDraft);
    setEditingWordIndex(null);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSetForm(emptySetForm);
    setWords([]);
    setWordDraft(emptyWordDraft);
    setEditingWordIndex(null);
    setError(null);
  };

  const startEditWord = (index) => {
    const word = words[index];
    setWordDraft({ polish: word.polish, english: word.english });
    setEditingWordIndex(index);
  };

  const resetWordDraft = () => {
    setWordDraft(emptyWordDraft);
    setEditingWordIndex(null);
  };

  const addOrUpdateWord = () => {
    const polish = wordDraft.polish.trim();
    const english = wordDraft.english.trim();
    if (!polish || !english) {
      setError('Uzupelnij oba pola slowa: Polski i English');
      return;
    }

    if (editingWordIndex !== null) {
      setWords((prev) => prev.map((item, idx) => (idx === editingWordIndex ? { polish, english } : item)));
    } else {
      setWords((prev) => [...prev, { polish, english }]);
    }
    resetWordDraft();
    setError(null);
  };

  const removeWord = (index) => {
    setWords((prev) => prev.filter((_, idx) => idx !== index));
    if (editingWordIndex === index) {
      resetWordDraft();
    }
  };

  const saveSet = async () => {
    const name = setForm.name.trim();
    if (!name) {
      setError('Nazwa zestawu jest wymagana');
      return;
    }
    if (words.length === 0) {
      setError('Dodaj przynajmniej jedno slowo');
      return;
    }

    try {
      const payload = { name, isPublic: setForm.isPublic, words };
      if (editingId === 'new') {
        const res = await api.createSet(payload);
        setSets((prev) => [res.data, ...prev]);
      } else {
        const res = await api.updateSet(editingId, payload);
        setSets((prev) => prev.map((item) => (item._id === editingId ? res.data : item)));
      }
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || 'Nie mozna zapisac zestawu');
    }
  };

  const removeSet = async (id) => {
    try {
      await api.deleteSet(id);
      setSets((prev) => prev.filter((item) => item._id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Nie mozna usunac zestawu');
    }
  };

  return (
    <main className="page stack-md">
      <h1 className="title">Admin: zarzadzanie zestawami</h1>
      <div style={rowStyle}>
        <button type="button" className="btn" onClick={() => navigate('/admin')}>Wroc do panelu admina</button>
        <button type="button" className="btn" onClick={openCreate}>Dodaj nowy zestaw</button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {loading && <div className="surface form-card">Ladowanie...</div>}

      {editingId && (
        <section className="surface form-card stack-md">
          <h2 className="title">{editingId === 'new' ? 'Nowy zestaw' : 'Edytuj zestaw'}</h2>

          <input
            className="field"
            value={setForm.name}
            onChange={(e) => setSetForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Nazwa zestawu"
          />

          <label style={rowStyle}>
            <input
              type="checkbox"
              checked={setForm.isPublic}
              onChange={(e) => setSetForm((prev) => ({ ...prev, isPublic: e.target.checked }))}
            />
            <span>Publiczny zestaw</span>
          </label>

          <div className="surface form-card stack-sm">
            <h3>Slowa w zestawie</h3>
            {words.length === 0 && <p className="muted">Brak slow. Dodaj pierwsze slowo.</p>}
            {words.map((word, index) => (
              <div key={`${word.polish}-${word.english}-${index}`} style={rowStyle}>
                <div style={growStyle}><strong>{word.polish}</strong></div>
                <div style={growStyle}>{word.english}</div>
                <button type="button" className="btn" onClick={() => startEditWord(index)}>Edytuj</button>
                <button type="button" className="btn" onClick={() => removeWord(index)}>Usun</button>
              </div>
            ))}
          </div>

          <div className="surface form-card stack-sm">
            <h3>{editingWordIndex !== null ? 'Edycja slowa' : 'Dodaj slowo'}</h3>
            <div style={rowStyle}>
              <input
                className="field"
                style={growStyle}
                value={wordDraft.polish}
                onChange={(e) => setWordDraft((prev) => ({ ...prev, polish: e.target.value }))}
                placeholder="Polski"
              />
              <input
                className="field"
                style={growStyle}
                value={wordDraft.english}
                onChange={(e) => setWordDraft((prev) => ({ ...prev, english: e.target.value }))}
                placeholder="English"
              />
            </div>
            <div style={rowStyle}>
              <button type="button" className="btn" onClick={addOrUpdateWord}>
                {editingWordIndex !== null ? 'Zapisz slowo' : 'Dodaj slowo'}
              </button>
              {editingWordIndex !== null && (
                <button type="button" className="btn" onClick={resetWordDraft}>Anuluj edycje slowa</button>
              )}
            </div>
          </div>

          <div style={rowStyle}>
            <button type="button" className="btn" onClick={saveSet}>Zapisz zestaw</button>
            <button type="button" className="btn" onClick={cancelEdit}>Anuluj</button>
          </div>
        </section>
      )}

      {!loading && (
        <section className="sets-grid">
          {sets.map((setItem) => (
            <article key={setItem._id} className="set-tile stack-sm">
              <h3>{setItem.name}</h3>
              <p className="muted">Slow: {(setItem.words || []).length}</p>
              <span className="pill">{setItem.isPublic ? 'Publiczny' : 'Prywatny'}</span>
              <div style={rowStyle}>
                <button type="button" className="btn" onClick={() => openEdit(setItem)}>Edytuj</button>
                <button type="button" className="btn" onClick={() => removeSet(setItem._id)}>Usun</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default AdminSets;
