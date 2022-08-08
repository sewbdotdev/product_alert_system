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
      console.info(`[as-server]: Preview alert sent ${to} here: ${nodemailer.getTestMessageUrl(info)}`)
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to send alert to ${to}`)
    }
    
  }

}

const defaultEmailClient = new NodemailerClient(config.sender_name, config.sender_email)
export default defaultEmailClient