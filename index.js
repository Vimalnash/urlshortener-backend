import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./db.js";
import { adminRouter } from "./routes/admin.js";
import { userRouter } from "./routes/user.js";
import { publicRouter } from "./routes/public.js";

// Initialize dotenv configuration
dotenv.config();

// Initializing Express
const app = express();

// Initialize middlewares
app.use(express.json())
app.use(cors());

// Routes Base apiurl
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/all", publicRouter);

// Initializing variables
const PORT = process.env.PORT;
// const MONGO_URL = process.env.MONGO_URL_LOCAL;
const MONGO_URL = process.env.MONGO_URL_ATLAS;

// Database Connection
connectDatabase(MONGO_URL);

// Listening PORT
app.listen(PORT, () => {
    console.log(`
        Listening Port ${PORT},
        Server URL http://localhost:${PORT}
        `)
});