import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// constants
import { CONCURRENCY_LIMIT } from './constants';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App concurrencyLimit={CONCURRENCY_LIMIT} />
  </React.StrictMode>
);
