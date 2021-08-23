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
import { useDebounce } from 'use-debounce';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {
  AutocompletePrediction,
  fetchPlaceDetails,
  fetchPlacesPrediction,
  initPlaceService,
  PlaceResult,
} from '@api/places';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useCurrentPosition } from '@api/geolocation';
import HighlightedText from '@components/HighlightedText';
import { useSearchParams } from '@api/search-params';
import AppBar from '@components/AppBar';
import PlaceDetailsCard from '@components/PlaceDetailsCard';
import Page from '@components/Page';
import useAsync, { mergeAsyncStates } from '@api/use-async';

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

type PlacePredictionItemProps = {
  option: AutocompletePrediction,
  onClick?: (option: AutocompletePrediction) => void,
  last?: boolean,
};
const PlacePredictionItem: React.FunctionComponent<PlacePredictionItemProps> = ({
  option,
  onClick,
  last = false,
}) => {
  const {
    main_text: mainText,
    main_text_matched_substrings: mainMatches,
    secondary_text: secondaryText,
    secondary_text_matched_substrings: secondaryMatches,
  } = option.structured_formatting;
  return (
    <ListItem
      key={option.id}
      button
      divider={last}
      onClick={() => onClick(option)}
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
            matches={mainMatches.map(({ offset, length }) => [
              offset,
              offset + length,
            ])}
          />
        )}
        secondary={(
          <HighlightedText
            text={secondaryText}
            matches={secondaryMatches?.map(({ offset, length }) => [
              offset,
              offset + length,
            ])}
          />
        )}
      />
      <ArrowRightIcon />
    </ListItem>
  );
};

type HomeState = {
  loading: boolean,
  predictions?: AutocompletePrediction[],
  placeDetails?: PlaceResult,
  center?: google.maps.LatLng | google.maps.LatLngLiteral,
};
type StateParams = {
  query?: string,
  placeId?: string,
};
const useHomeState = (params: StateParams): HomeState => {
  const {
    query,
    placeId,
  } = params;
  const [position] = useCurrentPosition();
  const placePredictionState = useAsync(() => {
    if (!query) return null;
    return fetchPlacesPrediction({
      input: query,
      types: ['establishment'],
    });
  }, [query]);
  const placeDetailsState = useAsync(() => {
    if (!placeId) return null;
    return fetchPlaceDetails({
      placeId,
    });
  }, [placeId]);
  const {
    values: [predictions, placeDetails],
    loading,
  } = mergeAsyncStates(placePredictionState, placeDetailsState);
  const center = useMemo(() => {
    if (placeDetails?.geometry?.location) return placeDetails.geometry.location;
    if (!position) return null;
    return ({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }, [position, placeDetails]);
  const [state] = useDebounce({
    predictions,
    placeDetails,
    loading,
    center,
  }, 200);
  return state;
};

export type HomeProps = {};
const Home: React.FunctionComponent<HomeProps> = () => {
  const [{
    q: query,
    place_id: placeId,
  }, setSearchParams] = useSearchParams();
  const history = useHistory();
  const {
    center,
    predictions,
    placeDetails,
    loading,
  } = useHomeState({
    query,
    placeId,
  });
  const showSearchResult = Boolean((query || query === '') && !placeId);
  const showPlaceDetails = !!placeId;
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
          avatar={renderAvatar()}
          options={predictions}
          showOptions={!!showSearchResult}
          renderOption={(option: AutocompletePrediction, index) => (
            <PlacePredictionItem
              key={option.id}
              option={option}
              last={index < predictions.length - 1}
              onClick={(current) => {
                const q = current.structured_formatting.main_text;
                history.push(`/?q=${q}&place_id=${current.place_id}`);
              }}
            />
          )}
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
