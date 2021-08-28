import React from 'react';
import GoogleButton from 'react-google-button';
import { useClient } from 'supabase-swr';
import Dialog, { DialogContent, DialogTitle, useDialog } from './Dialog';

export const SignInDialogKey = '__SignIn__Dialog';

export const useSignInDialog = () => useDialog<never>(SignInDialogKey);

const SignInDialog = () => {
  const client = useClient();
  const {
    opened = false,
    close,
  } = useSignInDialog();
  const handleClose = () => {
    close();
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="sing-in-dialog-title"
      open={opened}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="sign-in-dialog-title" onClose={handleClose}>
        Sign In
      </DialogTitle>
      <DialogContent dividers>
        <GoogleButton
          style={{ margin: 'auto', width: 'auto' }}
          onClick={() => {
            client.auth.signIn({
              provider: 'google',
            }, {
              redirectTo: window.location.href,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
