import express from "express";
import dependencyInjectorLoader from './dependencyInjector';
import { cacheConnection } from './cache';
import './events';

export default async ({ expressApp } : { expressApp: express.Application }) => {

  await cacheConnection.connect()
  console.info(
    "🛡️[as-server]:  Cache connected🛡️"
  )
  await dependencyInjectorLoader()

};
