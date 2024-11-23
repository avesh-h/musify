import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const connectToSocket = () => {
  socket = io("http://localhost:3001");

  socket.on("disconnect", () => {
    console.log("disconnecteddddddddddddddddddd"); // undefined
  });
  return socket;
};

export { connectToSocket, socket };
