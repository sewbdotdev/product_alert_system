# Alert Service

This service is responsible for sending notification alerts to users. It - 

- receives a list of `stock:type:threshold` keys from the Calculator Service
- gets the profiles of users subscribed to each event from the Cache
- send an email notification to each subscribed user
