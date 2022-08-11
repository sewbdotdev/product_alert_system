# Data source for the Product Alert System

This is a FastAPI server that handles producing events in the form of product price changes in the system.
At the start of the application, it retrieves the list of products from the `Standardisation service` and then produces price changes which are written to `Kafka` for other services that need to consume it.

It also contains one single endpoint /products that returns the current price of products at the time of calling it. This can be used by a UI service or Standardisation service to retrieve current product prices for users to then create the notifications.

## Requirements and Packages

- Docker
- FastAPI
- Asyncio
- Aiokafka
- Http3

## Project walkthrough

- config: contains environment configurations used by the application
- requirements: contains the packages and dependencies
- main.py: contains the logic for producing price change events and responding to requests from other services.
- wait.sh: Contains commands to ensure the application isn't started before kafka and the standardisation service.

## How to run

For local development, at the root of the entire product alert system, run `docker-compose up` to start the entire application. This would handle installing the necessary packages, starting the database and cache and then starting the application.

## API Documentation

https://www.getpostman.com/collections/497d17d238d9d8440470

## NOTE

You may observe the following error/warning in the logs `Topic products is not available during auto-create initialization`. This can be ignored as auto-create topic is enabled for the Kafka container. You can also manually create this by either running

- `docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic $KAFKA_TOPIC` in your terminal where "$KAFKA_TOPIC" is the topic to be created (called "products" in the env)
- Navigate to http://localhost:9000/ in your browser and create a topic using the Kafkadrop UI.

Happy hacking :)...
