import { getAirportById, getAllAirports } from '@/services/airportService'
import { Logger } from '@/utils/common/logger'

const { collection, doc, getDoc, getDocs } = require('@react-native-firebase/firestore')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

describe('Airport Service', () => {
  describe('getAllAirports', () => {
    it('should fetch airports and sort them by name', async () => {
      const mockedData = {
        docs: [
          { id: '2', data: () => ({ name: 'Sabiha Gokcen Airport' }) },
          { id: '1', data: () => ({ name: 'Istanbul Airport' }) },
          { id: '4', data: () => ({ name: 'Izmir Adnan Menderes Airport' }) },
          { id: '3', data: () => ({ name: 'Ankara Esenboga Airport' }) },
        ],
      }
      getDocs.mockResolvedValue(mockedData)

      const result = await getAllAirports('en')

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'enAirports')
      expect(getDocs).toHaveBeenCalled()

      expect(result).toEqual([
        { id: '3', name: 'Ankara Esenboga Airport' },
        { id: '1', name: 'Istanbul Airport' },
        { id: '4', name: 'Izmir Adnan Menderes Airport' },
        { id: '2', name: 'Sabiha Gokcen Airport' },
      ])
    })

    it('should return an empty array on error', async () => {
      const mockedError = new Error('Network error')
      getDocs.mockRejectedValue(mockedError)

      const result = await getAllAirports('tr')

      expect(result).toEqual([])
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get all airports',
        'error',
        mockedError,
      )
    })
  })

  describe('getAirportById', () => {
    it('should return the airport object if document exists', async () => {
      const mockedDoc = {
        exists: () => true,
        id: 'ist-123',
        data: () => ({ name: 'Istanbul Airport' }),
      }
      getDoc.mockResolvedValue(mockedDoc)

      const result = await getAirportById('ist-123', 'tr')

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'trAirports', 'ist-123')
      expect(getDoc).toHaveBeenCalled()
      expect(result).toEqual({
        id: 'ist-123',
        name: 'Istanbul Airport',
      })
    })

    it('should return null if document does not exist', async () => {
      const mockedDoc = {
        exists: () => false,
      }
      getDoc.mockResolvedValue(mockedDoc)

      const result = await getAirportById('non-existent-id', 'en')

      expect(result).toBeNull()
    })

    it('should return null if id is empty or contains only whitespace', async () => {
      const resultEmpty = await getAirportById('', 'en')
      const resultWhitespace = await getAirportById('   ', 'en')

      expect(resultEmpty).toBeNull()
      expect(resultWhitespace).toBeNull()
      expect(doc).not.toHaveBeenCalled()
    })

    it('should return null on error', async () => {
      const mockedError = new Error('Permission denied')
      getDoc.mockRejectedValue(mockedError)

      const result = await getAirportById('any-id', 'en')

      expect(result).toBeNull()
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get airport by id',
        'error',
        mockedError,
      )
    })
  })
})
