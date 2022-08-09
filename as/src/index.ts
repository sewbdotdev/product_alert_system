import "reflect-metadata";
import express from 'express';
import { rootHandler, alertsHandler } from './handlers';
import config from './config';


async function startserver() {
  const app = express();
  const port = config.port;

  await require('./loaders').default({ expressApp: app })

  // Transforms the raw string of req.body into json
  app.use(express.json());

  
  app.get('/', rootHandler);
  app.post('/alert', alertsHandler);

  app
    .listen(port, () => {
      console.info(`[as-server]: 
      ################################################
      🛡️[as-server]:  Server listening on port: ${port} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      console.error(err);
      process.exit(1);
    });
  
  process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
    throw reason;
  });

  process.on("uncaughtException", (error) => {
    console.error(error)
    process.exit(1);
  });
}

startserver()
