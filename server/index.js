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

var players = {}

io.on('connection', (socket) => {

  console.log('player [' + socket.id + '] connected')
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

  socket.onAny((event, ...args) => {
    console.log(event, args);            
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

/*
socket.emit('message', "this is a test"); //sending to sender-client only

socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender
socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender
socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)
socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid

io.emit('message', "this is a test"); //sending to all clients, include sender

io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender
io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender
socket.emit(); //send to all connected clients

socket.broadcast.emit(); //send to all connected clients except the one that sent the message

socket.on(); //event listener, can be called on client to execute on server
io.sockets.socket(); //for emiting to specific clients

io.sockets.emit(); //send to all connected clients (same as socket.emit)

io.sockets.on() ; //initial connection from a client.
*/