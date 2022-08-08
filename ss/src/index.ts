import app from "./app";
import { db, cache } from "./utils/persistence";
const port = process.env.SS_PORT;

cache.on("error", (err: Error) => console.log("Redis Client Error", err));

app.listen(port, async () => {
  await cache.connect();
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on("unhandledRejection", (error: Error, promise) => {
  throw error; // will generate an uncaughtException
});

// Deals with programmer errors by exiting the node application
process.on("uncaughtException", (error) => {
  console.log(error);
});
