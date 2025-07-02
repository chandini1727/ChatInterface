import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/styles.css';

const AIChat = ({ ai }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionId, setSessionId] = useState(crypto.randomUUID());
  const chatEndRef = useRef(null);
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchChatHistory();
  }, [ai]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/chat/history/${ai}`);
      setChatHistory(res.data);
    } catch (error) {
      console.error(`Error fetching ${ai} history:`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${apiBaseUrl}/api/${ai}`, {
        question: input,
        context: newMessages,
      });
      const newResponse = res.data.response;
      const updatedMessages = [...newMessages, { role: 'assistant', content: newResponse }];
      setMessages(updatedMessages);
      await axios.post(`${apiBaseUrl}/api/chat/save`, {
        ai_model: ai,
        question: input,
        response: newResponse,
        session_id: sessionId,
      });
      fetchChatHistory();
    } catch (error) {
      console.error(`Error calling ${ai} API:`, error);
      setMessages([...newMessages, { role: 'assistant', content: `Error: Could not get response from ${ai}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (session_id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/chat/history/${session_id}`);
      fetchChatHistory();
      if (sessionId === session_id) {
        setMessages([]);
        setSessionId(crypto.randomUUID());
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleChatSelect = (session) => {
    const conversationMessages = [];
    for (let i = 0; i < Math.max(session.questions.length, session.responses.length); i++) {
      if (i < session.questions.length) {
        conversationMessages.push({ role: 'user', content: session.questions[i] });
      }
      if (i < session.responses.length) {
        conversationMessages.push({ role: 'assistant', content: session.responses[i] });
      }
    }
    setSessionId(session.session_id);
    setMessages(conversationMessages);
  };

  // Function to detect and format points or code
  const formatContent = (content) => {
    // Remove extra whitespace and normalize line breaks
    const cleanedContent = content.trim().replace(/\n\s*\n/g, '\n').split('\n').filter(line => line.trim());

    // Detect points (e.g., text with numbered lists)
    if (cleanedContent.some(line => line.match(/^\d+\.\s/))) {
      return (
        <div className="point-list">
          <ol>
            {cleanedContent.map((line, index) => {
              const match = line.match(/^\d+\.\s(.*)/);
              const text = match ? match[1] : line;
              return <li key={index}>{text}</li>;
            })}
          </ol>
        </div>
      );
    }
    // Detect code (e.g., contains 'java', 'public')
    if (cleanedContent.some(line => line.includes('java') || line.includes('public') || line.match(/^\s*[\w]+\s*[\(\{]/))) {
      return (
        <div className="code-container">
          <pre className="code-block"><code>{cleanedContent.join('\n')}</code></pre>
        </div>
      );
    }
    return <p>{cleanedContent.join('\n')}</p>;
  };

  return (
    <div className="chat-app-container">
      <div className="sidebar">
        <h2>Chat History</h2>
        <button className="ai-button" onClick={() => { setMessages([]); setSessionId(crypto.randomUUID()); }}>
          New Chat
        </button>
        <ul className="chat-history-list">
          {chatHistory.map((session) => (
            <li key={session.session_id} onClick={() => handleChatSelect(session)}>
              {session.questions[0]?.slice(0, 20)}...
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteChat(session.session_id); }}>
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <header>
          <h1>{ai.toUpperCase()}</h1>
          <button className="back-button" onClick={() => window.location.href = '/'}>
            Back
          </button>
        </header>
        <div className="chat-container">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">Start a new conversation by typing below!</div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  {formatContent(msg.content)}
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="chat-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${ai} anything...`}
              disabled={isLoading}
              className="chat-input"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="submit-button">
              {isLoading ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
