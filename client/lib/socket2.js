import { io } from "socket.io-client";
import readline from "node:readline"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const socket = io("http://localhost:5000")

socket.on("connect", () => {
    rl.question("Enter your username: ", (name) => {
        socket.emit("Join", name)

        console.log("type your message")

        rl.on("line", (msg) => {
            socket.emit("message", msg)
        })
    })
})

socket.on("message",(data)=>{
    console.log(`${data.name}: ${data.text}`);
})