"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
//import { GameServer } from "./gameServer";
const playerOnServer_1 = require("./gameobjects/playerOnServer");
const bulletOnServer_1 = require("./gameobjects/bulletOnServer");
const worldOnServer_1 = require("./gameobjects/worldOnServer");
const port = 3000;
// to compile:
// tsc server/server2.ts --outDir server/build/ --esModuleInterop true
// to run:
// node server/build/server2.js
// https://sbcode.net/tssock/server-emit-specific-socket/
var players = [];
var bullets = [];
//const gameServer: GameServer = new GameServer(config);
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
            console.log('User connected: ' + socket.id);
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
                //console.log("new bullet from player: " + socket.id);
                var bulletOnServer = new bulletOnServer_1.BulletOnServer(functionData.bulletId, functionData.x, functionData.y, socket.id, functionData.flipX, functionData.damage, functionData.velocityX, functionData.key);
                bullets.push(bulletOnServer);
                /*
                var player = players.find(item => item.playerId === socket.id);
                player.x = functionData.x;
                player.y = functionData.y;
                player.flipX = functionData.flipX;
                */
                worldOnServer.playerFiredBullet();
                socket.broadcast.emit('newBullet', bulletOnServer);
            });
            socket.on('bulletMovement', function (functionData) {
                //console.log("bullet moved: " + functionData.bulletId);
                var bullet = bullets.find(item => item.bulletId === functionData.bulletId);
                if (bullet != null) {
                    bullet.x = functionData.x;
                    bullet.y = functionData.y;
                    bullet.velocityX = functionData.velocityX;
                }
                socket.broadcast.emit('bulletMoved', bullet);
            });
            socket.on('bulletDestruction', function (functionData) {
                //console.log("bulletDestruction: " + functionData.bulletId);
                const filteredBullets = bullets.filter((x) => x.bulletId !== functionData.bulletId);
                bullets = filteredBullets;
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
/*
// main game configuration
var config: Phaser.Types.Core.GameConfig = {
  width: 1920,
  height: 1080,
  type: Phaser.AUTO,
  parent: "game",
  input: { keyboard: true, gamepad: true},
  audio: {
    //noAudio: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: true,
      debugShowBody: true,
      debugShowStaticBody: true,
      debugShowVelocity: true,
      debugVelocityColor: 0xffff00,
      debugBodyColor: 0x0000ff,
      debugStaticBodyColor: 0xffffff
    }
  }
};

// game class
export class GameServer extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  var game = new GameServer(config);
});

*/
// main game configuration
/*
var config: Phaser.Types.Core.GameConfig = {
 //width: 1920,
 //height: 1080,
 type: Phaser.HEADLESS,
 physics: {
   default: "arcade",
   arcade: {
     gravity: { y: 500 },
   }
 }
};
*/
//var game = new GameServer(config);
/*
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true
  });
}
 
setupAuthoritativePhaser();
*/ 
