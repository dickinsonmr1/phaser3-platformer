
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { PlayerOnServer } from "../server/server";
import { Player } from "./gameobjects/player";

// socket.io
// https://socket.io/get-started/private-messaging-part-1/#Server-initialization
// https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-2/
// https://stackoverflow.com/questions/32674391/io-emit-vs-socket-emit
// https://www.stackbuilders.com/news/strongly-typed-realtime-programming-with-typescript
// https://sbcode.net/tssock/client-emit/

export class Client {
    public socket: Socket
    public players: PlayerOnServer[] = [];
    public player: PlayerOnServer;

    constructor() {
        const URL = "http://localhost:3000";
        this.socket = io(URL, { autoConnect: true });
        
        this.socket.onAny((event, ...args) => {
            console.log(event, args);            
        });        

        this.socket.on("connect", () => {
            console.log("connected to server");
        });
    
        // only current player gets this
        this.socket.on('currentPlayers', (players: PlayerOnServer[]) => {

            //this.socket.emit("message", "Thanks for having me");                    
            this.players = players; 
            
            console.log('currentPlayers handled');
            this.debugAllCurrentPlayers();
        });

        // all other players get this
        this.socket.on('newPlayer', (player: PlayerOnServer) => {
            console.log('newPlayer handled')
                        
            this.players.push(player);

            this.debugAllCurrentPlayers();
        });

        this.socket.on('playerLeft', (socketId) => {
            console.log('player [' + socketId + '] disconnected')

            //var playerToRemove = players.find(item => item.playerId === socket.id);
            const filteredPlayers = this.players.filter((x) => x.playerId !== socketId);      
            this.players = filteredPlayers;

            this.debugAllCurrentPlayers();
        });

        //this.socket.emit('messageFromClient', 'test');        
    }   
    
    addPlayer(players: any) {
        
    }

    getMyPlayer() {
        for (var i = 0; i < this.players.length; i++)
            if(this.players[i].playerId == this.socket.id)
                return this.players[i];
    }

    getOtherPlayers(myPlayerId: string): Array<PlayerOnServer> {
        return this.players.filter((x) => x.playerId !== myPlayerId);
    }

    debugAllCurrentPlayers() {
        console.log('ALL PLAYERS:');
        for (var i = 0; i < this.players.length; i++) {
            if(this.players[i].playerId == this.socket.id)                
                console.log("- Player: " + this.players[i].playerId + " (me)");     
            else
                console.log("- Player: " + this.players[i].playerId);     
        }
    }    

    playerMovement(x: number, y: number) {
        //this.socket.emit('playerMovement', new PlayerOnServer(x, y, this.socket.id));//{ x: player.x, y: player.y });
    }
}