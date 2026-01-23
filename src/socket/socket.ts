import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.VITE_LIVE_TRACKING_API_URL!.replace("/api/v1", ""),
);

export const socketForVisit = (token: any) =>
  io(import.meta.env.VITE_API_URL!.replace("/api/v1", ""), {
    extraHeaders: { Authorization: `Bearer ${token}` },
  });
