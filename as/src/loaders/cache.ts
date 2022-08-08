import { createClient, RedisClientType } from "redis"
import config from "../config"

const url = `redis://@${config.cache_host}:${config.cache_port}`;
const cacheConnection = createClient({url}) 

export { cacheConnection }