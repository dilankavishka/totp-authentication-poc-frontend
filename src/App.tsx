import React from 'react';
import TotpSetupWidget from './TotpSetupWidget';
import '@carbon/react/index.scss';

function App() {
  return (
    <div className="App" style={{ minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '2rem 0' }}>
      <TotpSetupWidget />
    </div>
  );
}

export default App;
