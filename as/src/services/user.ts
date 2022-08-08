import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
// import MailerService from './mailer';
import { alertKeysList, User } from '../types'
import events from '../subscribers/events'

@Service()
export default class UserService {
  constructor(
    // private mailer: MailerService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ){

    }
  
  public async getUsersDetails(alertKey: string): Promise<User[]> {
    try {
      // send list of keys event
      const users: User[] = []



      return users
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
}