# Calculator Service for the Product Alert System

This service is responsible for comparing new product prices with the notifications set by users, and dispatching alert notifications accordingly to the [Alert Service](https://github.com/sewbdotdev/product_alert_system/tree/main/as). It -

- consumes product price changes from `Kafka`
- compares the new product price with notification thresholds in the cache
- uses Python's `multiprocessing` module to parallize this comparison so multiple products are being processed simultaneously
- sends a POST request to the [Alert Service](https://github.com/sewbdotdev/product_alert_system/tree/main/as) containing a list of alert keys (`product:type:threshold`) for which notifications need to be sent

## Requirements and Packages

- Python 3.8
- Docker
- Redis client
- Asyncio
- Requests
- AIOKafka

## Project walkthrough

- `alerts`: logic for sending a POST request containing alert keys to the the Alert Service
- `cache`: logic for initializing the connection to the redis cache instance
- `calculator`: logic for comparing new product prices with notification thresholds, and constructing alert keys for alerts that need to be dispatched
- `config`: centralizes application environment variables into a single object
- `main`: logic for consuming price change events
- `requirements.txt`: package versions and dependencies
- `wait.sh`: commands to ensure the application isn't started before the cache, [Data Source](https://github.com/sewbdotdev/product_alert_system/tree/main/ds), and Alert Service

## How to run

For local development,

- create an `.env` file and populate it with the variables specified in `env_template`
- at the root of the entire product alert system, run `docker-compose up` to start the entire application.
- this would install the necessary packages and all services

## API Documentation

The Calculator Service doesn't expose any endpoint as it simply consumes events, retrieves cached data, and makes internal POST requests. You can find the documentation for the entire project here: https://www.getpostman.com/collections/497d17d238d9d8440470
