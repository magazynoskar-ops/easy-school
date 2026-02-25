import React from 'react';
import { useNavigate } from 'react-router-dom';

const WordSetCard = ({ set }) => {
  const navigate = useNavigate();

  return (
    <article
      className="set-tile"
      onClick={() => navigate(`/learn/${set._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          navigate(`/learn/${set._id}`);
        }
      }}
    >
      <h3>{set.name}</h3>
      {set.isGlobal && <span className="pill">Global</span>}
    </article>
  );
};

export default WordSetCard;
