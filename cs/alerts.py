import requests
from config import config

# send POST request { "alertKeys": alertKeys} to Alert Service
def send_alert_keys(alert_keys: list):
  url = f"http://{config['AS_HOST']}:{config['AS_PORT']}/alert"
  res = requests.post(url, json={"alertKeys": alert_keys})
  print(f"💥 Alert Keys sent💥: ", res.json())
  return