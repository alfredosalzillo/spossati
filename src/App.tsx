import React, { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Provider as SupabaseProvider } from 'react-supabase';
import {
  LoadScript,
} from '@react-google-maps/api';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { initAutocompleteService } from '@api/places';
import { SignalProvider } from '@api/signal';
import SignInDialog from '@components/SignInDialog';
import SplashScreen from '@components/SplashScreen';
import Home from './Routes/Home';

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
      <SupabaseProvider value={client}>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_PUBLIC_KEY || ''}
          libraries={libraries as any}
          onLoad={initAutocompleteService}
          loadingElement={<SplashScreen />}
        >
          <BrowserRouter>
            <QueryParamProvider ReactRouterRoute={Route}>
              <Switch>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
              <SignInDialog />
            </QueryParamProvider>
          </BrowserRouter>
        </LoadScript>
      </SupabaseProvider>
    </SignalProvider>
  </Suspense>
);

export default App;
