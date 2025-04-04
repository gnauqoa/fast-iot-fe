import { divIcon } from "leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create a custom div icon for devices
export const deviceIcon = divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="#22c55e" d="M4 13.256V12H2v-2h6.365L11.2 8h3.492L13.6 5H11V3h4l1.092 3H20v3h-2.816l1.456 4.002a4.5 4.5 0 1 1-1.985.392L15.419 10h-.947l-1.582 5.87l-.002-.001l.002.005l-2.925 1.065q.035.276.035.561a4.5 4.5 0 1 1-6-4.244m2-.229a4.5 4.5 0 0 1 3.281 2.033l1.957-.713L12.403 10h-.547L9 12H6zM5.5 20a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m13 0a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"/></svg>',
  className: "custom-div-icon",
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

// Create a custom icon for the picked location
export const pickedLocationIcon = divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#3b82f6" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: "picked-location-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Create a custom icon for the current location
export const currentLocationIcon = divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#ef4444" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: "current-location-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
}); 