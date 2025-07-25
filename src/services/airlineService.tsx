import firebase from '@react-native-firebase/app'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { collection, getDocs, getFirestore } from '@react-native-firebase/firestore'

import type { Airline } from '@/types/feature/airline'

const db = getFirestore(firebase.app())

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
