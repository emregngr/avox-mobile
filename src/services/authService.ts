import { appleAuth } from '@invertase/react-native-apple-authentication'
import { getApp } from '@react-native-firebase/app'
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

import config from '@/config/env/environment'
import { getLocale } from '@/locales/i18next'
import { updateUser } from '@/services/userService'
import type { LoginCredentialsType, RegisterCredentialsType } from '@/types/feature/auth'
import { Logger } from '@/utils/common/logger'

const app = getApp()
const auth = getAuth(app)

GoogleSignin.configure({
  webClientId: config.googleWebClientId,
})

export const authStateChanged = (callback: (user: FirebaseAuthTypes.User | null) => void) =>
  onAuthStateChanged(auth, callback)

export const signUpWithEmail = async ({
  email,
  firstName,
  lastName,
  password,
}: RegisterCredentialsType): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateUser({ email, firstName, lastName })
    return userCredential
  } catch (error) {
    Logger.breadcrumb('Failed to sign up with email', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const signInWithEmail = async ({
  email,
  password,
}: LoginCredentialsType): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential
  } catch (error) {
    Logger.breadcrumb('Failed to sign in with email', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const signInWithGoogle = async (): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
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
  } catch (error) {
    Logger.breadcrumb('Failed to sign in with google', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const signInWithApple = async (): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
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
  } catch (error) {
    Logger.breadcrumb('Failed to sign in with apple', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const handleLogout = async () => {
  try {
    const currentUser = GoogleSignin.getCurrentUser()
    if (currentUser) {
      await GoogleSignin.signOut()
    }
    await signOut(auth)
  } catch (error) {
    Logger.breadcrumb('Failed to handle logout', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const sendPasswordResetLink = async (email: string): Promise<void> => {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error(getLocale('invalidEmail'))
  }
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    Logger.breadcrumb('Failed to send password reset link', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}
