import { appleAuth } from '@invertase/react-native-apple-authentication'
import firebase from '@react-native-firebase/app'
import type { FirebaseAuthTypes } from '@react-native-firebase/auth'
import {
  AppleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { getLocale } from '@/locales/i18next'
import { updateUser } from '@/services/userService'
import type { LoginCredentials, RegisterCredentials } from '@/types/feature/auth'

const auth = getAuth(firebase.app())

GoogleSignin.configure({
  webClientId: '396294037399-2eemb48ih22r5i9ctkjvbvaaaqvlb2vu.apps.googleusercontent.com',
})

export const authStateChanged = (callback: (user: FirebaseAuthTypes.User | null) => void) =>
  onAuthStateChanged(auth, callback)

export const signUpWithEmail = async ({
  email,
  firstName,
  lastName,
  password,
}: RegisterCredentials): Promise<FirebaseAuthTypes.UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await updateUser({ email, firstName, lastName })
  return userCredential
}

export const signInWithEmail = async ({
  email,
  password,
}: LoginCredentials): Promise<FirebaseAuthTypes.UserCredential> =>
  signInWithEmailAndPassword(auth, email, password)

export const signInWithGoogle = async (): Promise<FirebaseAuthTypes.UserCredential> => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
  await GoogleSignin.signIn()
  const { idToken } = await GoogleSignin.getTokens()
  if (!idToken) {
    throw new Error(getLocale('googleSignInFailed'))
  }
  const googleCredential = GoogleAuthProvider.credential(idToken)
  const userCredential = await signInWithCredential(auth, googleCredential)
  const user = userCredential?.user
  const displayName = user?.displayName ?? ''
  const [firstName, ...rest] = displayName?.split(' ')
  const lastName = rest.join(' ')
  const email = userCredential?.user?.email as string
  if (firstName && lastName) {
    await updateUser({ email, firstName, lastName })
  }
  return userCredential
}

export const signInWithApple = async (): Promise<FirebaseAuthTypes.UserCredential> => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  })
  const { email, fullName, identityToken, nonce } = appleAuthRequestResponse
  if (!identityToken) {
    throw new Error(getLocale('appleSignInFailed'))
  }
  const appleCredential = AppleAuthProvider.credential(identityToken, nonce)
  const userCredential = await signInWithCredential(auth, appleCredential)
  const safeEmail = email ?? userCredential?.user?.email
  if (fullName?.givenName && fullName?.familyName && safeEmail) {
    const firstName = fullName.givenName
    const lastName = fullName.familyName
    await updateUser({ email: safeEmail, firstName, lastName })
  }
  return userCredential
}

export const handleLogout = async () => {
  try {
    const isSignedIn = await GoogleSignin.signInSilently()
    if (isSignedIn) {
      await GoogleSignin.signOut()
    }
  } catch (error) {
    throw new Error(getLocale('somethingWentWrong'))
  }
  await signOut(auth)
}

export const sendPasswordResetLink = async (email: string): Promise<void> => {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error(getLocale('invalidEmail'))
  }
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    throw new Error(getLocale('somethingWentWrong'))
  }
}
