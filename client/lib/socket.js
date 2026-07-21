"use client"

import { io } from "socket.io-client"

let socket;

export const getSocket = (accessToken) => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
            auth: {
                token: accessToken,
            },
            autoConnect: false

        })
    }
    else {
        socket.auth.token = accessToken
    }
    return socket
}