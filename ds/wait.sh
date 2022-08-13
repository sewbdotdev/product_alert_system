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
    nc -z $SS_HOST $SS_PORT
    SS_RUNNING=$?
    if [ $SS_RUNNING -eq "0" ]; then
        echo "===== Standardisation service is online ======"
        break
    else
        echo "Standardisation service is offline...."
    fi
    sleep 1
done

# echo "==== Creating topic ===== "
# docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic $KAFKA_TOPIC
echo "===== Starting the application ======"
uvicorn main:app --host 0.0.0.0 --port 8888 --reload

# exec "$@"
