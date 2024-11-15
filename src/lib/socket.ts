import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const connectToSocket = () => {
  socket = io("http://localhost:3001");
  return socket;
};

export { connectToSocket, socket };
