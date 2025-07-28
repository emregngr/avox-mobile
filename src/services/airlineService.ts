import { getApp } from '@react-native-firebase/app'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { collection, doc, getDoc, getDocs, getFirestore } from '@react-native-firebase/firestore'

import type { Airline } from '@/types/feature/airline'

const app = getApp()
const db = getFirestore(app)

export const getAllAirlines = async (locale: string): Promise<Airline[]> => {
  try {
    const collectionName = locale === 'en' ? 'enAirlines' : 'trAirlines'

    const airlinesCollectionRef = collection(db, collectionName)
    const snapshot = await getDocs(airlinesCollectionRef)

    const airlines = snapshot.docs.map(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        ({
          ...doc.data(),
          id: doc.id,
        }) as unknown as Airline,
    ) as Airline[]

    return airlines.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  } catch (error) {
    return []
  }
}

export const getAirlineById = async (id: string, locale: string): Promise<Airline | null> => {
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
      } as unknown as Airline
    }

    return null
  } catch (error) {
    return null
  }
}
