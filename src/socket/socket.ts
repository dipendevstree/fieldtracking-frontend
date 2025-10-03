import { io } from "socket.io-client";

export const socket = io("https://userfieldtrack360-api.devstree.in/");

export const socketForVisit = (token: any) =>
  io("https://fieldtrack360-api.devstree.in/", {
    extraHeaders: { Authorization: `Bearer ${token}` },
  });
