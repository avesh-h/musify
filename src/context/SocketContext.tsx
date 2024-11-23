// @ts-nocheck

"use client";

import React, { createContext, useState, useContext } from "react";

export const SocketContext = createContext({});

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export default SocketContextProvider;
