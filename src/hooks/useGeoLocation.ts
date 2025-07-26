import { useState, useCallback } from 'react';

export const useGeolocation = (options: PositionOptions = {}) => {
  const [coords, setCoords] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation non supportata dal browser');
      return;
    }

    setLoading(true);
    setError(undefined);
    console.log('getting position', navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoords({ latitude: coords.latitude, longitude: coords.longitude });
        setLoading(false);
      },
      (err) => {        
        setError(err.message);
        setLoading(false);
      },
      options
    );
  }, [options]);

  return { coords, error, loading, requestLocation };
};

export default useGeolocation;
