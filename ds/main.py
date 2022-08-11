from fastapi import FastAPI, HTTPException
import http3
import json
from aiokafka import AIOKafkaProducer
from config import config
import asyncio
import random

app = FastAPI()
client = http3.AsyncClient()
# stores an array of products retrieved from the standardisation service
products = []
# mapping of product name => (price, id)
product_to_price = {}


# health check endpoint
@app.get("/")
async def Home():
    return "welcome home"

# responds with current price of products


@app.get("/products")
async def get_products():
    response = build_product_list()

    return response


# function that handles retrieving the current product from the Standardisation service
async def fetch_products():
    req = await client.get(
        f"http://{config['SS_HOST']}:{config['SS_PORT']}/ds/products/"
    )
    if req.status_code != 200:
        raise HTTPException(
            status_code=400, detail="Failed to fetch products. Please try again."
        )
    return req.json()

# creates the product name => (price, id) and stores it the product_to_price dictionary


def build_product_dic(products):
    for product in products:
        product_to_price[product["name"]] = (product["price"], product["id"])


# reverses the build_product_dic operation to produce an array of {price, product name, id}
def build_product_list():
    data_to_return = []
    for k, v in product_to_price.items():
        data = {"name": k, "price": v[0], "id": v[1]}
        data_to_return.append(data)
    return data_to_return

# function that handles producing events


async def produce():
    """
    Connects to the kafka queue and continuosly loops to perform the following
    - creates a temporary dictionary to hold product name => current price 
    - loops over all items in product_to_price dictionary
        - generates a random price from 0 - 10
        - generates an operation between 0 or 1 where 1 represents addition and 0 represents subtraction
        - if operation is addition, updates product with new price
        - if operation is subtraction, it only updates price if price won't result in a negative price
        - updates temporary dictionary with items
    - converts dictionary to json object
    - writes to the kafka topic
    - sleeps for time specified in config which helps handle price change generation rate/interval.
    """
    producer = AIOKafkaProducer(
        loop=config["loop"], bootstrap_servers=config["KAFKA_BOOTSTRAP_SERVERS"]
    )
    await producer.start()
    try:
        while True:
            temp = {}
            for k, v in product_to_price.items():
                price_change = random.randint(0, 10)
                operation = random.randint(0, 1)
                if operation == 1:
                    product_to_price[k] = (v[0] + price_change, v[1])
                else:
                    if v[0] - price_change >= 0:
                        product_to_price[k] = (v[0] - price_change, v[1])
                temp[k] = v[0]
            print(f"Producing events")
            value_json = json.dumps(temp).encode("utf-8")
            await producer.send_and_wait(topic=config['KAFKA_TOPIC'], value=value_json)
            await asyncio.sleep(int(config['EVENT_GENERATION_INTERVAL']))
    except Exception as e:
        print(e)
        await producer.stop()

# reqisters the event production task and starts it.
task = asyncio.create_task(produce())
# calls all required functions at startup


@app.on_event("startup")
async def startup_event():
    fetched_products = await fetch_products()
    products.extend(fetched_products)
    build_product_dic(products)
    await task
