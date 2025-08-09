const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "https://client-miaytqf46-osama-projects.vercel.app",
      /https:\/\/.*\.vercel\.app$/
    ].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "https://client-miaytqf46-osama-projects.vercel.app",
    /https:\/\/.*\.vercel\.app$/
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Store drawing data in memory (in production, use a database)
let drawings = [];

app.get('/', (req, res) => {
  res.json({ message: 'Whiteboard server is running' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send existing drawings to new user
  socket.emit('load-drawings', drawings);

  // Handle drawing events
  socket.on('drawing', (data) => {
    drawings.push(data);
    socket.broadcast.emit('drawing', data);
  });

  // Handle clear board
  socket.on('clear-board', () => {
    drawings = [];
    socket.broadcast.emit('clear-board');
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});