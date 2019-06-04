import React from 'react';
import './App.css';
import Composition from './components/composition';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Composition />
      </header>
    </div>
  );
}

export default App;
