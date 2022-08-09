import { Service, Inject } from 'typedi';
import { EmailClient } from '../loaders/emailClient';
import { IEmail, IUser } from '../types';

@Service()
export default class MailerService {
  constructor(
    @Inject('defaultEmailClient') private defaultEmailClient: EmailClient,
  ) { }

  public async sendAlert(user: IUser, alertKey: string) {

    try {
      const body = this._constructBody(user.fullName, alertKey)
      const email: IEmail = {
        "subject": "New Product Alert",
        "body": body
      }
      await this.defaultEmailClient.sendMail(user.email, email)
    } catch (error) {
      throw Error(`Unable to send notification email ${user.fullName}:${alertKey}`)
    }
    
  }

  private _constructBody(name: string, alertKey: string) {

    const [product, threshold, value] = alertKey.split(":")
    if (!product || !threshold || !value){
      throw new Error(`Invalid AlertKey: ${alertKey}`)
    }
    const aboveOrBelow = Number(threshold) === 1  ? "rose above"  : "fell below"
    const body = `<p>Hi <b>${name}</b>,<br><br>The price of <b>${product}</b> just ${aboveOrBelow} <b>$${value}</b>.</p>`
    return body
  }
  
}