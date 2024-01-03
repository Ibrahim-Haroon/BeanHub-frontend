// Update ChatContainer.js
import React from 'react';
import Order from './Order';
import SpeechInput from './SpeechInput';

const ChatContainer = () => {
  return (
    <div className="chat-container">
      <Order />
      <SpeechInput />
    </div>
  );
}

export default ChatContainer;
