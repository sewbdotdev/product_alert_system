# Standardisation Service for the Product Alert System

This is a minimal express server that interfaces with the user to enable the following features.

- Sign up.
- Product notification creation.
- Retrieval of all notifications of a user.
- Retrieval of all products in the system.

To keep the server minimal as possible, it doesn't have any authentication or authorization mechanisms and lacks best practice approaches to developing a production application. This is not PRODUCTION READY, instead, the goal of this service is to only satisfy the above features/requirements.

## Requirements and Packages

- Docker
- NodeJS
- Typescript
- Prisma ORM
- Redis client

## Project walkthrough

- src: contains the code for the application.
  - src/util: contains utility files used by the application e.g. cache and database connection etc.
  - src/prisma: contains schema definition for the database
- build: contains the output of the typescript compilation.
- wait.sh: Contains commands to ensure the application isn't started before the database and cache.

## How to run

For local development, at the root of the entire product alert system, run `docker-compose up` to start the entire application. This would handle installing the necessary packages, starting the database and cache and then starting the application.

