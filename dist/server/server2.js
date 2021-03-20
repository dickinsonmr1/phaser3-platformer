"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const gameServer_1 = require("./gameServer");
const playerOnServer_1 = require("./gameobjects/playerOnServer");
const worldOnServer_1 = require("./gameobjects/worldOnServer");
const port = 3000;
// to compile:
// tsc server/server2.ts --outDir server/build/ --esModuleInterop true
// to run:
// node server/build/server2.js
// https://sbcode.net/tssock/server-emit-specific-socket/
var players = [];
const gameServer = new gameServer_1.GameServer();
const worldOnServer = new worldOnServer_1.WorldOnServer();
class App {
    //private io: SocketIoServer
    //private players: PlayerOnServer[] = [];
    //private gameServer: GameServer = new GameServer();
    //private worldOnServer: WorldOnServer = new WorldOnServer();
    constructor(port) {
        this.port = port;
        this.server = new http_1.Server();
        const io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "http://127.0.0.1:8080",
            },
        });
        io.on('connection', (socket) => {
            console.log('a user definitely connected : ' + socket.id);
            var newPlayer = new playerOnServer_1.PlayerOnServer(30, 30, socket.id, false);
            players.push(newPlayer);
            // socket.emit: send the players object to the new player ONLY
            socket.emit('currentPlayers', players);
            // socket.broadcast.emit: update all other existing players of the new player
            socket.broadcast.emit('newPlayer', newPlayer);
            // when a player disconnects, remove them from our players object
            socket.on('disconnect', function () {
                console.log('user disconnected');
                //var playerToRemove = players.find(item => item.playerId === socket.id);
                const filteredPlayers = players.filter((x) => x.playerId !== socket.id);
                players = filteredPlayers;
                // emit a message to all players to remove this player              
                io.emit('playerLeft', socket.id);
            });
            socket.on('playerMovement', function (functionData) {
                console.log("player moved: " + socket.id);
                var player = players.find(item => item.playerId === socket.id);
                player.x = functionData.x;
                player.y = functionData.y;
                player.flipX = functionData.flipX;
                worldOnServer.movePlayer();
                socket.broadcast.emit('playerMoved', player);
            });
            socket.on('newBullet', function (functionData) {
                console.log("new bullet from player: " + socket.id);
                var player = players.find(item => item.playerId === socket.id);
                player.x = functionData.x;
                player.y = functionData.y;
                player.flipX = functionData.flipX;
                worldOnServer.movePlayer();
                socket.broadcast.emit('playerMoved', player);
            });
            socket.on('tileRemoval', function (functionData) {
                worldOnServer.removeTile();
                socket.broadcast.emit('tileRemoved', { tileX: functionData.tileX, tileY: functionData.tileY, layer: functionData.layer });
            });
            socket.onAny((event, ...args) => {
                console.log(event, args);
            });
        });
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        });
    }
}
new App(port).Start();
