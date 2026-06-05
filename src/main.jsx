import React from 'react';
import { AppRegistry } from 'react-native';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const Main = () => (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

AppRegistry.registerComponent('App', () => Main);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});
