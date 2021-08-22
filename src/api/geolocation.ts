import { useEffect, useState } from 'react';

export const isGeolocationAvailable = () => 'geolocation' in navigator;
let lastKnowPosition: GeolocationPosition | undefined;
if (isGeolocationAvailable()) {
  navigator.geolocation.watchPosition((position) => {
    lastKnowPosition = position;
  });
}
export const useCurrentPosition = (): [GeolocationPosition?, GeolocationPositionError?] => {
  const [position, setPosition] = useState<GeolocationPosition | undefined>(lastKnowPosition);
  const [error, setError] = useState<GeolocationPositionError>();
  useEffect(() => {
    const { geolocation } = navigator;
    const watcher = geolocation.watchPosition(setPosition, setError);
    return () => geolocation.clearWatch(watcher);
  }, []);
  return [position, error];
};

export const getLastKnowPosition = () => lastKnowPosition;
export const getCurrentLocation = (): Promise<GeolocationPosition | null> => new Promise((
  resolve,
  reject,
) => {
  if (isGeolocationAvailable()) {
    return navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 2000 });
  }
  return null;
});
