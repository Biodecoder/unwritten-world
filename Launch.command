#!/bin/bash
cd "$(dirname "$0")"
PORT=8096
echo "Starting Unwritten World MMORPG server on http://127.0.0.1:$PORT ..."
node server.mjs &
SERVER_PID=$!
sleep 1
open "http://127.0.0.1:$PORT"
wait $SERVER_PID
