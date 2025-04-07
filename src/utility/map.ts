import { useMapEvents } from 'react-leaflet';

/**
 * Map click handler component that provides click and mouse move events
 */
export const MapClickHandler = ({
  onMapClick,
  onMouseMove,
}: {
  onMapClick: (lat: number, lng: number) => void;
  onMouseMove: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: e => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
    mousemove: e => {
      onMouseMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

/**
 * Get user's current location using the browser's geolocation API
 * @param onSuccess Callback function to handle successful location retrieval
 * @param onError Callback function to handle location retrieval errors
 */
export const getUserLocation = (
  onSuccess: (latitude: number, longitude: number) => void,
  onError: (error: string) => void
) => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        onSuccess(position.coords.latitude, position.coords.longitude);
      },
      error => {
        onError('Error getting location: ' + error.message);
      }
    );
  } else {
    onError('Geolocation is not supported by your browser');
  }
};
