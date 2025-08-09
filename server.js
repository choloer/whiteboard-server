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
  console.log(`[${new Date().toISOString()}] User connected:`, socket.id);
  console.log(`Total clients: ${io.engine.clientsCount}`);

  // Send existing drawings to new user
  console.log(`Sending ${drawings.length} existing drawings to ${socket.id}`);
  socket.emit('load-drawings', drawings);

  // Handle drawing events
  socket.on('drawing', (data) => {
    console.log(`[${new Date().toISOString()}] Received drawing from ${socket.id}:`, {
      x: data.x,
      y: data.y,
      color: data.color,
      width: data.width
    });
    
    drawings.push(data);
    
    // Broadcast to all other clients
    console.log(`Broadcasting drawing to ${io.engine.clientsCount - 1} other clients`);
    socket.broadcast.emit('drawing', data);
  });

  // Handle clear board
  socket.on('clear-board', () => {
    console.log(`[${new Date().toISOString()}] Clear board requested by ${socket.id}`);
    drawings = [];
    socket.broadcast.emit('clear-board');
  });

  // Handle disconnect
  socket.on('disconnect', (reason) => {
    console.log(`[${new Date().toISOString()}] User disconnected:`, socket.id, 'Reason:', reason);
    console.log(`Remaining clients: ${io.engine.clientsCount}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});