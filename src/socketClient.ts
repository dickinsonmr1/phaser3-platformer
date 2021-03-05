
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

// socket.io
// https://socket.io/get-started/private-messaging-part-1/#Server-initialization
// https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-2/
// https://stackoverflow.com/questions/32674391/io-emit-vs-socket-emit
// https://www.stackbuilders.com/news/strongly-typed-realtime-programming-with-typescript
// https://sbcode.net/tssock/client-emit/

export class Client {
    private socket: Socket
    private playerNames: string[] = [];

    constructor() {
        const URL = "http://localhost:3000";
        this.socket = io(URL, { autoConnect: true });

        this.socket.onAny((event, ...args) => {
            console.log(event, args);            
        });

        this.socket.on("connect", () => {
            console.log("connected to server");
        })        
    
        // all other players get this
        this.socket.on('newPlayer', (playerInfo) => {
            console.log('new player from server')
        });

        // only current player gets this
        this.socket.on('currentPlayers', (players: any) => {

            this.socket.emit("message", "Thanks for having me");                    
            this.playerNames.push("hello world");              
          });

        this.socket.on('disconnected', (socketId) => {
            console.log('player [' + socketId + '] disconnected')
        });

        //this.socket.emit('messageFromClient', 'test');        
    }   
    
    addPlayer(players: any) {
        
    }
}