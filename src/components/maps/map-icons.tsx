import { divIcon } from 'leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import ReactDOMServer from 'react-dom/server';
import type { SVGProps } from 'react';

export function BitcoinIconsNodeHardwareFilled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill={props.fill}
        fillRule="evenodd"
        d="M21 9.884a.73.73 0 0 0-.364-.646l-7.494-4.395a2.21 2.21 0 0 0-2.23-.003L3.368 9.237a.73.73 0 0 0-.365.647H3v4.43h.004a.73.73 0 0 0 .376.621l7.563 4.243a2.21 2.21 0 0 0 2.167-.003l7.515-4.24a.73.73 0 0 0 .375-.62zm-16.236.563a.375.375 0 1 0-.368.654l6.359 3.587a2.59 2.59 0 0 0 2.551-.006l6.278-3.582a.375.375 0 0 0-.372-.652l-6.278 3.583c-.56.32-1.248.322-1.81.004z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create a custom div icon for devices
export const deviceIcon = divIcon({
  html: ReactDOMServer.renderToString(<BitcoinIconsNodeHardwareFilled fill="#22c55e" />),
  className: 'custom-div-icon',
  iconSize: [40, 40], // Match the SVG's width/height
  iconAnchor: [12, 12], // Center the icon (24/2)
  popupAnchor: [0, -12], // Position popup above the icon
});

// Create a custom icon for the picked location
export const pickedLocationIcon = divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#3b82f6" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: 'picked-location-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Create a custom icon for the current location
export const currentLocationIcon = divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#ef4444" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: 'current-location-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});
