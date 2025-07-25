import AsyncStorage from '@react-native-async-storage/async-storage'
import firebase from '@react-native-firebase/app'
import {
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from '@react-native-firebase/auth'
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  setDoc,
} from '@react-native-firebase/firestore'

import { getLocale } from '@/locales/i18next'
import type { AddPasswordCredentials, ChangePasswordCredentials } from '@/types/feature/password'
import type { ProfileData, UserProfile } from '@/types/feature/user'
import AnalyticsService from '@/utils/common/analytic'
import Device from '@/utils/common/device'

const auth = getAuth(firebase.app())
const db = getFirestore(firebase.app())

export const getUser = async (): Promise<UserProfile | null> => {
  const user = auth?.currentUser
  if (!user) {
    return null
  }

  try {
    const userRef = doc(db, 'users', user?.uid)
    const docSnap = await getDoc(userRef)
    await AsyncStorage.setItem('user-id', `${user?.uid}`)

    if (docSnap.exists()) {
      const firestoreData = docSnap.data()
      const userData: UserProfile = {
        createdAt: firestoreData?.createdAt,
        displayName: user.displayName || null,
        email: user.email || null,
        firstName: firestoreData?.firstName || null,
        lastName: firestoreData?.lastName || null,
        photoURL: user.photoURL || null,
        uid: user.uid,
      }
      await AnalyticsService.setUser(userData)
      return userData
    } else {
      const userData: UserProfile = {
        displayName: user.displayName || null,
        email: user.email || null,
        firstName: null,
        lastName: null,
        photoURL: user.photoURL || null,
        uid: user.uid,
      }
      await AnalyticsService.setUser(userData)
      return userData
    }
  } catch (error) {
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const updateUser = async (profileData: ProfileData): Promise<void> => {
  const user = auth?.currentUser
  if (!user) {
    throw new Error(getLocale('userNotLoggedIn'))
  }

  const { email, firstName, lastName } = profileData
  const userRef = doc(db, 'users', user?.uid)

  try {
    await Promise.all([
      setDoc(userRef, { email, firstName, lastName }, { merge: true }),
      updateProfile(user, { displayName: `${firstName} ${lastName}` }),
    ])
  } catch (error) {
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const changeUserPassword = async (credentials: ChangePasswordCredentials): Promise<void> => {
  const { currentPassword, newPassword } = credentials
  const user = auth?.currentUser

  if (!user?.email) {
    throw new Error(getLocale('userNotLoggedIn'))
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)
    await updatePassword(user, newPassword)
  } catch (error) {
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const addUserPassword = async (credentials: AddPasswordCredentials): Promise<void> => {
  const { newPassword } = credentials
  const user = auth?.currentUser

  if (!user?.email) {
    throw new Error(getLocale('userNotLoggedIn'))
  }

  try {
    const credential = EmailAuthProvider.credential(user?.email, newPassword)
    await linkWithCredential(user, credential)
  } catch (error: any) {
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const deleteUserAccount = async (): Promise<void> => {
  const user = auth?.currentUser
  if (!user) {
    throw new Error(getLocale('userNotLoggedIn'))
  }

  try {
    const userDocRef = doc(db, 'users', user?.uid)
    await deleteDoc(userDocRef)
    await user?.delete()
  } catch (error: any) {
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const registerDevice = async (): Promise<void> => {
  try {
    const deviceParams = await Device.registerDevice()
    const deviceId = deviceParams?.unique_id

    if (!deviceId) {
      throw new Error(getLocale('somethingWentWrong'))
    }

    const deviceRef = doc(db, 'devices', deviceId)

    const deviceData = {
      ...deviceParams,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(deviceRef, deviceData)
  } catch (error: any) {
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const registerDeviceToUser = async (): Promise<void> => {
  const user = auth.currentUser
  if (!user) {
    throw new Error(getLocale('userNotLoggedIn'))
  }

  try {
    const deviceParams = await Device.registerDevice()
    const deviceId = deviceParams?.unique_id

    if (!deviceId) {
      throw new Error(getLocale('somethingWentWrong'))
    }

    const userRef = doc(db, 'users', user?.uid)
    const deviceRef = doc(db, 'devices', deviceId)

    const updatedDevice = {
      ...deviceParams,
      updatedAt: new Date(),
    }

    await runTransaction(db, async transaction => {
      const userDoc = await transaction.get(userRef)
      const devices = userDoc?.data()?.devices || []

      const existingDeviceIndex = devices?.findIndex(
        (device: typeof updatedDevice) => device?.unique_id === deviceId,
      )

      if (existingDeviceIndex > -1) {
        devices[existingDeviceIndex] = updatedDevice
      } else {
        devices.push(updatedDevice)
      }

      transaction.set(userRef, { devices }, { merge: true })

      transaction.update(deviceRef, {
        updatedAt: new Date(),
        userId: user.uid,
      })
    })
  } catch (error) {
    throw new Error(getLocale('somethingWentWrong'))
  }
}
