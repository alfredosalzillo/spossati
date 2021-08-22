import React, { useMemo } from 'react';
import {
  Avatar, Collapse, Container,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {
  AutocompletePrediction,
  initPlaceService,
  usePlaceDetails,
  usePlacesPrediction,
} from '@api/places';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useCurrentPosition } from '@api/geolocation';
import HighlightedText from '@components/HighlightedText';
import { useSearchParams } from '@api/search-params';
import AppBar, { AppBarPlaceholder } from '@components/AppBar';
import PlaceDetailsCard from '@components/PlaceDetailsCard';

type MapProps = {
  center?: google.maps.LatLng | google.maps.LatLngLiteral | null,
  pinCenter?: boolean,
};
const Map: React.FC<MapProps> = ({
  center,
  pinCenter = false,
}) => {
  const history = useHistory();
  return (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '100%',
      }}
      center={center!}
      zoom={15}
      options={{
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        clickableIcons: true,
      }}
      onLoad={initPlaceService}
      onClick={(e) => {
        if ('placeId' in e) {
          e.stop();
          // @ts-ignore
          history.push(`/?place_id=${e.placeId}`);
        }
        return null;
      }}
    >
      {center && pinCenter && (
        <Marker
          position={center!}
        />
      )}
    </GoogleMap>
  );
};
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

type LayoutProps = {
  appBar: React.ReactNode,
  map: React.ReactNode,
  content: React.ReactNode
};

const Layout: React.FC<LayoutProps> = ({
  appBar,
  map,
  content,
}) => {
  const classes = useStyles();
  return (
    <form
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
    </form>
  );
};

export type PageProps = {};
const Page: React.FunctionComponent<PageProps> = () => {
  const [position] = useCurrentPosition();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [{
    q: query,
    place_id: placeId,
  }, setSearchParams] = useSearchParams();
  const searching = Boolean((query || query === '') && !placeId);
  const place = !!placeId;
  const history = useHistory();
  const [predictions, loadingPredictions] = usePlacesPrediction(query);
  const [placeDetails, loadingPlaceDetails] = usePlaceDetails(placeId);
  const center = useMemo(() => {
    if (placeDetails) return placeDetails.geometry?.location;
    if (!position) return null;
    return ({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }, [position, placeDetails, place]);
  const loading = loadingPlaceDetails || loadingPredictions;
  const isNotHomeRoute = !!searching || !!place;
  const renderAvatar = () => {
    if (!searching) {
      return (
        <IconButton edge="end">
          <Avatar />
        </IconButton>
      );
    }
    return null;
  };
  return (
    <Layout
      appBar={(
        <AppBar
          searchQuery={query}
          onSearchQueryChange={(e) => {
            setSearchParams({
              q: e.target.value,
            }, 'replaceIn');
          }}
          onSearchFocus={() => {
            setSearchParams((state) => ({
              q: state.q || '',
            }), 'pushIn');
          }}
          loading={loading}
          active={isNotHomeRoute}
          onBack={isNotHomeRoute ? (() => history.goBack()) : undefined}
          searchDisabled={!!place}
          showOptions={!!searching}
          avatar={renderAvatar()}
          options={predictions}
          renderOption={(option: AutocompletePrediction, index) => {
            const {
              main_text: mainText,
              secondary_text: secondaryText,
              main_text_matched_substrings: matches,
            } = option.structured_formatting;
            return (
              <ListItem
                key={option.id}
                button
                divider={index < predictions.length - 1}
                onClick={() => {
                  history.push(`/?q=${mainText}&place_id=${option.place_id}`);
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <LocationOnIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={(
                    <HighlightedText
                      text={mainText}
                      matches={matches.map(({ offset, length }) => [
                        offset,
                        offset + length])}
                    />
                  )}
                  secondary={secondaryText}
                />
                <ArrowRightIcon />
              </ListItem>
            );
          }}
        />
      )}
      map={(
        <Map
          center={center}
          pinCenter={!!place}
        />
      )}
      content={(
        !loading && place && (
          <Collapse in={!!placeDetails} mountOnEnter unmountOnExit>
            <PlaceDetailsCard
              details={placeDetails!}
            />
          </Collapse>
        )
      )}
    />
  );
};

export default Page;
