
from cache import cache
from alerts import send_alert_keys

def create_alert_key(product_name: str, alert_type: int, product_price: int):
  return f"{product_name}:{alert_type}:{product_price}"


def get_subscriptions(product_name_and_price):
  product_name, product_price = product_name_and_price
  alert_keys: list = []
  
  # get thresholds for ABOVE alerts (alerts for users that want to be notified when the new product price is greater than the threshold)
  prices_above = cache.zrangebyscore(f"{product_name}:1", 0, int(product_price), withscores=True)
  print(f"💥{ product_name} thresholds for ABOVE alerts @ a price of {product_price} 💥: ", prices_above)
  for _, price in prices_above:
    alert_keys.append(create_alert_key(product_name, 1, int(price)))

  # get thresholds for BELOW alerts (alerts for users that want to be notified when the new product price is lesser than the threshold)
  prices_below = cache.zrangebyscore(f"{product_name}:-1", product_price, float("inf"), withscores=True)
  print(f"💥{ product_name} thresholds for BELOW alerts @ a price of {product_price} 💥: ", prices_below)
  for _, price in prices_below:
    alert_keys.append(create_alert_key(product_name, -1, int(price)))

  # send POST request { "alertKeys": alertKeys} to Alert Service
  if alert_keys:
    print(f"💥Alert Keys for {product_name}💥: ", alert_keys)
    send_alert_keys(alert_keys)
  return
  
