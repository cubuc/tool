import express, { Request, Response } from "express";
import path from "path";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const port = process.env.PORT || 4001;
//const index = require("./routes/index");

const app = express();

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

    socket.on("step", (obj) => {
        io.emit("FromAPI", obj);
        console.log("received " + obj);
    });
});

httpServer.listen(port, () => console.log(`HttpServer: Listening on port ${port}`));
