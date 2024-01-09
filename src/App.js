import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import OrderLog from './components/OrderLog';
import OrderInputContainer from './components/OrderInputContainer';

function App() {
  const [totalAmount, setTotalAmount] = useState(100);

  return (
    <div className="App">
      <OrderInputContainer />
    </div>
  );
}

export default App;
