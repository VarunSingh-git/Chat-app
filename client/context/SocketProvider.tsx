"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { getSocket } from "../lib/socket.js"
import { Socket } from "socket.io-client";



const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { accessToken, isAuthenticated } = useAuth()
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        if (!isAuthenticated || !accessToken) return;

        const s = getSocket(accessToken)
        s.connect();
        setSocket(s)

        return () => {
            s.removeAllListeners();
            s.disconnect() 
        }
    }, [isAuthenticated, accessToken])

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = (): Socket | null => useContext(SocketContext)