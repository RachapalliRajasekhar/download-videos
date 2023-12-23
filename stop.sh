pid=$(ps -p aux | grep '/c/Program Files/nodejs/node' | awk '{print $1}')
  if [ -n "$pid" ]; then
    kill "$pid"
    echo "Node.js app stopped (PID: $pid)."
  else
    echo "Node.js app is not running."
  fi