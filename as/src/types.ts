export type alertKeysList = string[]

export type Alert = {
  product: string
  type: string
  value: number
}

export type Notification = {
  alert: Alert,
  name: string,
  email: string
}

export type User = string

export type Users = {
  id: string,
  fullName: string,
  email: string,
  createdAt: Date,
  updatedAt: Date
}