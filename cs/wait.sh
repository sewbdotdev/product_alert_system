#!/bin/sh
while true; do
    nc -z $KAFKA_HOST $KAFKA_PORT
    kAFKA_RUNNING=$?
    if [ $kAFKA_RUNNING -eq "0" ]; then
        echo "===== Kafka is online ======"
        break
    else
        echo "Kafka is offline...."
    fi
    sleep 1
done

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

while true; do
    nc -z $DS_HOST $DS_PORT
    SS_RUNNING=$?
    if [ $SS_RUNNING -eq "0" ]; then
        echo "===== Data Source is online ======"
        break
    else
        echo "Data Source is offline...."
    fi
    sleep 1
done

python main.py

# exec "$@"
