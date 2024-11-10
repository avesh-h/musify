import io from "socket.io-client";

let socket;

const connectToSocket = () => {
  socket = io("http://localhost:3001");
  return socket;
};

export { connectToSocket, socket };
