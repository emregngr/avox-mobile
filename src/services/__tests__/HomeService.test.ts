import { getLocale } from '@/locales/i18next'
import { getAllHomeData } from '@/services/homeService'
import { Logger } from '@/utils/common/logger'

const { doc, getDoc } = require('@react-native-firebase/firestore')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

beforeEach(() => {
  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      somethingWentWrong: 'Something went wrong.',
    }
    return translations[key] || key
  })
})

describe('getAllHomeData', () => {
  it('should return home data when document exists for "en" locale', async () => {
    const mockedHomeData = {
      breakingNews: [{ id: '1', title: 'News' }],
      popularAirlines: [],
      popularAirports: [],
      popularDestinations: [],
      totalAirplanes: [],
    }

    const mockedDocSnap = {
      exists: () => true,
      data: () => mockedHomeData,
    }
    getDoc.mockResolvedValue(mockedDocSnap)

    const result = await getAllHomeData('en')

    expect(result).toEqual(mockedHomeData)
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'enHome', 'homeData')
    expect(getDoc).toHaveBeenCalledTimes(1)
  })

  it('should use "trHome" collection when locale is "tr"', async () => {
    const mockedHomeData = {
      breakingNews: [{ id: '2', title: 'Haber' }],
      popularAirlines: [],
      popularAirports: [],
      popularDestinations: [],
      totalAirplanes: [],
    }
    const mockedDocSnap = {
      exists: () => true,
      data: () => mockedHomeData,
    }
    getDoc.mockResolvedValue(mockedDocSnap)

    await getAllHomeData('tr')

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'trHome', 'homeData')
  })

  it('should return default empty home data when document does not exist', async () => {
    const mockedDocSnap = {
      exists: () => false,
    }
    getDoc.mockResolvedValue(mockedDocSnap)

    const expectedDefaultData = {
      breakingNews: [],
      popularAirlines: [],
      popularAirports: [],
      popularDestinations: [],
      totalAirplanes: [],
    }

    const result = await getAllHomeData('en')

    expect(result).toEqual(expectedDefaultData)
  })

  it('should throw an error and log it when getDoc fails', async () => {
    const error = new Error('Firestore failed')
    getDoc.mockRejectedValue(error)

    await expect(getAllHomeData('en')).rejects.toThrow()

    expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
      'Failed to get all home data',
      'error',
      error,
    )
  })
})
