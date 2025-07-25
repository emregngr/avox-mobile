import firebase from '@react-native-firebase/app'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { collection, getDocs, getFirestore } from '@react-native-firebase/firestore'

import type { Airport } from '@/types/feature/airport'

const db = getFirestore(firebase.app())

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

    return airports.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  } catch (error) {
    return []
  }
}
