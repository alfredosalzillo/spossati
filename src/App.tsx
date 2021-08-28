import React, { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LoadScript,
} from '@react-google-maps/api';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { initAutocompleteService } from '@api/places';
import { SignalProvider } from '@api/signal';
import SignInDialog from '@components/SignInDialog';
import SplashScreen from '@components/SplashScreen';
import AppMenuDialog from '@components/AppMenuDialog';
import { SwrSupabaseContext } from 'supabase-swr';
import Home from './Routes/Home';
import Logout from './Routes/Logout';

const {
  REACT_APP_SUPABASE_URL = '',
  REACT_APP_SUPABASE_PUBLIC_KEY = '',
} = process.env;
const client = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_PUBLIC_KEY, {
  detectSessionInUrl: true,
  persistSession: true,
});

const libraries = ['places'];

const App = () => (
  <Suspense fallback={<SplashScreen />}>
    <SignalProvider>
      <SwrSupabaseContext.Provider value={client}>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_PUBLIC_KEY || ''}
          libraries={libraries as any}
          onLoad={initAutocompleteService}
          loadingElement={<SplashScreen />}
        >
          <BrowserRouter>
            <QueryParamProvider ReactRouterRoute={Route}>
              <Switch>
                <Route path="/logout">
                  <Logout />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
              <SignInDialog />
              <AppMenuDialog />
            </QueryParamProvider>
          </BrowserRouter>
        </LoadScript>
      </SwrSupabaseContext.Provider>
    </SignalProvider>
  </Suspense>
);

export default App;
