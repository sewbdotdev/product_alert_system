import eventDispatcher, { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import { alertKeysList, User, Users } from '../types';
import Container from 'typedi';
import { RedisClientType } from '@redis/client';

@EventSubscriber()
export default class AlertSubscribers {

  @On(events.alert.sendAlerts)
  public async onSendAlerts({ alertKeys } : { alertKeys : alertKeysList }) {
    const cache: RedisClientType = Container.get("cacheConnection")

    for (const alertKey of alertKeys) {
      const users: User[] = await cache.lRange(alertKey, 0, -1)
      eventDispatcher.dispatch(events.alert.sendUserNotification, { users } )

    }
  }

  @On(events.alert.sendUserNotification)
  public async onSendUserNotification(users: User[]) {
    
  }

}