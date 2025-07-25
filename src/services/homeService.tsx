import firebase from '@react-native-firebase/app'
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore'

import { getLocale } from '@/locales/i18next'
import type { Home } from '@/types/feature/home'

const db = getFirestore(firebase.app())

export const getAllHomeData = async (locale: string): Promise<Home | null> => {
  try {
    const collectionName = locale === 'en' ? 'enHome' : 'trHome'

    const documentId = 'homeData'

    const docRef = doc(db, collectionName, documentId)

    const docSnap = await getDoc(docRef)

    if (docSnap?.exists()) {
      return docSnap?.data() as Home
    } else {
      return null
    }
  } catch (error) {
    throw new Error(getLocale('somethingWentWrong'))
  }
}
