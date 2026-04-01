#!/bin/bash

echo "🚀 Starting HackTTrain2 Development Environment"
echo ""

# Check if node_modules exist
if [ ! -d "server/node_modules" ]; then
  echo "📦 Installing server dependencies..."
  cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
  echo "📦 Installing client dependencies..."
  cd client && npm install && cd ..
fi

echo ""
echo "🎯 Starting services..."
echo "   • Server: http://localhost:5000 (Mock API enabled)"
echo "   • Client: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start server in background
cd server
npm start > /tmp/server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 2

# Check if server started successfully
if ! ps -p $SERVER_PID > /dev/null; then
  echo "❌ Failed to start server"
  cat /tmp/server.log
  exit 1
fi

echo "✅ Server started (PID: $SERVER_PID)"

# Start client
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo "✅ Client starting..."
echo ""

# Cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Stopping services..."
  kill $SERVER_PID 2>/dev/null
  kill $CLIENT_PID 2>/dev/null
  wait 2>/dev/null
  echo "✅ Services stopped"
}

trap cleanup EXIT

# Wait for all processes
wait
