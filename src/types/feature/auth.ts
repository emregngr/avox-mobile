export type RegisterCredentials = {
  email: string,
  firstName: string,
  lastName: string,
  password: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type SocialCredentials = {
  provider: 'google' | 'apple'
}

export type AuthCredentials = RegisterCredentials | LoginCredentials | SocialCredentials

export type RegisterType = {
  email: string,
  firstName: string,
  lastName: string,
  password: string
  token: string
}

export type LoginType = {
  email: string
  password: string
  token: string
}

export type SocialType = {
  provider: 'google' | 'apple'
  token: string
}
