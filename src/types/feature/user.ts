import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export type UserProfile = {
  createdAt?: FirebaseFirestoreTypes.Timestamp,
  displayName: string | null,
  email: string | null,
  firstName: string | null
  lastName: string | null
  photoURL: string | null,
  uid: string
}

export type ProfileData = {
  email: string,
  firstName: string,
  lastName: string
}
