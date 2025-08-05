import { getApp } from '@react-native-firebase/app'
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore'

import { getLocale } from '@/locales/i18next'
import type { Home } from '@/types/feature/home'
import { Logger } from '@/utils/common/logger'

const app = getApp()
const db = getFirestore(app)

export const getAllHomeData = async (locale: string): Promise<Home> => {
  try {
    const collectionName = locale === 'en' ? 'enHome' : 'trHome'

    const documentId = 'homeData'

    const docRef = doc(db, collectionName, documentId)

    const docSnap = await getDoc(docRef)

    if (docSnap?.exists()) {
      return docSnap?.data() as Home
    } else {
      return {
        breakingNews: [],
        popularAirlines: [],
        popularAirports: [],
        popularDestinations: [],
        totalAirplanes: [],
      }
    }
  } catch (error) {
    Logger.breadcrumb('Failed to get all home data', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}
