import eventDispatcher, { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import { IUser } from '../types';
import Container from 'typedi';
import { RedisClientType } from '@redis/client';
import MailerService from '../services/mailer';

@EventSubscriber()
export default class AlertSubscribers {

  @On(events.alert.sendAlerts)
  public async onSendAlerts({ alertKeys } : { alertKeys : string[] }) {

    try {
      const cache: RedisClientType = Container.get("cacheConnection")

      for (const alertKey of alertKeys) {
        const users = await cache.SMEMBERS(alertKey)
        if (!users.length) {
          console.error(`🛡️[as-server]: Alertkey ${alertKey} not found in data store`)
          return
        }
        eventDispatcher.dispatch(events.alert.sendUserNotification, { users, alertKey } )
      }
    } catch (error) {
      console.error(`🛡️[as-server]: 🔥 Error on event ${events.alert.sendAlerts}: %o`, error);
      throw error;
    }
    }
    

  @On(events.alert.sendUserNotification)
  public async onSendUserNotification({ users, alertKey }: {users: string[], alertKey: string}) {
    try {
      const mailerInstance = Container.get(MailerService)
      for (const user of users){
        const userObject: IUser = JSON.parse(user)
        await mailerInstance.sendAlert(userObject, alertKey)
      }
    } catch (error) {
      console.error(`🛡️[as-server]: 🔥 Error on event ${events.alert.sendUserNotification}: %o`, error);
      throw Error(error);
    }

  }

}