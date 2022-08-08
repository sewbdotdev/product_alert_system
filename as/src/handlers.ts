import { Request, Response } from 'express';
import { IAlertKeys } from './types'
import AlertService from './services/alert';
import Container from 'typedi';

// type HelloBuilder = (name: string) => HelloResponse;


export const rootHandler = (_req: Request, res: Response) => {
  return res.send('API is working 🤓');
};

export const alertsHandler = async (req: Request <{}, {}, IAlertKeys>, res: Response) => {
  const { alertKeys } = req.body 
  const alertServiceInstance = Container.get(AlertService)
  await alertServiceInstance.sendAlerts(alertKeys)
  return res.send("Alerts received").status(201)
};