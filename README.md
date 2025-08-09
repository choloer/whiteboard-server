# Whiteboard Server

Real-time whiteboard server using Node.js, Express, and Socket.io.

## Quick Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/choloer/whiteboard-server)

## Manual Setup

1. Clone this repository
2. Run `npm install`
3. Run `npm start`
4. Server will be available at `http://localhost:5000`

## Environment Variables

- `PORT`: Server port (set by Render automatically)
- `NODE_ENV`: production
- `CLIENT_URL`: URL of the client application (for CORS)

## Features

- Real-time drawing synchronization
- WebSocket support via Socket.io
- Drawing data persistence (in-memory)
- CORS support for client connections