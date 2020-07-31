#!/bin/bash
if ! command -v docker &> /dev/null
then
    echo "ERROR: 'docker' command could not be found"
    exit 1
fi

TIMESTAMP=$(date +%s)

echo
echo "1. Building image ---------------------------------"
docker build --quiet --tag test-image-$TIMESTAMP .

echo
echo "2. Testing code -----------------------------------"
docker run --rm test-image-$TIMESTAMP

docker image rm test-image-$TIMESTAMP