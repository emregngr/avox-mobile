import { getApp } from '@react-native-firebase/app'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { collection, doc, getDoc, getDocs, getFirestore } from '@react-native-firebase/firestore'

import type { AirlineType } from '@/types/feature/airline'
import { Logger } from '@/utils/common/logger'

const app = getApp()
const db = getFirestore(app)

export const getAllAirlines = async (locale: string): Promise<AirlineType[]> => {
  try {
    const collectionName = locale === 'en' ? 'enAirlines' : 'trAirlines'

    const airlinesCollectionRef = collection(db, collectionName)
    const snapshot = await getDocs(airlinesCollectionRef)

    const airlines = snapshot.docs.map(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        ({
          ...doc.data(),
          id: doc.id,
        }) as unknown as AirlineType,
    ) as AirlineType[]

    return airlines.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
  } catch (error) {
    Logger.breadcrumb('Failed to get all airlines', 'error', error as Error)
    return []
  }
}

export const getAirlineById = async (id: string, locale: string): Promise<AirlineType | null> => {
  try {
    if (!id?.trim()) {
      return null
    }

    const collectionName = locale === 'en' ? 'enAirlines' : 'trAirlines'
    const airlineDocRef = doc(db, collectionName, id)
    const airlineDoc = await getDoc(airlineDocRef)

    if (airlineDoc.exists()) {
      const data = airlineDoc.data()
      return {
        ...data,
        id: airlineDoc.id,
      } as unknown as AirlineType
    }

    return null
  } catch (error) {
    Logger.breadcrumb('Failed to get airline by id', 'error', error as Error)
    return null
  }
}
