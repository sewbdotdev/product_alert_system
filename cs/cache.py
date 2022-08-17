import redis
from config import config

cache = redis.Redis(
  host = config["CACHE_HOST"],
  port = config["CACHE_PORT"]
)