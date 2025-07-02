import React from 'react';

const AIButton = ({ name, onClick, className }) => {
  return (
    <button className={`ai-button ${className || ''}`} onClick={onClick}>
      {name}
    </button>
  );
};

export default AIButton;