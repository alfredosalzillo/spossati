import { useEffect, useState } from 'react';
import { useClient } from 'supabase-swr';
import type { Session } from '@supabase/supabase-js';

export const useSession = (): Session => {
  const client = useClient();
  const [state, setState] = useState<Session>(client.auth.session());
  useEffect(() => {
    const {
      data: subscription,
    } = client.auth
      .onAuthStateChange((_, session) => setState(session));
    return () => subscription.unsubscribe();
  }, [client]);
  return state;
};

export default useSession;
