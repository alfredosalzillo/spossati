import React from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  useDialog,
} from '@components/Dialog';
import useSession from '@auth/use-session';
import { Avatar, Button, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export const AppMenuDialogKey = '__AppMenu__Dialog';

export const useAppMenuDialog = () => useDialog<never>(AppMenuDialogKey);

const AppMenuDialog = () => {
  const history = useHistory();
  const {
    opened,
    close,
  } = useAppMenuDialog();
  const onClose = () => close();
  const session = useSession();
  if (!session?.user) return <></>;
  const {
    user
  } = session;
  return (
    <Dialog
      open={opened}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="app-menu-dialog-title"
    >
      <DialogTitle onClose={onClose} id="app-menu-dialog-title">
        <Grid container spacing={2} alignContent="center" alignItems="center">
          <Grid item>
            <Avatar
              component="span"
              alt={user.user_metadata.full_name}
              src={user.user_metadata.avatar_url}
            />
          </Grid>
          <Grid item>
            {user.user_metadata.full_name}
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>
        <></>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => history.push('/logout')}>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppMenuDialog;
