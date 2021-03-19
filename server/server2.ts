import { Server as HttpServer } from "http"
import { Socket, Server as SocketIoServer } from "socket.io"

const port: number = 3000


// to compile:
// tsc server/server2.ts --outDir server/build/ --esModuleInterop true

// to run:
// node server/build/server2.js

class App {
    private server: HttpServer
    private port: number

    private io: SocketIoServer

    constructor(port: number) {
        this.port = port

        this.server = new HttpServer();
        this.io = new SocketIoServer(this.server, {
            cors: {
                origin: "http://127.0.0.1:8080",
            },
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('a user connected : ' + socket.id);

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