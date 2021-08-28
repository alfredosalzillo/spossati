import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useClient } from 'supabase-swr';

const Logout = () => {
  const history = useHistory();
  const client = useClient();
  useEffect(() => {
    client.auth.signOut().then(() => {
      history.replace('/');
    });
  }, []);
  return <></>;
};

export default Logout;
