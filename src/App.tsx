import React from 'react';
import { Game } from './Game';

import './App.css';

const App: React.FC = () => {
  return (
    <div style={{ background: '#ddffdd', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}><Game /></div>
  );
}

export default App;
