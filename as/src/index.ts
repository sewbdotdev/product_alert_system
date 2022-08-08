import express from 'express';
import { rootHandler, alertsHandler } from './handlers';
import config from './config';


async function startserver() {
  
  const app = express();
  const port = config.port || '3333';

  await require('./loaders').default({ expressApp: app })
  
  app.get('/', rootHandler);
  app.post('/alert', alertsHandler);
  
  // process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
  //   throw reason;
  // });

  // process.on("uncaughtException", (error: Error) => {
  //   console.error(error)
  //   process.exit(1);
  // });

  app
    .listen(config.port, () => {
      console.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      console.error(err);
      process.exit(1);
    });
}

startserver()
