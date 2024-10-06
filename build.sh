#!/bin/bash

CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)

docker build --platform=linux/arm64 -t shell-playground:v1 "$CURRENT_DIR"

sleep 1

docker run -it --rm -p 21110:21110 shell-playground:v1

# http://localhost:21110
