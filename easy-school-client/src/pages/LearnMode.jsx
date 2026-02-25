import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api.js';
import { useAuth } from '../context/useAuth.jsx';

function shuffle(items) {
  return items.slice().sort(() => Math.random() - 0.5);
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function prepareQueue(words, mode) {
  const base = (words || []).map((word) => ({ polish: word.polish, english: word.english }));
  if (mode === 'mixed') {
    return shuffle(base.flatMap((word) => ([
      { ...word, direction: 'en-pl' },
      { ...word, direction: 'pl-en' }
    ])));
  }
  const direction = mode === 'pl-en' ? 'pl-en' : 'en-pl';
  return shuffle(base).map((word) => ({ ...word, direction }));
}

const LearnMode = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setId, mode } = useParams();
  const [set, setSet] = useState(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = user ? await api.getSets() : await api.getPublicSets();
        const found = res.data.find((item) => item._id === setId);
        if (!found && !ignore) return setError('Nie znaleziono zestawu');
        if (!ignore) {
          setSet(found);
          setQueue(prepareQueue(found.words || [], mode));
        }
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Blad ladowania');
      }
    })();
    return () => { ignore = true; };
  }, [setId, mode, user]);

  const current = queue[index];
  const total = queue.length;
  const done = total > 0 && index >= total;

  const prompt = useMemo(() => (
    current ? (current.direction === 'pl-en' ? current.polish : current.english) : ''
  ), [current]);
  const expected = useMemo(() => (
    current ? (current.direction === 'pl-en' ? current.english : current.polish) : ''
  ), [current]);

  const check = () => {
    if (!current) return;
    const ok = normalize(answer) === normalize(expected);
    if (ok) {
      setScore((prev) => prev + 1);
      setFeedback('Poprawnie');
    } else {
      setFeedback(`Bledne, poprawna odpowiedz to: ${expected}`);
    }
  };

  const next = () => {
    setAnswer('');
    setFeedback(null);
    setIndex((prev) => prev + 1);
  };

  if (error) return <main className="page"><div className="alert-error">{error}</div></main>;
  if (!set) return <main className="page"><div className="surface form-card">Ladowanie...</div></main>;

  if (done) {
    return (
      <main className="page-centered">
        <section className="surface form-card stack-md">
          <h2 className="title">Koniec nauki</h2>
          <p>Wynik: {score} / {total}</p>
          <button type="button" className="btn btn-block mode-btn" onClick={() => navigate('/dashboard')}>
            Powrot do zestawow
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="surface form-card stack-md">
        <h2 className="title">{set.name}</h2>
        <p className="muted counter-text">Slowka: {score} / {total}</p>
        <p className="muted counter-text">Slowo {index + 1} z {total}</p>

        <div className="set-tile"><strong>{prompt}</strong></div>
        <input
          className="field"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={!!feedback}
          placeholder="Wpisz tlumaczenie"
        />

        {!feedback && <button type="button" className="btn btn-block mode-btn" onClick={check}>Sprawdz</button>}
        {feedback && (
          <div className="stack-sm">
            <div className={feedback === 'Poprawnie' ? 'pill' : 'alert-error'}>{feedback}</div>
            <button type="button" className="btn btn-block mode-btn" onClick={next}>Dalej</button>
          </div>
        )}
      </section>
    </main>
  );
};

export default LearnMode;
