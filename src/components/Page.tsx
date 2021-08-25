import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { Container, Grid, Hidden } from '@material-ui/core';
import { AppBarPlaceholder } from '@components/AppBar';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  fullHeight: {
    height: '100vh',
  },
  animated: {
    height: '100%',
    transition: theme.transitions.create('height', {
      duration: '2s',
    }),
  },
  content: {
    zIndex: 1,
  },
  contentDesktop: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

type PageProps = {
  appBar: React.ReactNode,
  map: React.ReactNode,
  content: React.ReactNode
};

const Page: React.FC<PageProps> = ({
  appBar,
  map,
  content,
}) => {
  const classes = useStyles();
  return (
    <div
      className={classes.root}
      onSubmit={(e) => e.preventDefault()}
    >
      <Grid
        container
        direction="column"
        alignContent="stretch"
        className={classes.fullHeight}
      >
        <Grid item>
          {appBar}
        </Grid>
        <Grid item xs className={classes.animated}>
          {map}
        </Grid>
        <Hidden mdUp>
          <Grid item className={classes.content}>
            {content}
          </Grid>
        </Hidden>
        <Hidden smDown>
          {
            content && (
              <Container
                maxWidth="xs"
                className={classes.contentDesktop}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <AppBarPlaceholder />
                  </Grid>
                  <Grid item xs={12}>
                    {content}
                  </Grid>
                </Grid>
              </Container>
            )
          }
        </Hidden>
      </Grid>
    </div>
  );
};

export default Page;
