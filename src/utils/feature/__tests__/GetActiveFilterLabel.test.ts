import { renderHook } from '@testing-library/react-native'

import { getFilterLabelMap } from '@/constants/activeFilterOptions'
import { getLocale } from '@/locales/i18next'
import { getActiveFilterLabel } from '@/utils/feature/getActiveFilterLabel'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/constants/activeFilterOptions')

const mockedGetFilterLabelMap = getFilterLabelMap as jest.MockedFunction<typeof getFilterLabelMap>

beforeEach(() => {
  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      freeWifi: 'Free WiFi',
      carRental: 'Car Rental',
      childrensPlayground: "Children's Playground",
      dutyFree: 'Duty Free',
      healthServices: 'Health Services',
      hotels: 'Hotels',
      lounges: 'Lounges',
      metro: 'Metro',
      placeOfWorship: 'Place of Worship',
      restaurants: 'Restaurants',
      open24Hours: 'Open 24 Hours',
      googleRating: 'Google Rating',
      skytraxRating: 'Skytrax Rating',
    }
    return translations[key] || key
  })

  mockedGetFilterLabelMap.mockReturnValue({
    continent: [
      { value: 'europe', label: 'Europe' },
      { value: 'asia', label: 'Asia' },
      { value: 'america', label: 'America' },
    ],
    country: [
      { value: 'turkey', label: 'Turkey' },
      { value: 'france', label: 'France' },
      { value: 'germany', label: 'Germany' },
    ],
    airportType: [
      { value: 'international', label: 'International' },
      { value: 'domestic', label: 'Domestic' },
    ],
  })
})

describe('getActiveFilterLabel', () => {
  describe('rating filters', () => {
    it('should format minGoogleRating correctly', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('minGoogleRating', 4)).toBe('Google Rating: 4+')
      expect(getLabel('minGoogleRating', 3.5)).toBe('Google Rating: 3.5+')
    })

    it('should format minSkytraxRating correctly', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('minSkytraxRating', 5)).toBe('Skytrax Rating: 5+')
      expect(getLabel('minSkytraxRating', 2)).toBe('Skytrax Rating: 2+')
    })
  })

  describe('boolean filters', () => {
    it('should return correct labels for true boolean values', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('freeWifi', true)).toBe('Free WiFi')
      expect(getLabel('hasCarRental', true)).toBe('Car Rental')
      expect(getLabel('hasChildrensPlayArea', true)).toBe("Children's Playground")
      expect(getLabel('hasDutyFree', true)).toBe('Duty Free')
      expect(getLabel('hasHealthServices', true)).toBe('Health Services')
      expect(getLabel('hasHotels', true)).toBe('Hotels')
      expect(getLabel('hasLounges', true)).toBe('Lounges')
      expect(getLabel('hasMetro', true)).toBe('Metro')
      expect(getLabel('hasPrayerRoom', true)).toBe('Place of Worship')
      expect(getLabel('hasRestaurants', true)).toBe('Restaurants')
      expect(getLabel('is24Hour', true)).toBe('Open 24 Hours')
    })

    it('should return correct labels for "true" string values', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('freeWifi', 'true')).toBe('Free WiFi')
      expect(getLabel('hasCarRental', 'true')).toBe('Car Rental')
    })

    it('should return undefined for false boolean values', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('freeWifi', false)).toBeUndefined()
      expect(getLabel('hasCarRental', 'false')).toBeUndefined()
    })
  })

  describe('filter label map options', () => {
    it('should return correct labels for continent filter', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('continent', 'europe')).toBe('Europe')
      expect(getLabel('continent', 'asia')).toBe('Asia')
      expect(getLabel('continent', 'america')).toBe('America')
    })

    it('should return correct labels for country filter', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('country', 'turkey')).toBe('Turkey')
      expect(getLabel('country', 'france')).toBe('France')
      expect(getLabel('country', 'germany')).toBe('Germany')
    })

    it('should return correct labels for airportType filter', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('airportType', 'international')).toBe('International')
      expect(getLabel('airportType', 'domestic')).toBe('Domestic')
    })

    it('should handle case-insensitive string matching', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('continent', 'EUROPE')).toBe('Europe')
      expect(getLabel('continent', 'Europe')).toBe('Europe')
      expect(getLabel('country', 'TURKEY')).toBe('Turkey')
    })
  })

  describe('edge cases', () => {
    it('should return undefined for unknown keys', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('unknownKey', 'someValue')).toBeUndefined()
    })

    it('should return undefined for unknown values in existing keys', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('continent', 'unknownContinent')).toBeUndefined()
      expect(getLabel('country', 'unknownCountry')).toBeUndefined()
    })

    it('should handle empty values', () => {
      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('continent', '')).toBeUndefined()
      expect(getLabel('continent', null)).toBeUndefined()
      expect(getLabel('continent', undefined)).toBeUndefined()
    })

    it('should handle numeric values correctly', () => {
      mockedGetFilterLabelMap.mockReturnValue({
        ...mockedGetFilterLabelMap(),
        numericFilter: [
          { value: 1, label: 'Option 1' },
          { value: 2, label: 'Option 2' },
        ],
      })

      const { result } = renderHook(() => getActiveFilterLabel())
      const getLabel = result.current

      expect(getLabel('numericFilter', 1)).toBe('Option 1')
      expect(getLabel('numericFilter', 2)).toBe('Option 2')
    })
  })

  describe('memoization', () => {
    it('should return the same function reference on re-renders', () => {
      const { result, rerender } = renderHook(() => getActiveFilterLabel())
      const firstFunction = result.current

      rerender({})

      const secondFunction = result.current

      expect(firstFunction).toBe(secondFunction)
    })
  })

  describe('mock verification', () => {
    it('should call getFilterLabelMap once during hook initialization', () => {
      renderHook(() => getActiveFilterLabel())

      expect(mockedGetFilterLabelMap).toHaveBeenCalledTimes(1)
    })

    it('should call getLocale for each boolean label key', () => {
      renderHook(() => getActiveFilterLabel())

      const expectedCalls = [
        'freeWifi',
        'carRental',
        'childrensPlayground',
        'dutyFree',
        'healthServices',
        'hotels',
        'lounges',
        'metro',
        'placeOfWorship',
        'restaurants',
        'open24Hours',
      ]

      expect(mockedGetLocale).toHaveBeenCalledTimes(expectedCalls.length)
      expectedCalls.forEach(key => {
        expect(mockedGetLocale).toHaveBeenCalledWith(key)
      })
    })
  })
})
