#!/bin/bash

# mkdir logs
# output to logs/app.log
nohup node index.js >> logs/app.log 2>&1 &
echo "Node.js app started. Check logs/app.log for details."
