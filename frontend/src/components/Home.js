import React from 'react';
import { useNavigate } from 'react-router-dom';
import AIButton from './AIButton';
import '../styles/styles.css'; 

const Home = () => {
  const navigate = useNavigate();

  const handleAIButtonClick = (ai) => {
    navigate(`/${ai}`);
  };

  return (
    <div className="home-container">
      <div className="ai-buttons">
        <AIButton name="ChatGPT" onClick={() => handleAIButtonClick('chatgpt')} />
        <AIButton name="Gemini" onClick={() => handleAIButtonClick('gemini')} />
        <AIButton name="ClaudeAI" onClick={() => handleAIButtonClick('claude')} />
      </div>
    </div>
  );
};

export default Home;