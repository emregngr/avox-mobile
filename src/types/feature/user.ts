import type { Timestamp } from '@react-native-firebase/firestore'

export type UserProfileType = {
  createdAt?: Timestamp
  displayName: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
  photoURL: string | null
  uid: string
}

export type ProfileDataType = {
  email: string
  firstName: string
  lastName: string
}
