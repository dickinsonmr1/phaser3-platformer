import { Server as HttpServer } from "http"
import { Socket, Server as SocketIoServer } from "socket.io"

import { GameServer } from "./gameServer";
import { PlayerOnServer } from "./gameobjects/playerOnServer";
import { WorldOnServer } from "./gameobjects/worldOnServer";

const port: number = 3000


// to compile:
// tsc server/server2.ts --outDir server/build/ --esModuleInterop true

// to run:
// node server/build/server2.js

// https://sbcode.net/tssock/server-emit-specific-socket/

var players: PlayerOnServer[] = [];

const gameServer: GameServer = new GameServer();
const worldOnServer: WorldOnServer = new WorldOnServer();

class App {
    private server: HttpServer
    private port: number

    //private io: SocketIoServer

    //private players: PlayerOnServer[] = [];
    //private gameServer: GameServer = new GameServer();
    //private worldOnServer: WorldOnServer = new WorldOnServer();

    constructor(port: number) {
        this.port = port

        this.server = new HttpServer();
        const io = new SocketIoServer(this.server, {
            cors: {
                origin: "http://127.0.0.1:8080",
            },
        });
        
        io.on('connection', (socket: Socket) => {
            console.log('User connected: ' + socket.id);

            var newPlayer = new PlayerOnServer(30, 30, socket.id, false);
            players.push(newPlayer);
          
            // socket.emit: send the players object to the new player ONLY
            socket.emit('currentPlayers', players);
          
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
              player.flipX = functionData.flipX;
          
              worldOnServer.movePlayer();
              socket.broadcast.emit('playerMoved', player);    
            });
          
            socket.on('newBullet', function(functionData) { //player: PlayerOnServer) {
              console.log("new bullet from player: " + socket.id);
              var player = players.find(item => item.playerId === socket.id);
              player.x = functionData.x;
              player.y = functionData.y;
              player.flipX = functionData.flipX;
          
              worldOnServer.movePlayer();
              socket.broadcast.emit('playerMoved', player);    
            });
          
            socket.on('tileRemoval', function(functionData) {
              
              worldOnServer.removeTile();
              socket.broadcast.emit('tileRemoved', {tileX: functionData.tileX, tileY: functionData.tileY, layer: functionData.layer});      
            });

            socket.onAny((event, ...args) => {
                console.log(event, args);            
            });
        })
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log( `Server listening on port ${this.port}.` )
        })
    }
}

new App(port).Start()