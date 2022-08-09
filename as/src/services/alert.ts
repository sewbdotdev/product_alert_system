import { Service } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events'

@Service()
export default class AlertService {
  constructor(
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ){
    }
  
  public async sendAlerts(alertKeys: string[]): Promise<boolean> {
    try {
      this.eventDispatcher.dispatch(events.alert.sendAlerts, { alertKeys } )
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
}