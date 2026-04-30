import { ENV } from "@/config/env";
import { io } from "socket.io-client";

export const socket = () =>
  io(ENV.LIVE_TRACKING_API_URL!.replace("/api/v1", ""), {
    transports: ["websocket"],
  });

export const socketForVisit = (token: any) =>
  io(ENV.API_URL!.replace("/api/v1", ""), {
    auth: { token },
    transports: ["websocket"],
  });
