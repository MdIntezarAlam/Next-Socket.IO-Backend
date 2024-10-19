import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketControllers } from "./controller/socketControllers";
import connectDB from "./config/db";
const PORT = process.env.PORT || 5000;
import dotenv from 'dotenv'


dotenv.config()
connectDB()


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", //all
    },
});

socketControllers(io);
httpServer.listen(PORT, () => {
    console.log(`server is working on ${PORT}`);
});
