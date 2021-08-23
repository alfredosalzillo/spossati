import clsx from 'clsx';
import {
  CircularProgress,
  Container,
  Fade,
  IconButton,
  InputAdornment,
  Toolbar,
  AppBar as MuiAppBar, Collapse, Paper, List, IconButtonProps, TextFieldProps,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ArrowBack from '@material-ui/icons/ArrowBack';
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderLeft: 0,
    borderTop: 0,
    borderRight: 0,
    borderBottomWidth: 0,
    transition: theme.transitions.create(['background'], {
      duration: '500ms',
    }),
  },
  active: {
    borderBottomWidth: 1,
    background: theme.palette.background.paper,
  },
  searchFieldInputRoot: {
    background: theme.palette.background.paper,
  },
  searchFieldInputRootShadow: {
    boxShadow: theme.shadows[1],
  },
  searchResultRoot: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    background: theme.palette.background.paper,
    [theme.breakpoints.up('md')]: {
      background: 'none',
      height: 'fit-content',
      '& $searchResultListContainer': {
        background: theme.palette.background.paper,
        borderBottomLeftRadius: theme.spacing(4),
        borderBottomRightRadius: theme.spacing(4),
        minHeight: 50,
      },
    },
  },
  searchResultListContainer: { },
  searchResultListRoot: { },
}));

export const AppBarPlaceholder = () => {
  const classes = useStyles();
  return <Toolbar className={classes.root} />;
};

export type AppBarProps<T = any> = {
  active?: boolean,
  backButton?: boolean,
  onBack?: IconButtonProps['onClick'],
  loading?: boolean,
  searchDisabled?: boolean,
  action?: React.ReactNode,
  options?: T[],
  renderOption?: (option: T, i: number) => React.ReactNode,
  showOptions?: boolean,
  onSearchFocus?: TextFieldProps['onFocus'],
  searchQuery?: string,
  onSearchQueryChange?: TextFieldProps['onChange'],
};
// eslint-disable-next-line @typescript-eslint/comma-dangle
const AppBar = <T, >(props: AppBarProps<T>) => {
  const {
    active = false,
    onBack,
    loading = false,
    searchDisabled = false,
    action = <></>,
    options,
    renderOption,
    showOptions = false,
    onSearchFocus,
    searchQuery = '',
    onSearchQueryChange,
  } = props;
  const classes = useStyles();
  return (
    <>
      <MuiAppBar
        position="fixed"
        color="transparent"
        variant="outlined"
        className={clsx(classes.root, {
          [classes.active]: active,
        })}
      >
        <Toolbar>
          <Container disableGutters>
            <TextField
              disabled={searchDisabled}
              onFocus={onSearchFocus}
              value={searchQuery}
              onChange={onSearchQueryChange}
              InputProps={{
                className: classes.searchFieldInputRoot,
                startAdornment: (
                  <Fade in={!!onBack} mountOnEnter unmountOnExit>
                    <InputAdornment position="start">
                      <IconButton onClick={onBack} edge="start">
                        <ArrowBack />
                      </IconButton>
                    </InputAdornment>
                  </Fade>
                ),
                endAdornment: (
                  <>
                    <Collapse in={loading} mountOnEnter unmountOnExit>
                      <InputAdornment position="end">
                        <IconButton edge="end">
                          <CircularProgress size={32} />
                        </IconButton>
                      </InputAdornment>
                    </Collapse>
                    {
                    action && (
                      <Fade in={!loading} mountOnEnter unmountOnExit>
                        <InputAdornment position="end">
                          {action}
                        </InputAdornment>
                      </Fade>
                    )
                  }
                  </>
                ),
              }}
              placeholder="Search here"
              variant="outlined"
              fullWidth
            />
          </Container>
        </Toolbar>
      </MuiAppBar>
      <Collapse in={showOptions}>
        <Paper className={classes.searchResultRoot} elevation={0}>
          <AppBarPlaceholder />
          <Collapse in={renderOption && !!options?.length}>
            <Container className={classes.searchResultListContainer} disableGutters>
              <List className={classes.searchResultListRoot}>
                {renderOption && options?.map(renderOption)}
              </List>
            </Container>
          </Collapse>
        </Paper>
      </Collapse>
      <Collapse in={active} mountOnEnter unmountOnExit>
        <Toolbar className={classes.root} />
      </Collapse>
    </>
  );
};

export default AppBar;
