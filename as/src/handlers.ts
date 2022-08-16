import { Request, Response } from 'express';
import { IAlertKeys } from './types'
import AlertService from './services/alert';
import Container from 'typedi';

export interface IAlertResponse {
  message: string,
  timestamp: Date
}

export const rootHandler = (_req: Request, res: Response) => {
  return res.send('API is working 🤓');
};

export const alertsHandler = async (req: Request <{}, {}, IAlertKeys>, res: Response) => {
  const { alertKeys } = req.body 
  const alertServiceInstance = Container.get(AlertService)
  await alertServiceInstance.sendAlerts(alertKeys)
  const alertResponse: IAlertResponse = {
    message: "Alerts received",
    timestamp: new Date()
  }
  return res.send(JSON.stringify(alertResponse)).status(201)
};