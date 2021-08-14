import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { Provider as SupabaseProvider } from 'react-supabase';
import logo from './logo.svg';
import './App.css';

const {
  REACT_APP_SUPABASE_URL = '',
  REACT_APP_SUPABASE_PUBLIC_KEY = '',
} = process.env;
const client = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_PUBLIC_KEY);

const App = () => (
  <SupabaseProvider value={client}>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to reload.
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
  </SupabaseProvider>
);

export default App;
