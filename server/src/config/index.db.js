import mongoose from "mongoose"


export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`DB connected: ${connection.connection.host}`);

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}

