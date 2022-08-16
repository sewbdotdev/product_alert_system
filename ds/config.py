from  os import getenv
import asyncio


config = {
    'SS_HOST': getenv('SS_HOST', 'ss'),
    'SS_PORT': getenv('SS_PORT', 3000),
    'KAFKA_TOPIC': getenv('KAFKA_TOPIC', 'products'),
    'loop': asyncio.get_event_loop(),
    "KAFKA_BOOTSTRAP_SERVERS": getenv('KAFKA_BOOTSTRAP_SERVERS', "localhost:9092"),
    "MAX_PRICE_CHANGE": getenv('MAX_PRICE_CHANGE', 50),
    "EVENT_GENERATION_INTERVAL": getenv('EVENT_GENERATION_INTERVAL', 60)
}

