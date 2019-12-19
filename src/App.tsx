import React from 'react';
import { ThemeContextContainer, Button } from '@hova-labs/bento-box-web';

import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeContextContainer>
      <div className="App">
        <header className="App-header">
          <Button onPress={() => {
            alert('yep');
          }} title="yep"></Button>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </ThemeContextContainer>
  );
}

export default App;
