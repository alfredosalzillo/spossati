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

export class LatLng {
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
type PlaceDetailsRequest = google.maps.places.PlaceDetailsRequest;

const placeServiceRef = createGlobalRef<PlacesService>();
const autoCompleteServiceRef = createGlobalRef<AutocompleteService>();

export const initAutocompleteService = () => {
  resolveGlobalRef(autoCompleteServiceRef, new google.maps.places.AutocompleteService());
};

export const initPlaceService = (map: google.maps.Map) => {
  resolveGlobalRef(placeServiceRef, new google.maps.places.PlacesService(map));
};

type PromisifyCallback <Result, Status> = (
  onComplete: (result: Result, status: Status) => void,
) => void;
const promisify = <Result, Status extends string>(
  callback: PromisifyCallback<Result, Status>,
): Promise<Result> => new Promise<Result>((resolve, reject) => {
    const onComplete = (result: Result, status: Status) => {
      if (status === 'OK' || status === 'ZERO_RESULTS') {
        resolve(result);
      } else {
        reject(status);
      }
    };
    return callback(onComplete);
  });

export const fetchPlaceDetails = async (request: PlaceDetailsRequest): Promise<PlaceResult> => {
  const service = await placeServiceRef;
  return promisify((onComplete) => service.getDetails(request, onComplete));
};

export const fetchPlacesPrediction = async (
  request: AutocompletionRequest,
): Promise<AutocompletePrediction[]> => {
  const service = await autoCompleteServiceRef;
  return promisify((onComplete) => service.getPlacePredictions(request, onComplete));
};
