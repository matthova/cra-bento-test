import React from 'react';
import styled from 'styled-components';

import { Game } from './Game';

import './App.css';

const Container = styled.div`
  background: #ddffdd;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const App: React.FC = () => {
  return (
    <Container>
      <Game />
    </Container>
  );
}

export default App;
