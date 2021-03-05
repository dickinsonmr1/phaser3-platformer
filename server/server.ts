
// TO COMPILE:
// tsc server/server.ts --outDir server/build/ --esModuleInterop true

// TO SERVE:
// node server/build/server.js

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://127.0.0.1:8080",
  },
});
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

import { createServer } from "http";
import { Server, Socket } from "socket.io";

//const port: number = 3000
class App {
    
    private port: string;
    private server: Server;
    private io: Socket;

    private players: any[] = [];

    constructor() {
        this.server = http;
        this.io = io;

        io.on('connection', (socket) => {

            socket.emit('testing123', 'hello world');

            
            console.log('player [' + socket.id + '] connected')
            /*
            for (i = 0; i < players.length; i++)
              console.log("Player: " + players[i]);
            
            players[socket.id] = {
              rotation: 0,
              x: 30,
              y: 30,
              playerId: socket.id
            }
            
            // socket.emit only sends to new player that conneted
            socket.emit('currentPlayers', players)
          
            // update all other players of the new player
            socket.broadcast.emit('newPlayer', players[socket.id]);
            
            socket.on('disconnect', function () {
          
              console.log('player [' + socket.id + '] disconnected')
              delete players[socket.id]
              io.sockets.emit('playerDisconnected', socket.id)
            });
          
            socket.on('messageFromClient', msg => {
              console.log('server received message from client');
              io.sockets.emit('test', socket.id)
            });
            */
          
            socket.onAny((event, ...args) => {
              console.log(event, args);            
            });
          });
    }

    public Start() {
        var port = 3000;
        this.server.listen(3000);
        console.log(`Server listening on port ${port}.`);
    }
}

new App().Start()