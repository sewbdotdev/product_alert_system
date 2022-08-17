import asyncio, json
import time
from config import config
from aiokafka import AIOKafkaConsumer
import multiprocessing
from calculator import get_subscriptions

async def consume(pool):
  consumer = AIOKafkaConsumer(
    config["KAFKA_TOPIC"], bootstrap_servers=config["KAFKA_BOOTSTRAP_SERVERS"]
    )
  await consumer.start()

  try:
    async for products_prices in consumer:
      print(f"💥Consuming new product prices💥")
      products_prices = json.loads(products_prices.value)
      print("💥 Start consumption💥: ", products_prices)
      processes = [pool.apply_async(get_subscriptions, args=(product_price,)) for product_price in products_prices.items()]
      print("💥 End consumption💥: ", products_prices)

  except Exception as e:
    print("💥 Something went wrong: ", e)
  
  finally:
    print(f"💥Stopping Consume process💥")
    await consumer.stop()


if __name__ == "__main__":
  print(f"💥 Calculator Service is up 💥")
  print(f"💥 Initializing process pool 💥")
  start_time = time.perf_counter()
  pool = multiprocessing.Pool()
  finish_time = time.perf_counter()
  print(f"💥 {time.perf_counter()} Initialized process pool in {finish_time - start_time} seconds 💥")
  task = asyncio.run(consume(pool))