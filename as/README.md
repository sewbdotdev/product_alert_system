# Alert Service for the Product Alert System

This service is responsible for sending notification alerts to users. It -

- receives a list of alert keys (`product:type:threshold`) from the [Calculator Service](https://github.com/sewbdotdev/product_alert_system/tree/main/cs)
- gets the profiles of users subscribed to each event from the Cache
- sends an email notification to each subscribed user

## Requirements and Packages

- NodeJS
- Docker
- TypeScript
- Redis client
- Nodemailer

## Project walkthrough

- `src`: houses the application code
    - `/loaders`: contains nodeJS and app configurations such as the email client, redis client, and events register
    - `/decorators`: contains custom decorators such as the `EventDispatcher`
    - `/services`: contains application services such as the `AlertService` (triggers alert events) and the `MailerService` (sends notification emails to subscribers)
    - `/subscribers`: contains event consumers
    - `handlers`: route handlers
    - `config`: project environment configurations
    - `types`: custom types and interfaces
    - `index`: app entry point
- `dist`: contains the output of the typescript compilation
- `wait.sh`: commands to ensure the application isn't started before the cache.

## How emails are sent

The Alert Service uses [Nodemailer](https://nodemailer.com/about/) as the default email client. In order to provide a *complete* out-of-the-box experience that requires minimal user interaction with the code when they run this project, an [ephemeral email](https://ethereal.email) config was used. With this config, although alerts will be sent, you won't receive them in your email inbox. Rather, they're intercepted and available for preview at a URL that is logged to the console as seen in the image below;

![Notification Alert Email Preview URL](../img/Alert%20Service%20Email%20Preview%20URL.png)

You can preview the email through URL as seen below;

![Notification Alert Email Preview](../img/Alert%20Service%20Email%20Preview.png)

*If you'd like to really receive alerts in your email (say in a production instance), you'd need to setup a mail client (say [Mailgun](https://documentation.mailgun.com/en/latest/index.html), [Sendgrid](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs), etc.) in `src/loaders/emailClient`.*

## How to run

For local development,

- create an `.env` file and populate it with the variables specified in `env_template`
- at the root of the entire product alert system, run `docker-compose up` to start the entire application.
- this would install the necessary packages, starting the cache and then the application
- by default the Alert Service is exposed on port `4444` so you'd find it running on http://localhost:4444

## API Documentation

Documentation of the Alert Service can be found under the Product Alert System.
https://www.getpostman.com/collections/497d17d238d9d8440470
