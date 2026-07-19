import { io } from "socket.io-client";
import readline from "node:readline"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const socket = io("http://localhost:5000")

console.log("Connected to socket server");

rl.question("Enter your userId: ", (senderId) => {
    rl.question("Enter chatId to join: ", (chatId) => {
        socket.emit("join_chat", chatId); // 1st emit — join the room

        console.log("Joined chat. Type your message and press enter:");

        rl.on("line", (message) => {
            socket.emit("send_message", {
                chatId,
                senderId,
                message: message,
            }); // 2nd emit — every line typed
        });
    });
});


socket.on("receive_message", (data) => {
    console.log(`\n[${data.senderId}]: ${data.message}`);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
})