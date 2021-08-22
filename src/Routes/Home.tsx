import React, { useMemo } from 'react';
import {
  Avatar,
  Collapse,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
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
import AppBar from '@components/AppBar';
import PlaceDetailsCard from '@components/PlaceDetailsCard';
import Page from '@components/Page';

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

export type HomeProps = {};
const Home: React.FunctionComponent<HomeProps> = () => {
  const [position] = useCurrentPosition();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [{
    q: query,
    place_id: placeId,
  }, setSearchParams] = useSearchParams();
  const showSearchResult = Boolean((query || query === '') && !placeId);
  const showPlaceDetails = !!placeId;
  const history = useHistory();
  const [predictions, loadingPredictions] = usePlacesPrediction(query);
  const [placeDetails, loadingPlaceDetails] = usePlaceDetails(placeId);
  const center = useMemo(() => {
    if (placeDetails?.geometry?.location) return placeDetails.geometry.location;
    if (!position) return null;
    return ({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }, [position, placeDetails, showPlaceDetails]);
  const loading = loadingPlaceDetails || loadingPredictions;
  const withBackButton = !!showSearchResult || !!showPlaceDetails;
  const renderAvatar = () => {
    if (!showSearchResult && !showPlaceDetails) {
      return (
        <IconButton edge="end">
          <Avatar />
        </IconButton>
      );
    }
    return null;
  };
  return (
    <Page
      appBar={(
        <AppBar
          searchQuery={query}
          onSearchQueryChange={(e) => {
            setSearchParams({
              q: e.target.value,
            }, 'replaceIn');
          }}
          onSearchFocus={() => {
            if (query === null || query === undefined) {
              setSearchParams(() => ({
                q: '',
              }), 'pushIn');
            }
          }}
          loading={loading}
          active={withBackButton}
          onBack={withBackButton ? (() => history.goBack()) : undefined}
          searchDisabled={!!showPlaceDetails}
          showOptions={!!showSearchResult}
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
          pinCenter={!!showPlaceDetails}
        />
      )}
      content={(
        !loading && showPlaceDetails && (
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

export default Home;
