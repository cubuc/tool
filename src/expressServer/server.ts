import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const port = process.env.PORT || 8080;
//const index = require("./routes/index");

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "..", "..", "/dist")));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "dist", "index.html"));
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("step", (obj, room) => {
        io.to(room).emit("FromAPI", obj);
        console.log("sent " + obj + " for room " + room);
    });

    socket.on("join", (room) => {
        if (room) {
            socket.join(room);
            console.log("socket " + socket.id + " joined " + room);
        }
    });
});

httpServer.listen(port, () => console.log(`HttpServer: Listening on port ${port}`));
