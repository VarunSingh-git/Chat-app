import http from "node:http";
import { Server } from "socket.io";

const server = http.createServer();
const io = new Server(server, {
    cors:{
        origin:"*"
    }
});
const users = new Map(); // socket.id -> name

io.on("connection", (socket) => {

    console.log(`${socket.id} connected`);

    // Save name
    socket.on("Join", (name) => {

        users.set(socket.id, name);

        console.log(`${name} joined`);

        io.emit("system", `${name} joined the chat.`);
    });

    // Chat message
    socket.on("message", (msg) => {

        const name = users.get(socket.id);

        io.emit("message", {
            name,
            text: msg
        });

    });

    socket.on("disconnect", () => {

        const name = users.get(socket.id);

        users.delete(socket.id);

        io.emit("system", `${name} left the chat.`);

    });

});

server.listen(5000, () => {
    console.log("Server running on 5000");
});