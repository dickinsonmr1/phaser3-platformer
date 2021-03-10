
// TO COMPILE:
// tsc server/server.ts --outDir build/server --esModuleInterop true

// TO SERVE:
// node server/build/server.js 
import { createServer } from "http";
import { Server, Socket } from "socket.io";

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

export class PlayerOnServer {
  public x: number;  
  public y: number;
  public playerId: string;
  
  constructor(x: number, y: number, playerId: string) {
    this.x = x;
    this.y = y;
    this.playerId = playerId;
  }
}
var players: PlayerOnServer[] = [];

io.on('connection', (socket) => {

  socket.emit('testing123', 'hello world');
  
  console.log('player [' + socket.id + '] connected')
             
  var newPlayer = new PlayerOnServer(30, 30, socket.id);
  players.push(newPlayer);

  // socket.emit: send the players object to the new player ONLY
  socket.emit('currentPlayers', players);
  //socket.emit('myNewPlayer', newPlayer);

  // socket.broadcast.emit: update all other existing players of the new player
  socket.broadcast.emit('newPlayer', newPlayer);            

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function() {
    console.log('user disconnected');

    //var playerToRemove = players.find(item => item.playerId === socket.id);
    const filteredPlayers = players.filter((x) => x.playerId !== socket.id);
      
    players = filteredPlayers;

    // emit a message to all players to remove this player
    io.emit('playerLeft', socket.id);
  });

  socket.on('playerMovement', function(functionData) { //player: PlayerOnServer) {
    console.log("player moved: " + socket.id);
    var player = players.find(item => item.playerId === socket.id);
    player.x = functionData.x;
    player.y = functionData.y;
    //const filteredPlayers = players.filter((x) => x.playerId !== socket.id);      
    //players = filteredPlayers;    
    socket.broadcast.emit('playerMoved', player);
  });


  /*
  socket.on('messageFromClient', msg => {
    console.log('server received message from client');

    for (var i = 0; i < this.players.length; i++)
      console.log("Player: " + this.players[i]);

    io.sockets.emit('test', socket.id)
  });
  */

  socket.onAny((event, ...args) => {
      console.log(event, args);            
  });
});

http.listen(port);
console.log(`Server listening on port ${port}.`);


/*
//const port: number = 3000
class App {
    
    private port: string;
    private server: Server;
    private io: Socket;

    constructor() {
        this.server = http;
        this.io = io;

        this.io.on('connection', (socket) => {

            socket.emit('testing123', 'hello world');
            
            console.log('player [' + socket.id + '] connected')
                       
            var newPlayer = players[socket.id] = {
              x: 30,
              y: 30,
              playerId: socket.id
            };
            

            // socket.emit: send the players object to the new player ONLY
            socket.emit('currentPlayers', this.players);
            //socket.emit('myNewPlayer', newPlayer);

            // socket.broadcast.emit: update all other existing players of the new player
            socket.broadcast.emit('newPlayer', newPlayer);            

            // when a player disconnects, remove them from our players object
            socket.on('disconnect', function() {
              console.log('user disconnected');

              if(socket != null) {
                console.log(socket.id);
                // remove this player from our players object
                delete this.players[socket.id];
                // emit a message to all players to remove this player
                io.emit('disconnect', socket.id);
              }
            });

            socket.on('messageFromClient', msg => {
              console.log('server received message from client');

              for (var i = 0; i < this.players.length; i++)
                console.log("Player: " + this.players[i]);

              io.sockets.emit('test', socket.id)
            });            

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
*/