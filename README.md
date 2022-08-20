# Product Alert System
This is a system that simulates users receiving notification on prices of products. The users create notifications about product prices and receives alerts when the state of the prices reaches the notification specification.
It is a microservice application that makes use of both internal HTTP calls and event driven communication to faciliate the satisfaction of the user's requirements.
An article that addressed the design of the system can be found [here](https://sewb.dev/posts/product-alert-system-9b4zuuz).


## API Documentation
[Postman Collection](https://www.getpostman.com/collections/d58a1e3756154d3a01d8)


## Architecture
![System Design: Product Alert System on sewb.dev](https://res.cloudinary.com/sewb/image/upload/v1660292211/High_Level_Design_of_Product_Alert_System_299cfcb7cc.png)
## Services
The Product Alert System comprises of four services,
- [Alert Service (as)](https://github.com/sewbdotdev/product_alert_system/tree/main/as): Handles sending alerts to the users.
- [Calculator Service (cs)](https://github.com/sewbdotdev/product_alert_system/tree/main/cs): Handles calculating the product price changes with the state the user sent.
- [Data Store (ds)](https://github.com/sewbdotdev/product_alert_system/tree/main/ds): service that generates the product prices.
- [Standardisation Service (ss)](https://github.com/sewbdotdev/product_alert_system/tree/main/ss): Interfacing service between the user and the entire system.
For a detailed description of these services, checkout out this blog post on [Product Alert System](https://sewb.dev/posts/product-alert-system-9b4zuuz) as well as each service's README file.
## Design considerations
### How notifications created are stored
When a notification is created by the user, the standardisation service creates a composite cache key to aggregate all prices set by users per product. This composite key has the format `<product_name>:<threshold>`. The value this key holds is a sorted set of all prices set by users in the system. We map `ABOVE` threshold to `1` and `BELOW` threshold to `-1`. For example, if a user creates a notification for when the price of Bag falls below `199`, the standardisation service creates a cache entry of `Bag:-1`-> `[{score:199, value: 199}]`. If another notification is created for when the price of Bag fall below 150, the cache entry is updated to `Bag:-1` -> `[{score:150, value: 150},{score:199, value: 199}]`. We make use of [Redis](https://redis.io/) as our caching service and leverage the Sorted Set data structure to achieve this.
### How we minimize network requests to the database
To minimize network calls to the database, the standardisation service also creates a cache entry of `<product_name>:<threshold>:<price>` as key to a set of user details, i.e. `{user1_details, user2_details}` as values. This aggregates the details (e.g. name, email address) of all users who want to be notified when a price change occurs. Since multiple users may create the same notifications (the same product, price and threshold combination), it's convenient to store those user details in a single location. This can then be used by the alert service to retrieve user details and notify them.
### How we handle sending notifications
For notifications, we are not explicitly sending an emails to the users; instead we make use of nodemailer's etheral (temporary) emails and log the link to the terminal. Clicking this link would take you to a page where you could see the notification message sent. Please check the readme file of the Alert Service for a better explanation.
## How to run
- Ensure docker is installed on your machine
- An env_template containing the necessary environment variables has been provided. Create an .env file in the root of the project and populate it with the contents of the env_template
- In your terminal, run docker-compose up to start the application. This spins up the required services in containers, and the application should now be available to serve requests
- You'll need access to the system logs to see the application in full effect, so
  - in another terminal, run docker logs as -f. Prints the logs from the Alert
  Service which is necessary to see the email preview URL for sent notifications
  - in another terminal, run docker logs cs -f. This outputs the logs from the Calculator Service, so you're able to follow the event consumption process
  - in another terminal, run docker logs ds -f. This outputs the logs from the Data Store, so you're able to follow the event production process
  - in another terminal, run docker logs ss -f. This outputs the logs from the Standardisation service, so you're able to follow the logs.
![Logs of all services](/img/Logs%20of%20all%20services.png)
- To stop the application, run docker-compose down
## How to test
You'd need an API client like [Postman](https://www.postman.com/) to conveniently test the application. You can checkout the postman collection [documentation](https://www.getpostman.com/collections/d58a1e3756154d3a01d8) for reference, but here's a short walkthrough of how to create alerts;
*Please note that base_url referenced below is simply where your application is running on your machine. By defaultm it's http://localhost/3000 but you can change the port in the env file as you see fit.*
- First, create a user by making a POST request with the body below to base_url/auth. This create a user with an id of 1 as seen in the response
  json
  {
    "email":"example@gmail.com",
    "fullName": "example"
  }
  - You can retrive the list of products and their prices with a GET request to base_url/products. Each porduct in the response has a name, price, and an id.
- To create a notification alert for a product, send a POST request with the body below to base_url/notification;
json
  {
    "threshold": "ABOVE",
    "productId": 1,
    "price": 80,
    "userId": 1
  }
- The fields in the body of the request are as follows;
    - threshold: determines the notification type and it can take one of two values; ABOVE and BELOW. ABOVE notificaitons would be sent to the user if the new price of a product is greater than the price set in the notification. BELOW notificaitons would be sent to the user if the new price of a product is less than the price set in the notification.
    - productId: is the id of the product a user wants to monitor. As mentioned earlier, you can see a list of products and their ID by sending a GET request to base_url/products.
    - price: is the price of the product you wnat to base your notification on
    - userId: is simply a user's ID
- To see a list of a user's notifications, send a GET request to base_url/notification/{userId} where userId is the user's ID.
- Following the instructions in [How to run](#how-to-run), you can monitor the state of the application. And when a new price change results in a notification being sent, you'd see the email preview URL in the logs, and be able to confirm that the alert was sent.
## Contributions
If you have comments, questions, suggestions or anything, please let us know by leaving a comment on the accompanying article on our blog at [Product Alert System](https://sewb.dev/posts/product-alert-system-9b4zuuz).
If you have code contributions, please make a pull request. Thank you🙏!.
# Happy hacking 😃!!