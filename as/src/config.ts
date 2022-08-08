import dotenv from 'dotenv';
import * as path from "path";

const envFound = dotenv.config({
  path: path.resolve(`${__dirname}/../../`, ".env"),
});

if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {

  port: parseInt(process.env.AS_PORT, 10),

  cache_host: process.env.CACHE_HOST,
  cache_port: parseInt(process.env.CACHE_PORT),

}