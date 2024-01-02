const express = require('express');
const http = require('http');
const cors = require('cors'); // Import the cors module

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'https://magustk.hu' || 'http://localhost:8080' ,
    credentials: true
  },
  allowEIO3: true
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('subscribe', (channel) => {
    socket.join(channel);
    // console.log(`Socket ${socket.id} subscribed to channel ${channel}`);
  });

  socket.on('message', (data) => {
    // console.log(`Received message from ${socket.id} in channel ${data.channel}: ${data.message}`);
    io.to(data.channel).emit('message', data.message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
