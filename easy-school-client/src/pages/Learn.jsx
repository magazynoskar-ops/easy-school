import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api.js';
import ModeSelector from '../components/ModeSelector.jsx';

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function resolveDirection(mode, presetDirection) {
  if (mode === 'en-pl' || mode === 'test') return 'en-pl';
  if (mode === 'pl-en') return 'pl-en';
  return presetDirection || (Math.random() < 0.5 ? 'en-pl' : 'pl-en');
}

const Learn = () => {
  const { setId } = useParams();
  const navigate = useNavigate();
  const [set, setSet] = useState(null);
  const [mode, setMode] = useState(null);
  const [error, setError] = useState(null);
  const [queue, setQueue] = useState([]);
  const [position, setPosition] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [direction, setDirection] = useState('en-pl');

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await api.getSets();
        const found = res.data.find((x) => x._id === setId);
        if (!found && !ignore) {
          setError('Zestaw nie zostal znaleziony');
          return;
        }
        if (!ignore) setSet(found);
      } catch {
        if (!ignore) setError('Blad ladowania zestawu');
      }
    })();

    return () => {
      ignore = true;
    };
  }, [setId]);

  const prepareQueue = (selectedMode, count) => {
    if (!set) return [];
    const words = shuffle(set.words || []);
    if (selectedMode === 'test') return words.slice(0, count);
    return words;
  };

  const handleMode = (selectedMode, count) => {
    const q = prepareQueue(selectedMode, count);
    setMode(selectedMode);
    setQueue(q);
    setPosition(0);
    setResults([]);
    setFeedback(null);
    setUserAnswer('');
    setDirection(resolveDirection(selectedMode));
  };

  const current = queue[position];
  const total = queue.length;

  const checkAnswer = () => {
    if (!current) return;
    const expected = direction === 'en-pl' ? current.polish : current.english;
    const correct = userAnswer.trim().toLowerCase() === String(expected || '').toLowerCase();
    setResults((prev) => [...prev, correct]);
    setFeedback(correct ? 'Poprawnie' : 'Blednie');
  };

  const nextWord = () => {
    const nextPosition = position + 1;
    setUserAnswer('');
    setFeedback(null);
    setPosition(nextPosition);
    if (nextPosition < total) setDirection(resolveDirection(mode));
  };

  if (error) {
    return (
      <main className="page">
        <div className="alert-error">{error}</div>
      </main>
    );
  }

  if (!mode) {
    return (
      <main className="page">
        <ModeSelector onSelect={handleMode} />
      </main>
    );
  }

  if (position >= total) {
    const correctCount = results.filter(Boolean).length;
    return (
      <main className="page-centered">
        <section className="surface form-card stack-md">
          <h2 className="title">Wynik</h2>
          <p>{correctCount} / {total} poprawnie</p>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-block">
            Powrot
          </button>
        </section>
      </main>
    );
  }

  const questionText = direction === 'en-pl' ? current.english : current.polish;

  return (
    <main className="page">
      <section className="surface form-card stack-md">
        <p className="muted">{position + 1} / {total}</p>
        <h3 className="title">{questionText}</h3>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={!!feedback}
          className="field"
        />
        {!feedback && (
          <button type="button" onClick={checkAnswer} className="btn">
            Sprawdz
          </button>
        )}
        {feedback && (
          <div className="stack-sm">
            <span>{feedback}</span>
            <button type="button" onClick={nextWord} className="btn">
              Dalej
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Learn;
