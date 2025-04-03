export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
export const LIVE_PROVIDER_URL =
  import.meta.env.VITE_LIVE_PROVIDER_URL ?? "http://localhost:3000";
export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY ?? "token";
export const REFRESH_TOKEN_KEY =
  import.meta.env.VITE_REFRESH_TOKEN_KEY ?? "refresh-token";
export const TOKEN_EXPIRES_AT_KEY =
  import.meta.env.VITE_TOKEN_EXPIRES_AT_KEY ?? "token-expires";
export const USER_DATA_KEY = import.meta.env.USER_DATA_KEY ?? "user-data";
export const TIME_THRESHOLD = import.meta.env.VITE_TIME_THRESHOLD ?? 60 * 1000;

export const UPDATE_DEVICE_CHANNEL = "update_device_pin";
export const JOIN_DEVICE_ROOM_CHANNEL = "join_device_room";
export const LEAVE_DEVICE_ROOM_CHANNEL = "leave_device_room";
export const HANDLE_JOINED_DEVICE_ROOM_CHANNEL = "joined_device_room";
export const HANDLE_LEAVED_DEVICE_ROOM_CHANNEL = "leaved_device_room";
export const HANDLE_DEVICE_DATA_CHANNEL = "device_data";
