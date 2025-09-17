import { getLocale } from '@/locales/i18next'
import {
  addToFavorites,
  fetchFavoriteDetails,
  fetchFavoriteIds,
  removeFromFavorites,
} from '@/services/favoriteService'
import type { FavoriteItemType, FavoritesType } from '@/types/feature/favorite'
import { Logger } from '@/utils/common/logger'

const { mockedAuth } = require('@react-native-firebase/auth')
const {
  getDoc,
  doc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  setDoc,
} = require('@react-native-firebase/firestore')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

beforeEach(() => {
  mockedAuth.currentUser = { uid: 'test-user-id' }

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      somethingWentWrong: 'Something went wrong.',
      userNotLoggedIn: 'User not logged in.',
    }
    return translations[key] || key
  })
})

describe('Favorite Service', () => {
  describe('fetchFavoriteIds', () => {
    it('should return favorite ids if user is logged in and document exists', async () => {
      const mockedFavorites = [{ id: 'airport1', type: 'airport' }]
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ favorites: mockedFavorites }),
      })

      const favorites = await fetchFavoriteIds()

      expect(favorites).toEqual(mockedFavorites)
      expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', 'test-user-id')
      expect(getDoc).toHaveBeenCalled()
    })

    it('should return an empty array if the user is not logged in', async () => {
      mockedAuth.currentUser = null
      const favorites = await fetchFavoriteIds()
      expect(favorites).toEqual([])
      expect(getDoc).not.toHaveBeenCalled()
    })

    it('should return an empty array if the user document does not exist', async () => {
      getDoc.mockResolvedValue({
        exists: () => false,
      })

      const favorites = await fetchFavoriteIds()

      expect(favorites).toEqual([])
    })

    it('should return an empty array if the favorites field is missing', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({}),
      })

      const favorites = await fetchFavoriteIds()

      expect(favorites).toEqual([])
    })

    it('should throw a generic error on failure', async () => {
      const error = new Error('Firestore failed')
      getDoc.mockRejectedValue(error)

      await expect(fetchFavoriteIds()).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to fetch favorite ids',
        'error',
        error,
      )
    })
  })

  describe('fetchFavoriteDetails', () => {
    const mockedFavoriteItems: FavoritesType = [
      { id: 'LGW', type: 'airport' },
      { id: 'BA', type: 'airline' },
    ]
    const selectedLocale = 'en'

    it('should return an array of favorite details', async () => {
      const mockedAirportDoc = {
        exists: () => true,
        data: () => ({ id: 'LGW', name: 'Gatwick' }),
      }
      const mockedAirlineDoc = {
        exists: () => true,
        data: () => ({ id: 'BA', name: 'British Airways' }),
      }

      getDoc.mockResolvedValueOnce(mockedAirportDoc).mockResolvedValueOnce(mockedAirlineDoc)

      const details = await fetchFavoriteDetails(mockedFavoriteItems, selectedLocale)

      expect(details).toHaveLength(2)
      expect(details).toEqual([
        { id: 'LGW', name: 'Gatwick' },
        { id: 'BA', name: 'British Airways' },
      ])
      expect(doc).toHaveBeenCalledWith(expect.anything(), 'enAirports', 'LGW')
      expect(doc).toHaveBeenCalledWith(expect.anything(), 'enAirlines', 'BA')
    })

    it('should return an empty array if no favorite items are provided', async () => {
      const details = await fetchFavoriteDetails([], selectedLocale)
      expect(details).toEqual([])
      expect(getDoc).not.toHaveBeenCalled()
    })

    it('should handle cases where some documents do not exist', async () => {
      const airportDoc = {
        exists: () => true,
        data: () => ({ id: 'LGW', name: 'Gatwick' }),
      }
      const nonExistentDoc = {
        exists: () => false,
      }

      getDoc.mockResolvedValueOnce(airportDoc).mockResolvedValueOnce(nonExistentDoc)

      const details = await fetchFavoriteDetails(mockedFavoriteItems, selectedLocale)

      expect(details).toHaveLength(1)
      expect(details[0]).toEqual({ id: 'LGW', name: 'Gatwick' })
    })

    it('should resolve gracefully and return an empty array on error', async () => {
      const error = new Error('Firestore failed')
      getDoc.mockRejectedValue(error)

      const result = await fetchFavoriteDetails(mockedFavoriteItems, selectedLocale)

      expect(result).toEqual([])
      expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
    })
  })

  describe('addToFavorites', () => {
    const mockedFavoriteItem: FavoriteItemType = { id: 'LHR', type: 'airport' }
    const mockedFieldValue = 'mocked-array-union-value'

    it('should update an existing user document', async () => {
      getDoc.mockResolvedValue({ exists: () => true })
      arrayUnion.mockReturnValue(mockedFieldValue)
      const userDocRef = { path: 'users/test-user-id' }
      doc.mockReturnValue(userDocRef)

      await addToFavorites(mockedFavoriteItem)

      expect(updateDoc).toHaveBeenCalledWith(userDocRef, {
        favorites: mockedFieldValue,
      })
      expect(setDoc).not.toHaveBeenCalled()
    })

    it('should create a new user document if it does not exist', async () => {
      getDoc.mockResolvedValue({ exists: () => false })
      const userDocRef = { path: 'users/test-user-id' }
      doc.mockReturnValue(userDocRef)

      await addToFavorites(mockedFavoriteItem)

      expect(setDoc).toHaveBeenCalledWith(userDocRef, {
        favorites: [mockedFavoriteItem],
      })
      expect(updateDoc).not.toHaveBeenCalled()
    })

    it('should throw an error if the user is not logged in', async () => {
      mockedAuth.currentUser = null
      await expect(addToFavorites(mockedFavoriteItem)).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('userNotLoggedIn')
    })

    it('should throw a generic error on failure', async () => {
      const error = new Error('Firestore failed')
      getDoc.mockRejectedValue(error)

      await expect(addToFavorites(mockedFavoriteItem)).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to add to favorites',
        'error',
        error,
      )
    })
  })

  describe('removeFromFavorites', () => {
    const mockedFavoriteItem: FavoriteItemType = { id: '1', type: 'airport' }
    const mockedFieldValue = 'mocked-array-remove-value'

    it('should remove an item from an existing user document', async () => {
      getDoc.mockResolvedValue({ exists: () => true })
      arrayRemove.mockReturnValue(mockedFieldValue)
      const userDocRef = { path: 'users/test-user-id' }
      doc.mockReturnValue(userDocRef)

      await removeFromFavorites(mockedFavoriteItem)

      expect(updateDoc).toHaveBeenCalledWith(userDocRef, {
        favorites: mockedFieldValue,
      })
    })

    it('should do nothing if the user document does not exist', async () => {
      getDoc.mockResolvedValue({ exists: () => false })

      await removeFromFavorites(mockedFavoriteItem)

      expect(updateDoc).not.toHaveBeenCalled()
    })

    it('should throw an error if the user is not logged in', async () => {
      mockedAuth.currentUser = null
      await expect(removeFromFavorites(mockedFavoriteItem)).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('userNotLoggedIn')
    })

    it('should throw a generic error on failure', async () => {
      const error = new Error('Firestore failed')
      getDoc.mockRejectedValue(error)

      await expect(removeFromFavorites(mockedFavoriteItem)).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to remove from favorites',
        'error',
        error,
      )
    })
  })
})
