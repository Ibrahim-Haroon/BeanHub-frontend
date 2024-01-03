// Chatbot.js
import React from 'react';
import './Chatbot.css'; // Import the CSS file for styling

const Chatbot = () => {
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chatbot</h2>
      </div>
      <div className="chat-messages">
        {/* Chat messages will be displayed here */}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type your message..." />
        <button>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
