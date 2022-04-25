import { Server } from "socket.io";
import fs from 'fs'

const createSockerServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5000", "https://adventuresy.vercel.app"],
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', function (socket) {
        socket.on('create-room', function (data) {
            // do something
        });
        socket.on('join-room', function (data) {
            // do something
        });
        socket.on('ban-from-room', function (data) {
            // do something
        });
        socket.on('leave-room', function (data) {
            // do something
        });
        socket.on('send-msg', function (data) {
            // do something
        });
        socket.on('delete-msg', function (data) {
            // do something
        });
        socket.on('react-to-msg', function (data) {
            // do something
        });
    });

}

export default createSockerServer;