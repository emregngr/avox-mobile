import { act, renderHook, waitFor } from '@testing-library/react-native'

import { useAirport, useAirportById } from '@/hooks/services/useAirport'
import * as airportService from '@/services/airportService'
import useLocaleStore from '@/store/locale'
import type { AirportType } from '@/types/feature/airport'
import { debounce } from '@/utils/common/debounce'
import { parseFilterRange } from '@/utils/feature/parseFilterRange'

const { useQuery } = require('@tanstack/react-query')

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/utils/common/debounce')

const mockedDebounce = debounce as jest.MockedFunction<typeof debounce>

jest.mock('@/utils/feature/parseFilterRange')

const mockedParseFilterRange = parseFilterRange as jest.MockedFunction<typeof parseFilterRange>

const mockedAirports: AirportType[] = [
  {
    id: '1',
    icaoCode: 'AGGH',
    iataCode: 'HIR',
    isoCountry: 'SB',
    isoRegion: 'SB-GU',
    name: 'Honiara International Airport',
    image:
      'https://res.cloudinary.com/dzkssh0tp/image/upload/c_auto,w_800,q_auto,f_auto/v1758392988/HIR_mnss2t.jpg',
    airportInfo: {
      foundingYear: '1942',
      employeeCount: 250,
      website: 'www.honiara-international-airport.com',
      contactInfo: {
        phone: '+677-123-4567',
        email: 'info@honiara-international-airport.com',
      },
      socialMedia: {
        x: 'https://x.com/honiaraairport',
        linkedin: 'https://www.linkedin.com/company/honiara-international-airport',
        instagram: '',
        tiktok: '',
      },
    },
    operations: {
      airportType: 'small_airport',
      region: 'OC',
      country: 'Solomon Islands',
      location: {
        city: 'Honiara',
        address: 'Honiara, Solomon Islands',
        coordinates: {
          latitude: -9.428,
          longitude: 160.054993,
        },
        elevationFt: 28,
      },
      scheduledService: true,
      is24Hour: true,
    },
    infrastructure: {
      passengerCapacity: 0.5,
      baggageCapacity: 80,
      terminalAreaHectares: 0.5,
      airportAreaHectares: 280,
      runways: {
        lengthM: 2200,
        surface: 'Asphalt',
        pcn: '25/F/B/X/T',
        ilsCategory: 'CAT I',
      },
      apronCount: 3,
      towerHeightM: 20,
      fireCategory: 'Cat 5',
      terminalCount: 1,
      runwayCount: 1,
    },
    facilities: {
      services: [
        'check-in counters',
        'small duty-free shop',
        'basic dining options',
        'lost and found',
      ],
      loungeCount: 1,
      securityQueueTime: 5,
      checkinTimeAvg: 20,
      freeWifi: false,
      googleMapsRating: 3.8,
      parkingCapacityVehicles: 200,
      hasMetro: false,
    },
    flightOperations: {
      destinationCount: 4,
      destinationCountries: 4,
      routes: [
        {
          destinationIata: 'HND',
          frequency: '2x daily',
        },
        {
          destinationIata: 'CTS',
          frequency: 'daily',
        },
        {
          destinationIata: 'ITM',
          frequency: '3x weekly',
        },
      ],
      airlines: ['All Nippon Airways', 'Japan Airlines', 'Jetstar Japan'],
      domesticConnections: 1,
      internationalConnections: 3,
    },
    cargo: {
      annualCargoTonnes: 25000,
      terminalCapacityTonnes: 300,
      coldStorage: true,
      dangerousGoods: true,
    },
    nearbyAttractions: [],
    safety: {
      certifications: ['ICAO Annex 17'],
    },
  },
  {
    id: '2',
    icaoCode: 'AYPY',
    iataCode: 'POM',
    isoCountry: 'PG',
    isoRegion: 'PG-NCD',
    name: 'Port Moresby Jacksons International Airport',
    image:
      'https://res.cloudinary.com/dzkssh0tp/image/upload/c_auto,w_800,q_auto,f_auto/v1758392946/POM_qxhcdg.jpg',
    airportInfo: {
      foundingYear: '1943',
      employeeCount: 600,
      website: 'www.port-moresby-jacksons-airport.com',
      contactInfo: {
        phone: '+675-987-6543',
        email: 'info@port-moresby-jacksons-airport.com',
      },
      socialMedia: {
        x: 'https://x.com/jacksonsairport',
        linkedin: 'https://www.linkedin.com/company/port-moresby-jacksons-airport',
        instagram: 'https://www.instagram.com/jacksonsairport',
        tiktok: '',
      },
    },
    operations: {
      airportType: 'small_airport',
      region: 'OC',
      country: 'Papua New Guinea',
      location: {
        city: 'Port Moresby',
        address: 'Port Moresby, Papua New Guinea',
        coordinates: {
          latitude: -9.44338035583496,
          longitude: 147.22000122070312,
        },
        elevationFt: 146,
      },
      scheduledService: true,
      is24Hour: true,
    },
    infrastructure: {
      passengerCapacity: 1.5,
      baggageCapacity: 300,
      terminalAreaHectares: 1.5,
      airportAreaHectares: 300,
      runways: {
        lengthM: 2750,
        surface: 'Asphalt',
        pcn: '45/F/A/X/T',
        ilsCategory: 'CAT I',
      },
      apronCount: 4,
      towerHeightM: 25,
      fireCategory: 'Cat 7',
      terminalCount: 2,
      runwayCount: 2,
    },
    facilities: {
      services: ['duty-free shops', 'restaurants', 'lounge', 'car rental', 'currency exchange'],
      loungeCount: 2,
      securityQueueTime: 10,
      checkinTimeAvg: 15,
      freeWifi: true,
      googleMapsRating: 3.9,
      parkingCapacityVehicles: 500,
      hasMetro: false,
    },
    flightOperations: {
      destinationCount: 4,
      destinationCountries: 4,
      routes: [
        {
          destinationIata: 'SYD',
          frequency: 'daily',
        },
        {
          destinationIata: 'BNE',
          frequency: '3x weekly',
        },
      ],
      airlines: ['Air Niugini', 'Qantas'],
      domesticConnections: 1,
      internationalConnections: 3,
    },
    cargo: {
      annualCargoTonnes: 30000,
      terminalCapacityTonnes: 250,
      coldStorage: false,
      dangerousGoods: true,
    },
    nearbyAttractions: [],
    safety: {
      certifications: ['ICAO Annex 17'],
    },
  },
]

const generateMockAirports = (count: number): any =>
  Array.from({ length: count }, (_, i) => ({
    ...mockedAirports[0],
    id: `${i + 3}`,
    name: `Airport ${i + 1}`,
  }))

jest.spyOn(airportService, 'getAllAirports').mockResolvedValue(mockedAirports)

jest
  .spyOn(airportService, 'getAirportById')
  .mockImplementation(
    async (id: string): Promise<AirportType | null> =>
      mockedAirports.find((a: AirportType) => a.id === id) || null,
  )

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedDebounce.mockImplementation(value => value)

  mockedParseFilterRange.mockImplementation((value: any) => {
    if (!value?.includes('-')) return null
    const [min, max] = value.split('-').map(Number)
    return { min, max }
  })

  useQuery.mockReturnValue({
    data: mockedAirports,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true,
  })
})

describe('useAirport hook', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it('applies range filter for passenger capacity', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ passengerCapacity: '1-2' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('should filter out airports with invalid range', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ passengerCapacity: '100-200' })
    })
    expect(result.current.filteredCount).toBe(0)
    expect(result.current.paginatedAirports).toEqual([])
  })

  it('applies boolean filters correctly - freeWifi true', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ freeWifi: true })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('applies boolean filters correctly - freeWifi false', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ freeWifi: false })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe('Honiara International Airport')
  })

  it('applies service filters correctly - car rental', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasCarRental: true })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('applies service filters correctly - duty free', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasDutyFree: true })
    })
    expect(result.current.filteredCount).toBe(1)
  })

  it('combines search and filters', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('Honiara')
      result.current.setFilters({ region: 'OC' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe('Honiara International Airport')
  })

  it('basic filtering works individually - region', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ region: 'OC' })
    })
    expect(result.current.filteredCount).toBe(2)
    expect(result.current.paginatedAirports.map(a => a.name).sort()).toEqual([
      'Honiara International Airport',
      'Port Moresby Jacksons International Airport',
    ])
  })

  it('basic filtering works individually - airport type', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ airportType: 'small_airport' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('basic search works individually', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('Port Moresby')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('search by IATA code works', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('HIR')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe('Honiara International Airport')
  })

  it('search by ICAO code works', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('AYPY')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('applies minimum Google rating filter', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ minGoogleRating: 3.85 })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('applies founding year range filter', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ foundingYear: '1940-1945' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('applies employee count range filter', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ employeeCount: '500-700' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('applies terminal count filter', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ terminalCount: '2-5' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('applies runway length range filter', async () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ mainRunwayLengthM: '2500-3000' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('check if mocks are working', async () => {
    const { result } = renderHook(() => useAirport())
    expect(result.current.filteredCount).toBe(2)
  })

  it('handles pagination and loadMore correctly', async () => {
    const largeAirportList = generateMockAirports(25)
    useQuery.mockReturnValue({ data: largeAirportList, isLoading: false, isSuccess: true })
    const { result } = renderHook(() => useAirport())
    expect(result.current.paginatedAirports.length).toBe(20)
    expect(result.current.hasMore).toBe(true)
    act(() => {
      result.current.loadMore()
    })
    expect(result.current.paginatedAirports.length).toBe(25)
    expect(result.current.hasMore).toBe(false)
  })

  it('does not load more when isLoading is true', async () => {
    const largeAirportList = generateMockAirports(25)
    useQuery.mockReturnValue({ data: largeAirportList, isLoading: true, isSuccess: false })
    const { result } = renderHook(() => useAirport())
    expect(result.current.paginatedAirports.length).toBe(20)
    act(() => {
      result.current.loadMore()
    })
    expect(result.current.paginatedAirports.length).toBe(20)
  })

  it('does not load more when hasMore is false', async () => {
    const { result } = renderHook(() => useAirport())
    expect(result.current.paginatedAirports.length).toBe(2)
    expect(result.current.hasMore).toBe(false)
    act(() => {
      result.current.loadMore()
    })
    expect(result.current.paginatedAirports.length).toBe(2)
  })

  it('handles invalid range format gracefully by not filtering', () => {
    mockedParseFilterRange.mockReturnValue(null)
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ passengerCapacity: 'invalid-range' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('filters out airports with missing data for a range filter', async () => {
    const airportWithMissingData: any = {
      ...mockedAirports[0],
      id: '3',
      name: 'Incomplete Airport',
      infrastructure: {
        ...mockedAirports?.[0]?.infrastructure,
        passengerCapacity: undefined,
      },
    }
    useQuery.mockReturnValue({
      data: [...mockedAirports, airportWithMissingData],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ passengerCapacity: '1-2' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(
      result.current.paginatedAirports.find(a => a.name === 'Incomplete Airport'),
    ).toBeUndefined()
  })

  it('handles error state from useQuery', () => {
    const mockError = new Error('Failed to fetch')
    useQuery.mockReturnValue({
      data: null,
      error: mockError,
      isLoading: false,
      isError: true,
      isSuccess: false,
    })

    const { result } = renderHook(() => useAirport())
    expect(result.current.error).toBe(mockError)
    expect(result.current.paginatedAirports).toEqual([])
  })

  it('handles empty or null data from useQuery gracefully', () => {
    useQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    expect(result.current.paginatedAirports).toEqual([])
    expect(result.current.filteredCount).toBe(0)
  })

  it('updates isSearchLoading state correctly with debounce', async () => {
    jest.useFakeTimers()

    const { result } = renderHook(() => useAirport())

    expect(result.current.isSearchLoading).toBe(false)

    mockedDebounce.mockImplementation(value => value)

    act(() => {
      result.current.setSearchTerm('test')
    })

    expect(result.current.isSearchLoading).toBe(false)

    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(result.current.isSearchLoading).toBe(false)
    })

    jest.useRealTimers()
  })

  it('applies a false boolean filter for services', () => {
    const airportWithoutCarRental: any = {
      ...mockedAirports[0],
      facilities: { ...mockedAirports?.[0]?.facilities, services: ['lounge'] },
    }
    useQuery.mockReturnValue({
      data: [airportWithoutCarRental, mockedAirports[1]],
      isSuccess: true,
    })

    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasCarRental: false })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('applies is24Hour false filter correctly', () => {
    const not24HourAirport: any = {
      ...mockedAirports[0],
      operations: { ...mockedAirports?.[0]?.operations, is24Hour: false },
    }
    useQuery.mockReturnValue({
      data: [not24HourAirport, mockedAirports[1]],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ is24Hour: false })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.operations.is24Hour).toBe(false)
  })

  it('filters out items where range value is null', () => {
    const airportWithNullData: any = {
      ...mockedAirports[0],
      id: '3',
      infrastructure: { ...mockedAirports?.[0]?.infrastructure, passengerCapacity: null },
    }
    useQuery.mockReturnValue({
      data: [airportWithNullData, mockedAirports[1]],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ passengerCapacity: '0-1' })
    })
    expect(result.current.filteredCount).toBe(0)
  })

  it('handles null airport in filter function', () => {
    const dataWithNull = [null, ...mockedAirports]
    useQuery.mockReturnValue({
      data: dataWithNull,
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    expect(result.current.filteredCount).toBe(2)
  })

  it('applies hasMetro true filter correctly', () => {
    const airportWithMetro: any = {
      ...mockedAirports[0],
      facilities: { ...mockedAirports[0]?.facilities, hasMetro: true },
    }
    useQuery.mockReturnValue({
      data: [airportWithMetro, mockedAirports[1]],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasMetro: true })
    })
    expect(result.current.filteredCount).toBe(1)
  })

  it('applies hasMetro false filter correctly', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasMetro: false })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('handles airports with missing or undefined services array', () => {
    const airportWithoutServices: any = {
      ...mockedAirports[0],
      facilities: { ...mockedAirports[0]?.facilities, services: undefined },
    }
    useQuery.mockReturnValue({
      data: [airportWithoutServices, mockedAirports[1]],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasCarRental: true })
    })
    expect(result.current.filteredCount).toBe(1)
  })

  it('tests all service filter keywords - hasChildrensPlayArea', () => {
    const airportWithChildrensArea: any = {
      ...mockedAirports[0],
      facilities: {
        ...mockedAirports[0]?.facilities,
        services: ["children's play area"],
      },
    }
    useQuery.mockReturnValue({
      data: [airportWithChildrensArea],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasChildrensPlayArea: true })
    })
    expect(result.current.filteredCount).toBe(1)
  })

  it('tests all service filter keywords - hasHealthServices', () => {
    const airportWithHealthServices: any = {
      ...mockedAirports[0],
      facilities: {
        ...mockedAirports[0]?.facilities,
        services: ['health services'],
      },
    }
    useQuery.mockReturnValue({
      data: [airportWithHealthServices],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasHealthServices: true })
    })
    expect(result.current.filteredCount).toBe(1)
  })

  it('tests all service filter keywords - hasHotels', () => {
    const airportWithHotels: any = {
      ...mockedAirports[0],
      facilities: {
        ...mockedAirports[0]?.facilities,
        services: ['hotels'],
      },
    }
    useQuery.mockReturnValue({
      data: [airportWithHotels],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasHotels: true })
    })
    expect(result.current.filteredCount).toBe(1)
  })

  it('tests all service filter keywords - hasLounges', () => {
    const airportWithLounges: any = {
      ...mockedAirports[0],
      facilities: {
        ...mockedAirports[0]?.facilities,
        services: ['lounges'],
      },
    }
    useQuery.mockReturnValue({
      data: [airportWithLounges],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasLounges: true })
    })
    expect(result.current.filteredCount).toBe(1)
  })

  it('tests all service filter keywords - hasPrayerRoom', () => {
    const airportWithPrayerRoom: any = {
      ...mockedAirports[0],
      facilities: {
        ...mockedAirports[0]?.facilities,
        services: ['prayer rooms'],
      },
    }
    useQuery.mockReturnValue({
      data: [airportWithPrayerRoom],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasPrayerRoom: true })
    })
    expect(result.current.filteredCount).toBe(1)
  })

  it('tests all service filter keywords - hasRestaurants', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ hasRestaurants: true })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('applies minGoogleRating filter when rating is missing', () => {
    const airportWithoutRating: any = {
      ...mockedAirports[0],
      facilities: { ...mockedAirports[0]?.facilities, googleMapsRating: undefined },
    }
    useQuery.mockReturnValue({
      data: [airportWithoutRating, mockedAirports[1]],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ minGoogleRating: 3.0 })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('tests all range filters - elevationFt', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ elevationFt: '100-200' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - baggageCapacity', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ baggageCapacity: '250-350' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - terminalAreaHectares', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ terminalAreaHectares: '1-2' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - airportAreaHectares', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ airportAreaHectares: '290-310' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - apronCount', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ apronCount: '4-5' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - runwayCount', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ runwayCount: '2-3' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - towerHeightM', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ towerHeightM: '20-30' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('tests all range filters - parkingCapacityVehicles', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ parkingCapacityVehicles: '400-600' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - loungeCount', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ loungeCount: '2-3' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - securityQueueTime', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ securityQueueTime: '8-12' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - checkinTimeAvg', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ checkinTimeAvg: '10-18' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('tests all range filters - destinationCount', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ destinationCount: '3-5' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('tests all range filters - destinationCountries', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ destinationCountries: '3-5' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('tests all range filters - domesticConnections', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ domesticConnections: '1-2' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('tests all range filters - internationalConnections', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ internationalConnections: '3-4' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('handles range filter with NaN value', () => {
    const airportWithNaNValue: any = {
      ...mockedAirports[0],
      infrastructure: { ...mockedAirports[0]?.infrastructure, passengerCapacity: 'invalid' },
    }
    useQuery.mockReturnValue({
      data: [airportWithNaNValue, mockedAirports[1]],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setFilters({ passengerCapacity: '0-2' })
    })
    expect(result.current.filteredCount).toBe(1)
  })

  it('tests search by city', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('honiara')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe('Honiara International Airport')
  })

  it('tests search by country', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('solomon')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe('Honiara International Airport')
  })

  it('tests search with exact IATA code match takes precedence', () => {
    const airportWithSimilarName: any = {
      ...mockedAirports[0],
      id: '3',
      name: 'HIR Airport Complex',
      iataCode: 'ABC',
    }
    useQuery.mockReturnValue({
      data: [...mockedAirports, airportWithSimilarName],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('HIR')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.iataCode).toBe('HIR')
  })

  it('tests search with exact ICAO code match takes precedence', () => {
    const airportWithSimilarName: any = {
      ...mockedAirports[0],
      id: '3',
      name: 'AGGH Airport Complex',
      icaoCode: 'WXYZ',
    }
    useQuery.mockReturnValue({
      data: [...mockedAirports, airportWithSimilarName],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('AGGH')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.icaoCode).toBe('AGGH')
  })

  it('handles search with missing location data', () => {
    const airportWithMissingLocation: any = {
      ...mockedAirports[0],
      operations: {
        ...mockedAirports[0]?.operations,
        location: { ...mockedAirports[0]?.operations?.location, city: undefined },
      },
    }
    useQuery.mockReturnValue({
      data: [airportWithMissingLocation, mockedAirports[1]],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('Port Moresby')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirports[0]?.name).toBe(
      'Port Moresby Jacksons International Airport',
    )
  })

  it('handles search with missing codes gracefully', () => {
    const airportWithMissingCodes: any = {
      ...mockedAirports[0],
      iataCode: undefined,
      icaoCode: undefined,
    }
    useQuery.mockReturnValue({
      data: [airportWithMissingCodes, mockedAirports[1]],
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('HIR')
    })
    expect(result.current.filteredCount).toBe(0)
  })

  it('resets page when filters change', () => {
    const largeAirportList = generateMockAirports(25)
    useQuery.mockReturnValue({ data: largeAirportList, isLoading: false, isSuccess: true })
    const { result } = renderHook(() => useAirport())

    act(() => {
      result.current.loadMore()
    })

    expect(result.current.paginatedAirports.length).toBe(25)

    act(() => {
      result.current.setFilters({ region: 'OC' })
    })

    expect(result.current.paginatedAirports.length).toBeLessThanOrEqual(20)
  })

  it('resets page when search term changes', () => {
    const largeAirportList = generateMockAirports(25)
    useQuery.mockReturnValue({ data: largeAirportList, isLoading: false, isSuccess: true })
    const { result } = renderHook(() => useAirport())

    act(() => {
      result.current.loadMore()
    })

    expect(result.current.paginatedAirports.length).toBe(25)

    act(() => {
      result.current.setSearchTerm('test')
    })

    expect(result.current.paginatedAirports.length).toBeLessThanOrEqual(20)
  })

  it('handles empty string search term', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('')
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('handles whitespace-only search term', () => {
    const { result } = renderHook(() => useAirport())
    act(() => {
      result.current.setSearchTerm('   ')
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('correctly handles isSearchLoading when searchTerm equals debouncedSearch', async () => {
    jest.useFakeTimers()

    mockedDebounce.mockImplementation(value => value)

    const { result } = renderHook(() => useAirport())

    act(() => {
      result.current.setSearchTerm('test')
    })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.isSearchLoading).toBe(false)
  })
})

describe('useAirportById hook', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('fetches first airport by id', async () => {
    const honiaraAirport = mockedAirports[0]

    useQuery.mockReturnValue({
      data: honiaraAirport,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    })

    const { result } = renderHook(() => useAirportById('1'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.name).toBe(honiaraAirport?.name)
    expect(result.current.data?.id).toBe('1')
    expect(result.current.isSuccess).toBe(true)
  })

  it('disables the query when id is not provided', () => {
    renderHook(() => useAirportById(''))
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
  })

  it('fetches second airport by id', async () => {
    const portMoresbyAirport = mockedAirports[1]

    useQuery.mockReturnValue({
      data: portMoresbyAirport,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    })

    const { result } = renderHook(() => useAirportById('2'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.name).toBe(portMoresbyAirport?.name)
    expect(result.current.data?.id).toBe('2')
    expect(result.current.isSuccess).toBe(true)
  })

  it('returns null when airport is not found', async () => {
    useQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    })

    const { result } = renderHook(() => useAirportById('999'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBe(null)
  })

  it('handles error state', async () => {
    const mockError = new Error('Network error')
    useQuery.mockReturnValue({
      data: null,
      error: mockError,
      isLoading: false,
      isError: true,
      isSuccess: false,
    })

    const { result } = renderHook(() => useAirportById('1'))

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBe(mockError)
  })

  it('handles loading state', async () => {
    useQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
    })

    const { result } = renderHook(() => useAirportById('1'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBe(null)
  })
})
