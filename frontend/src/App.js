import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ChatGPTPage from './components/ChatGPTPage';
import ClaudePage from './components/ClaudePage';
import GeminiPage from './components/GeminiPage';
import './styles/Chat.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatgpt" element={<ChatGPTPage />} />
        <Route path="/claude" element={<ClaudePage />} />
        <Route path="/gemini" element={<GeminiPage />} />
      </Routes>
    </Router>
  );
};

export default App;