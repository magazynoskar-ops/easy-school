import React, { useState } from 'react';

const ModeSelector = ({ onSelect }) => {
  const modes = [
    { id: 'en-pl', label: 'English to Polish' },
    { id: 'pl-en', label: 'Polish to English' },
    { id: 'mixed', label: 'Mixed' },
    { id: 'test', label: 'Test' }
  ];
  const [testCount, setTestCount] = useState(5);

  return (
    <div className="surface page stack-md">
      <h2 className="title">Choose Mode</h2>
      <div className="stack-sm">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className="btn btn-block"
            onClick={() => {
              if (mode.id === 'test') {
                onSelect(mode.id, Number(testCount) || 1);
                return;
              }
              onSelect(mode.id);
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <div className="stack-sm">
        <label htmlFor="testCount">Number of words (test mode)</label>
        <input
          id="testCount"
          type="number"
          min="1"
          value={testCount}
          onChange={(e) => setTestCount(e.target.value)}
          className="field"
        />
      </div>
    </div>
  );
};

export default ModeSelector;
