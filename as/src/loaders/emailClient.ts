import config from "../config"
import { IEmail } from "../types"
import nodemailer from "nodemailer"

export abstract class EmailClient {

  abstract initClient (): void

  abstract sendMail (to: string, email: IEmail): void
 
}

class NodemailerClient implements EmailClient {
  private from_: string
  private transporter: nodemailer.Transporter

  constructor(sender_name: string, sender_email: string) {
    this.from_ = `${sender_name} <${sender_email}>`
    this.initClient()
  }

  async initClient () : Promise<void> {
    try {
      const userAccount = await nodemailer.createTestAccount()
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        pool: true,
        secure: false,
        auth : {
          user: userAccount.user,
          pass: userAccount.pass
        }
      })
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to initialize Nodemailer client: ${error}`)
    }
  }

  async sendMail(to: string, email: IEmail): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: this.from_,
        to,
        subject: email.subject,
        html: email.body
      })
      
      console.info(`[as-server]: Notification alert successfully sent to ${to}: ${info.messageId}`)
      console.info(`[as-server]: Preview alert sent to ${to} here: ${nodemailer.getTestMessageUrl(info)}`)
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to send alert to ${to}: ${error}`)
    }
    
  }

}


const defaultEmailClient = new NodemailerClient(config.sender_name, config.sender_email)

/**
 * To use a different transport mechanism for the NodemailerClient (say you have MailGun or SendGrid credentials), simply update the transporter
 * with your credentials. For example, you may have to change the `host` field from `smtp.ethereal.email` to `smtp.sendgrid.net`. Check the docs
 * for more: https://nodemailer.com/smtp/
 * 
 * To use a different email client entirely (say Mailgun, Sendgrid, etc. ) as opposed to NodeMailer, simply create the client class (e.g. MailgunClient
 * or SendgridClient)that implements `EmailClient` and its abstract methods (`initClient` and `sendMail`). Also ensure `defaultEmailClient` is
 * an instance of your newly created client. So instead of;
 * `const defaultEmailClient = new NodemailerClient(config.sender_name, config.sender_email)`
 * as seen above, you should have something like;
 * `const defaultEmailClient = new MailgunClient(config.sender_name, config.sender_email, config.API_KEY)`
 * depending on the client you've chosen as well as the configurations it requires (an API_KEY, for example).
 */

export default defaultEmailClient