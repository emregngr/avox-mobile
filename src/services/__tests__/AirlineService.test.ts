import { getAirlineById, getAllAirlines } from '@/services/airlineService'
import { Logger } from '@/utils/common/logger'

const { collection, doc, getDoc, getDocs } = require('@react-native-firebase/firestore')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

describe('airlineService', () => {
  describe('getAllAirlines', () => {
    it('should fetch airlines and sort them by name', async () => {
      const mockedData = {
        docs: [
          { id: '2', data: () => ({ name: 'Turkish Airlines' }) },
          { id: '1', data: () => ({ name: 'AtlasGlobal' }) },
          { id: '3', data: () => ({ name: 'Pegasus' }) },
        ],
      }
      getDocs.mockResolvedValue(mockedData)

      const result = await getAllAirlines('en')

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'enAirlines')

      expect(getDocs).toHaveBeenCalled()

      expect(result).toEqual([
        { id: '1', name: 'AtlasGlobal' },
        { id: '3', name: 'Pegasus' },
        { id: '2', name: 'Turkish Airlines' },
      ])
    })

    it('should return an empty array on error', async () => {
      getDocs.mockRejectedValue(new Error('Network error'))

      const result = await getAllAirlines('tr')

      expect(result).toEqual([])
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get all airlines',
        'error',
        expect.any(Error),
      )
    })
  })

  describe('getAirlineById', () => {
    it('should return the airline object if document exists', async () => {
      const mockDoc = {
        exists: () => true,
        id: 'pegasus-123',
        data: () => ({ name: 'Pegasus' }),
      }
      getDoc.mockResolvedValue(mockDoc)

      const result = await getAirlineById('pegasus-123', 'tr')

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'trAirlines', 'pegasus-123')
      expect(getDoc).toHaveBeenCalled()
      expect(result).toEqual({
        id: 'pegasus-123',
        name: 'Pegasus',
      })
    })

    it('should return null if document does not exist', async () => {
      const mockedDoc = {
        exists: () => false,
      }
      getDoc.mockResolvedValue(mockedDoc)

      const result = await getAirlineById('non-existent-id', 'en')
      expect(result).toBeNull()
    })

    it('should return null if id is empty or contains only whitespace', async () => {
      const resultEmpty = await getAirlineById('', 'en')
      expect(resultEmpty).toBeNull()

      const resultWhitespace = await getAirlineById('   ', 'en')
      expect(resultWhitespace).toBeNull()

      expect(doc).not.toHaveBeenCalled()
    })

    it('should return null on error', async () => {
      getDoc.mockRejectedValue(new Error('Permission denied'))

      const result = await getAirlineById('any-id', 'en')
      expect(result).toBeNull()
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get airline by id',
        'error',
        expect.any(Error),
      )
    })
  })
})
