export type RegisterCredentialsType = {
  email: string
  firstName: string
  lastName: string
  password: string
}

export type LoginCredentialsType = {
  email: string
  password: string
}

export type SocialCredentialsType = {
  provider: 'google' | 'apple'
}

export type AuthCredentialsType =
  | RegisterCredentialsType
  | LoginCredentialsType
  | SocialCredentialsType

export type RegisterType = {
  email: string
  firstName: string
  lastName: string
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
