import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import OrderLog from './components/OrderLog';

function App() {
  const [totalAmount, setTotalAmount] = useState(100);

  return (
    <div className="App">
      <OrderLog totalAmount={totalAmount} />
    </div>
  );
}

export default App;