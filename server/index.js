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
  //console.log(players.length)
  
  players[socket.id] = {
    rotation: 0,
    x: 30,
    y: 30,
    playerId: socket.id
  }
  socket.emit('currentPlayers', players)
  //socket.broadcast.emit('newPlayer', players[socket.id])

  socket.on('disconnect', function () {

    console.log('player [' + socket.id + '] disconnected')
    delete players[socket.id]
    io.emit('playerDisconnected', socket.id)
  });

  socket.on('messageFromServer', msg => {
      console.log('chat message handled');
      io.emit('broadcastToClient', msg);
  });

  socket.on('messageFromClient', msg => {
    console.log('server received message from client');
  });

  socket.onAny((event, ...args) => {
    console.log(event, args);            
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
