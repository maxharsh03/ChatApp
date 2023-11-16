// import everything required for backend
const express = require('express');
const cors = require('cors');
const http = require('http');
const port = 3001;
const { Server } = require('socket.io');
const app = express();
const bodyParser = require('body-parser');

// create app
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);

const io = new Server(server, { 
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// socket stuff
io.on('connection', (socket) => {
    socket.on("join_room", (data) => {
        socket.join(data.room);
        //console.log(`User with ID: ${socket.id} joined room ${data}`);
        io.to(data.room).emit('connection_message', data);
    });

    socket.on("send_message", (data) => {
        console.log(data);
        io.to(data.room).emit('receive_message', data);
    });

    socket.on('leave_room', (data) => {
        io.to(data.room).emit('connection_message', data);
        socket.leave(data.room);
    });
});

server.listen(port, () => {
    console.log('listening on port ' + port);
});