import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore'

import { getLocale } from '@/locales/i18next'
import type { Airline } from '@/types/feature/airline'
import type { Airport } from '@/types/feature/airport'
import type { FavoriteItem, Favorites } from '@/types/feature/favorite'
import { Logger } from '@/utils/common/logger'

const app = getApp()
const auth = getAuth(app)
const db = getFirestore(app)

const getCurrentUserId = (): string | undefined => auth?.currentUser?.uid

export const fetchFavoriteIds = async (): Promise<Favorites> => {
  const userId = getCurrentUserId()
  if (!userId) return []

  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)

    if (userDoc?.exists()) {
      const data = userDoc?.data()
      if (data?.favorites) {
        return data?.favorites
      }
    }
    return []
  } catch (error) {
    Logger.breadcrumb('Failed to fetch favorite ids', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const fetchFavoriteDetails = async (
  favoriteItems: Favorites,
  selectedLocale: string,
): Promise<(Airport | Airline)[]> => {
  if (!favoriteItems || favoriteItems.length === 0) {
    return []
  }

  try {
    const fetchPromises = favoriteItems.map(favorite => {
      const type = favorite.type === 'airline' ? 'Airlines' : 'Airports'
      const collectionName = `${selectedLocale}${type}`
      const itemRef = doc(db, collectionName, favorite.id)
      return getDoc(itemRef)
    })

    const results = await Promise.allSettled(fetchPromises)

    const fetchedItems: (Airport | Airline)[] = []

    results.forEach((result, index) => {
      const favoriteType = favoriteItems[index]?.type

      if (result?.status === 'fulfilled' && result?.value?.exists()) {
        const docData = result?.value?.data()

        if (favoriteType === 'airport') {
          const airportItem = docData as Airport
          fetchedItems?.push(airportItem)
        } else {
          const airlineItem = docData as Airline
          fetchedItems?.push(airlineItem)
        }
      }
    })

    return fetchedItems
  } catch (error) {
    Logger.breadcrumb('Failed to fetch favorite details', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const addToFavorites = async ({ id, type }: FavoriteItem): Promise<void> => {
  const userId = getCurrentUserId()
  if (!userId) throw new Error(getLocale('userNotLoggedIn'))

  const userRef = doc(db, 'users', userId)
  const favoriteObject = { id, type }

  try {
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        favorites: arrayUnion(favoriteObject),
      })
    } else {
      await setDoc(userRef, {
        favorites: [favoriteObject],
      })
    }
  } catch (error) {
    Logger.breadcrumb('Failed to add to favorites', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}

export const removeFromFavorites = async ({ id, type }: FavoriteItem): Promise<void> => {
  const userId = getCurrentUserId()
  if (!userId) throw new Error(getLocale('userNotLoggedIn'))

  const userRef = doc(db, 'users', userId)
  const favoriteObject = { id, type }

  try {
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        favorites: arrayRemove(favoriteObject),
      })
    }
  } catch (error) {
    Logger.breadcrumb('Failed to remove from favorites', 'error', error as Error)
    throw new Error(getLocale('somethingWentWrong'))
  }
}
