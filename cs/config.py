from os import getenv

config = {
  "CACHE_HOST" : getenv("CACHE_HOST", "cache"),
  "CACHE_PORT" : getenv("CACHE_PORT", "6379"),
  "AS_HOST" : getenv("AS_HOST", "as"),
  "AS_PORT" : getenv("AS_PORT", "4444"),
  'KAFKA_TOPIC': getenv('KAFKA_TOPIC', 'products'),
  "KAFKA_BOOTSTRAP_SERVERS": getenv('KAFKA_BOOTSTRAP_SERVERS', "localhost:9092"),
}