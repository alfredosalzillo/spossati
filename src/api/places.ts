import { useEffect, useMemo, useState } from 'react';
import throttle from 'lodash/throttle';
import { getLastKnowPosition } from '@api/geolocation';
import cancellable from 'cancellable';

const GlobalRefResolverSymbol = Symbol('GlobalRefResolver');
type GlobalRef<T> = Promise<T> & {
  [GlobalRefResolverSymbol]: (value: T) => void;
};
const createGlobalRef = <T>(): GlobalRef<T> => {
  let resolveFn: (value: T) => void;
  const promise = new Promise<T>((resolve) => {
    resolveFn = resolve;
  });
  // @ts-ignore
  promise[GlobalRefResolverSymbol] = (value: T) => resolveFn?.(value);
  return promise as GlobalRef<T>;
};
const resolveGlobalRef = <T>(ref: GlobalRef<T>, value: T) => {
  ref[GlobalRefResolverSymbol]?.(value);
};

class LatLng {
  static fromPosition(position: GeolocationPosition): google.maps.LatLng {
    return new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude,
    );
  }
}

export type PlacesService = google.maps.places.PlacesService;
export type AutocompletionRequest = google.maps.places.AutocompletionRequest;
export type PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
export type AutocompletePrediction = google.maps.places.AutocompletePrediction;
export type AutocompleteService = google.maps.places.AutocompleteService;
export type PlaceResult = google.maps.places.PlaceResult;

const placeServiceRef = createGlobalRef<PlacesService>();
const autoCompleteServiceRef = createGlobalRef<AutocompleteService>();

export const initAutocompleteService = () => {
  resolveGlobalRef(autoCompleteServiceRef, new google.maps.places.AutocompleteService());
};

export const initPlaceService = (map: google.maps.Map) => {
  resolveGlobalRef(placeServiceRef, new google.maps.places.PlacesService(map));
};

const supportedTypes = [
  'establishment',
];

export const usePlaceDetails = (placeId?: string | null): [PlaceResult | null, boolean] => {
  const [value, setValue] = useState<PlaceResult | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!placeId) {
      setValue(null);
      return undefined;
    }
    const onComplete = cancellable((place: PlaceResult) => {
      if (place) setValue(place);
      setLoading(false);
    });
    setLoading(true);
    placeServiceRef.then((service) => {
      service.getDetails({
        placeId,
      }, onComplete);
    });
    return () => onComplete.cancel();
  }, [placeId]);
  return [value, loading];
};

export const useTextSearchPlaces = (query?: string | null): [PlaceResult[] | null, boolean] => {
  const [value, setValue] = useState<PlaceResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!query) {
      setValue(null);
      return undefined;
    }
    const onComplete = cancellable((data: PlaceResult[]) => {
      if (data) setValue(data);
      setLoading(false);
    });
    setLoading(true);
    placeServiceRef.then((service) => {
      service.textSearch({
        query,
        location: LatLng.fromPosition(getLastKnowPosition()!),
      }, onComplete);
    });
    return () => onComplete.cancel();
  }, [query]);
  return [value, loading];
};

export const usePlacesPrediction = (query = ''): [AutocompletePrediction[], boolean] => {
  const [value, setValue] = useState<AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const getPredictions = useMemo(() => throttle(async (
    request: Omit<AutocompletionRequest, 'origin'>,
    callback: (result: AutocompletePrediction[], status: PlacesServiceStatus) => void,
  ) => {
    const currentLocation = getLastKnowPosition();
    const service = await autoCompleteServiceRef;
    if (!currentLocation) return service.getPlacePredictions(request, callback);
    return service.getPlacePredictions({
      ...request,
      types: supportedTypes,
      origin: LatLng.fromPosition(currentLocation),
    }, callback);
  }, 200), []);
  useEffect(() => {
    if (!query) {
      setValue([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const onComplete = cancellable((results?: AutocompletePrediction[]) => {
      setLoading(false);
      if (results) {
        setValue(results);
      }
    });
    getPredictions({
      input: query,
    }, onComplete);
    return () => onComplete.cancel();
  }, [query, getPredictions]);
  return [value, loading];
};
