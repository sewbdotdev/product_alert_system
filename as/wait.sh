#!/bin/sh

while true; do
    nc -z $CACHE_HOST 6379
    REDIS_RUNNING=$?
    if [ $REDIS_RUNNING -eq "0" ]; then
        echo "===== Redis is online ======"
        break
    else
        echo "Redis is offline...."
    fi
    sleep 1
done

echo "===== Starting the application ======"
yarn dev

# exec "$@"
