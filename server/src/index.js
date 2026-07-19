import e from "express";
import { connectDB } from "./config/index.db.js";
import userRoute from "./routes/user.routes.js"
import chatRoute from "./routes/chat.routes.js"
import cookieParser from "cookie-parser";
import { server } from "./socket/index.js";
import { initSocket } from "./socket/index.js";

const app = e()
const PORT = process.env.PORT || 8000

app.use(cookieParser())
app.use(e.json())
app.use(e.urlencoded())

app.use("/api/v1/user", userRoute) // http://localhost:8000/api/v1/user/registration
app.use("/api/v1/chat", chatRoute) // http://localhost:8000/api/v1/user/registration

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })

    initSocket();
    
    server.listen(5000, () => {
        console.log("Socket Server running on PORT 5000")
    })
}).catch((err) => {
    console.log(`ERR: ${err}`)
    process.exit(1)
})