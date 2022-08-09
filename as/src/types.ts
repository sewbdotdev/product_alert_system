export type IAlertKeys =  {
  alertKeys: string[]
}

export interface IUser  {
  id: string,
  fullName: string,
  email: string
  createdAt: Date,
  updatedAt: Date
}

export interface IEmail {
  subject: string,
  body: string
}