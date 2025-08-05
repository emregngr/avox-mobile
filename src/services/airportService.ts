import { getApp } from '@react-native-firebase/app'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { collection, doc, getDoc, getDocs, getFirestore } from '@react-native-firebase/firestore'

import type { Airport } from '@/types/feature/airport'
import { Logger } from '@/utils/common/logger'

const app = getApp()
const db = getFirestore(app)

export const getAllAirports = async (locale: string): Promise<Airport[]> => {
  try {
    const collectionName = locale === 'en' ? 'enAirports' : 'trAirports'

    const airportsCollectionRef = collection(db, collectionName)
    const snapshot = await getDocs(airportsCollectionRef)

    const airports = snapshot.docs.map(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        ({
          ...doc.data(),
          id: doc.id,
        }) as unknown as Airport,
    ) as Airport[]

    return airports.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
  } catch (error) {
    Logger.breadcrumb('Failed to get all airports', 'error', error as Error)
    return []
  }
}

export const getAirportById = async (id: string, locale: string): Promise<Airport | null> => {
  try {
    if (!id?.trim()) {
      return null
    }

    const collectionName = locale === 'en' ? 'enAirports' : 'trAirports'
    const airportDocRef = doc(db, collectionName, id)
    const airportDoc = await getDoc(airportDocRef)

    if (airportDoc.exists()) {
      const data = airportDoc.data()
      return {
        ...data,
        id: airportDoc.id,
      } as unknown as Airport
    }

    return null
  } catch (error) {
    Logger.breadcrumb('Failed to get airport by id', 'error', error as Error)
    return null
  }
}
