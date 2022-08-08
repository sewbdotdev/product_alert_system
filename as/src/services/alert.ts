import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
// import MailerService from './mailer';
import { alertKeysList } from '../types'
import events from '../subscribers/events'

@Service()
export default class AlertService {
  constructor(
    // private mailer: MailerService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ){

    }
  
  public async sendAlerts(alertKeys: alertKeysList): Promise<boolean> {
    try {
      // send list of keys event
      this.eventDispatcher.dispatch(events.alert.sendAlerts, { alertKeys } )
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
}