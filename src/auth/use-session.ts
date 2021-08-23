import { useState } from 'react';
import { useAuthStateChange, useClient } from 'react-supabase';
import type { Session } from '@supabase/supabase-js';

export const useSession = (): Session => {
  const client = useClient();
  const [state, setState] = useState<Session>(client.auth.session());
  useAuthStateChange((e, session) => setState(session));
  return state;
};

export default useSession;
