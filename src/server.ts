import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketControllers } from "./controller/socketControllers";
import connectDB from "./config/db";
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
connectDB()
const app = express();


const allowOrigin = [
    "https://dev-chatme.netlify.app/",
    "https://chatme-qulw.onrender.com/"
]
const corsOptions = {
    origin: function (origin: any, callback: any) {
        console.log("Incoming origin:", origin); // to check incoming origin
        if (allowOrigin.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))


socketControllers(io)


const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`server is working on ${PORT}`);
});