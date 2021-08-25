import { useSignOut } from 'react-supabase';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();
  const [, signOut] = useSignOut();
  useEffect(() => {
    signOut().then(() => {
      history.replace('/');
    });
  }, []);
  return <></>;
};

export default Logout;
