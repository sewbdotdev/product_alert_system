import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const url = `redis://@${process.env.CACHE_HOST}:${process.env.CACHE_PORT}`;
const cache = createClient({
  url,
});

const db = new PrismaClient();

export { db, cache };
