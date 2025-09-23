import { act, renderHook, waitFor } from '@testing-library/react-native'

import { useAirline, useAirlineById } from '@/hooks/services/useAirline'
import * as airlineService from '@/services/airlineService'
import useLocaleStore from '@/store/locale'
import type { AirlineType } from '@/types/feature/airline'
import { debounce } from '@/utils/common/debounce'
import { parseFilterRange } from '@/utils/feature/parseFilterRange'

const { useQuery } = require('@tanstack/react-query')

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/utils/common/debounce')

const mockedDebounce = debounce as jest.MockedFunction<typeof debounce>

jest.mock('@/utils/feature/parseFilterRange')

const mockedParseFilterRange = parseFilterRange as jest.MockedFunction<typeof parseFilterRange>

const mockedAirlines: AirlineType[] = [
  {
    id: '1',
    name: 'Aegean Airlines',
    iataCode: 'A3',
    icaoCode: 'AEE',
    logo: 'https://res.cloudinary.com/dzkssh0tp/image/upload/c_auto,w_800,q_auto,f_auto/v1758452053/A3_g7olhn.png',
    companyInfo: {
      foundingYear: '1999',
      parentCompany: 'Aegean Airlines S.A.',
      employeeCount: 2500,
      passengerCapacity: 15,
      website: 'www.aegeanair.com',
      contactInfo: {
        phone: '+30-210-626-1000',
        email: 'contact@aegeanair.com',
      },
      socialMedia: {
        x: 'https://x.com/aegeanairlines',
        linkedin: 'https://www.linkedin.com/company/aegean-airlines',
        instagram: 'https://www.instagram.com/aegeanairlines',
        tiktok: 'https://www.tiktok.com/@aegeanairlines',
      },
    },
    operations: {
      businessModel: 'passenger',
      businessType: 'major_international',
      region: 'EU',
      country: 'Greece',
      hub: {
        name: 'Athens International Airport',
        city: 'Athens',
        address: 'Spata, Athens, Greece',
        coordinates: {
          latitude: 37.9364,
          longitude: 23.9472,
        },
      },
      slogan: "Thanks to you, we're flying higher",
      alliance: 'Star Alliance',
      skytraxRating: 4.8,
    },
    fleet: {
      totalAirplane: 61,
      averageAgeYears: 10.2,
      airplanes: [
        {
          type: 'Airbus A320-200',
          count: 34,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 6100,
          capacitySeats: 174,
        },
        {
          type: 'Airbus A321neo',
          count: 17,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 7400,
          capacitySeats: 220,
        },
        {
          type: 'Airbus A320neo',
          count: 10,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 6500,
          capacitySeats: 180,
        },
      ],
      airplaneTypeCount: 3,
    },
    network: {
      destinations: ['Athens', 'Thessaloniki', 'London', 'Paris'],
      routes: [
        {
          origin: 'ATH',
          destinationIata: 'LHR',
        },
        {
          origin: 'ATH',
          destinationIata: 'CDG',
        },
      ],
      destinationCount: 150,
      destinationCountries: 40,
      domesticConnections: 30,
      internationalConnections: 120,
    },
    safety: {
      safetyRecord: 'No fatal accidents. Passenger-focused, no EU ban.',
      certifications: ['EASA AOC', 'IATA IOSA'],
    },
    environmental:
      'Operates modern fuel-efficient airplane, supports sustainable aviation fuel initiatives.',
    isoCountry: 'GR',
    isoRegion: 'GR-I',
  },
  {
    id: '2',
    name: 'Aer Lingus',
    iataCode: 'EI',
    icaoCode: 'EIN',
    logo: 'https://res.cloudinary.com/dzkssh0tp/image/upload/c_auto,w_800,q_auto,f_auto/v1758452209/EI_jdkisg.png',
    companyInfo: {
      foundingYear: '1936',
      parentCompany: 'International Airlines Group (IAG)',
      employeeCount: 4000,
      passengerCapacity: 12,
      website: 'www.aerlingus.com',
      contactInfo: {
        phone: '+353-1-886-8505',
        email: 'customerservice@aerlingus.com',
      },
      socialMedia: {
        x: 'https://x.com/aerlingus',
        linkedin: 'https://www.linkedin.com/company/aer-lingus',
        instagram: 'https://www.instagram.com/aerlingus',
        tiktok: 'https://www.tiktok.com/@aerlingus',
      },
    },
    operations: {
      businessModel: 'passenger',
      businessType: 'major_international',
      region: 'EU',
      country: 'Ireland',
      hub: {
        name: 'Dublin Airport',
        city: 'Dublin',
        address: 'Dublin, Ireland',
        coordinates: {
          latitude: 53.4213,
          longitude: -6.2701,
        },
      },
      slogan: 'Smart flies Aer Lingus',
      alliance: 'Oneworld',
      skytraxRating: 4.7,
    },
    fleet: {
      totalAirplane: 54,
      averageAgeYears: 12.8,
      airplanes: [
        {
          type: 'Airbus A320-200',
          count: 30,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 6100,
          capacitySeats: 174,
        },
        {
          type: 'Airbus A330-300',
          count: 12,
          bodyType: 'wide_body',
          speedKmh: 905,
          rangeKm: 11700,
          capacitySeats: 317,
        },
        {
          type: 'Airbus A321neo',
          count: 12,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 7400,
          capacitySeats: 212,
        },
      ],
      airplaneTypeCount: 3,
    },
    network: {
      destinations: ['Dublin', 'Shannon', 'New York', 'London'],
      routes: [
        {
          origin: 'DUB',
          destinationIata: 'JFK',
        },
        {
          origin: 'DUB',
          destinationIata: 'ORD',
        },
      ],
      destinationCount: 105,
      destinationCountries: 30,
      domesticConnections: 15,
      internationalConnections: 90,
    },
    safety: {
      safetyRecord: 'No fatal accidents since 1968. Passenger-focused, no EU ban.',
      certifications: ['EASA AOC', 'IATA IOSA'],
    },
    environmental: 'Invests in fuel-efficient airplane, participates in carbon reduction programs.',
    isoCountry: 'IE',
    isoRegion: 'IE-D',
  },
]

const generateMockAirlines = (count: number): any =>
  Array.from({ length: count }, (_, i) => ({
    ...mockedAirlines[0],
    id: `${i + 3}`,
    name: `Airline ${i + 1}`,
  }))

jest.spyOn(airlineService, 'getAllAirlines').mockResolvedValue(mockedAirlines)

jest
  .spyOn(airlineService, 'getAirlineById')
  .mockImplementation(
    async (id: string): Promise<AirlineType | null> =>
      mockedAirlines.find((a: AirlineType) => a.id === id) || null,
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
    data: mockedAirlines,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true,
  })
})

describe('useAirline hook', () => {
  it('applies range filter for passenger capacity', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ passengerCapacity: '10-20' })
    })
    expect(result.current.filteredCount).toBe(2)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('should filter out airlines with invalid range', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ passengerCapacity: '100-200' })
    })
    expect(result.current.filteredCount).toBe(0)
    expect(result.current.paginatedAirlines).toEqual([])
  })

  it('applies employee count range filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ employeeCount: '3000-5000' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aer Lingus')
  })

  it('applies founding year range filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ foundingYear: '1990-2000' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('applies total airplane count range filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ totalAirplane: '50-65' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('applies average age filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ averageAgeYears: '10-11' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('applies destination count range filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ destinationCount: '100-120' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aer Lingus')
  })

  it('applies skytrax rating range filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ skytraxRating: '4.7-5.0' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('applies business type filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ businessType: 'major_international' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('applies business model filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ businessModel: 'passenger' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('applies alliance filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ alliance: 'Star Alliance' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('combines search and filters', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('airlines')
      result.current.setFilters({ region: 'EU' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('basic filtering works individually', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ region: 'EU' })
    })
    expect(result.current.filteredCount).toBe(2)
    expect(result.current.paginatedAirlines.map(a => a.name).sort()).toEqual([
      'Aegean Airlines',
      'Aer Lingus',
    ])
  })

  it('basic search works individually', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('airlines')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines.map(a => a.name).sort()).toEqual(['Aegean Airlines'])
  })

  it('search by IATA code works', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('A3')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('search by ICAO code works', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('EIN')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aer Lingus')
  })

  it('search by city works', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('Dublin')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aer Lingus')
  })

  it('search by country works', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('Ireland')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aer Lingus')
  })

  it('combines multiple filters', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({
        region: 'EU',
        passengerCapacity: '10-16',
        alliance: 'Star Alliance',
      })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('no results when filters do not match', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({
        region: 'EU',
        alliance: 'SkyTeam',
      })
    })
    expect(result.current.filteredCount).toBe(0)
    expect(result.current.paginatedAirlines).toEqual([])
  })

  it('search with no results', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('NonExistentAirline')
    })
    expect(result.current.filteredCount).toBe(0)
    expect(result.current.paginatedAirlines).toEqual([])
  })

  it('check if mocks are working', async () => {
    const { result } = renderHook(() => useAirline())
    expect(result.current.filteredCount).toBe(2)
  })

  it('applies minimum skytrax rating filter', async () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ minSkytraxRating: 4.8 })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('filters out airlines with missing data for a range filter', async () => {
    const airlineWithMissingData: any = {
      ...mockedAirlines[0],
      id: '3',
      name: 'Incomplete Airline',
      companyInfo: {
        ...mockedAirlines?.[0]?.companyInfo,
        passengerCapacity: undefined,
      },
    }

    useQuery.mockReturnValue({
      data: [...mockedAirlines, airlineWithMissingData],
      isSuccess: true,
    })

    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ passengerCapacity: '10-20' })
    })
    expect(result.current.filteredCount).toBe(2)
    expect(
      result.current.paginatedAirlines.find(a => a.name === 'Incomplete Airline'),
    ).toBeUndefined()
  })

  it('handles invalid range format gracefully by not filtering', () => {
    mockedParseFilterRange.mockReturnValue(null)
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ passengerCapacity: 'invalid-range' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('handles pagination and loadMore correctly', async () => {
    const largeAirlineList = generateMockAirlines(25)
    useQuery.mockReturnValue({ data: largeAirlineList, isLoading: false, isSuccess: true })
    const { result } = renderHook(() => useAirline())
    expect(result.current.paginatedAirlines.length).toBe(20)
    expect(result.current.hasMore).toBe(true)
    act(() => {
      result.current.loadMore()
    })
    expect(result.current.paginatedAirlines.length).toBe(25)
    expect(result.current.hasMore).toBe(false)
  })

  it('does not load more when isLoading is true', async () => {
    const largeAirlineList = generateMockAirlines(25)
    useQuery.mockReturnValue({ data: largeAirlineList, isLoading: true, isSuccess: false })
    const { result } = renderHook(() => useAirline())
    expect(result.current.paginatedAirlines.length).toBe(20)
    act(() => {
      result.current.loadMore()
    })
    expect(result.current.paginatedAirlines.length).toBe(20)
  })

  it('does not load more when hasMore is false', async () => {
    const { result } = renderHook(() => useAirline())
    expect(result.current.paginatedAirlines.length).toBe(2)
    expect(result.current.hasMore).toBe(false)
    act(() => {
      result.current.loadMore()
    })
    expect(result.current.paginatedAirlines.length).toBe(2)
  })

  it('handles null/undefined data gracefully in applyFilters', () => {
    useQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useAirline())
    expect(result.current.filteredCount).toBe(0)
    expect(result.current.paginatedAirlines).toEqual([])
  })

  it('filters out null/undefined airlines from array', () => {
    const dataWithNulls = [mockedAirlines[0], null, mockedAirlines[1], undefined]
    useQuery.mockReturnValue({
      data: dataWithNulls,
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useAirline())
    expect(result.current.filteredCount).toBe(2)
    expect(
      result.current.paginatedAirlines.every(airline => airline !== null && airline !== undefined),
    ).toBe(true)
  })

  it('handles missing skytrax rating when minimum is set', () => {
    const airlineWithoutRating: any = {
      ...mockedAirlines[0],
      id: '3',
      name: 'Airline Without Rating',
      operations: {
        ...mockedAirlines?.[0]?.operations,
        skytraxRating: undefined,
      },
    }

    useQuery.mockReturnValue({
      data: [...mockedAirlines, airlineWithoutRating],
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ minSkytraxRating: 4.0 })
    })

    expect(result.current.filteredCount).toBe(3)

    act(() => {
      result.current.setFilters({ minSkytraxRating: 4.8 })
    })

    expect(result.current.filteredCount).toBe(2)
  })

  it('handles airlines with null values in filter fields', () => {
    const airlineWithNullValues: any = {
      ...mockedAirlines[0],
      id: '3',
      name: 'Airline With Nulls',
      companyInfo: {
        ...mockedAirlines?.[0]?.companyInfo,
        employeeCount: null,
      },
      fleet: {
        ...mockedAirlines?.[0]?.fleet,
        totalAirplane: null,
      },
    }

    useQuery.mockReturnValue({
      data: [...mockedAirlines, airlineWithNullValues],
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ employeeCount: '1000-5000' })
    })

    expect(result.current.filteredCount).toBe(2)
    expect(
      result.current.paginatedAirlines.find(a => a.name === 'Airline With Nulls'),
    ).toBeUndefined()
  })

  it('handles NaN values in numeric fields', () => {
    const airlineWithNaN: any = {
      ...mockedAirlines[0],
      id: '3',
      name: 'Airline With NaN',
      companyInfo: {
        ...mockedAirlines?.[0]?.companyInfo,
        employeeCount: 'not-a-number',
      },
    }

    useQuery.mockReturnValue({
      data: [...mockedAirlines, airlineWithNaN],
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ employeeCount: '1000-5000' })
    })

    expect(result.current.filteredCount).toBe(2)
    expect(
      result.current.paginatedAirlines.find(a => a.name === 'Airline With NaN'),
    ).toBeUndefined()
  })

  it('tests all range filter paths - destinationCountries', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ destinationCountries: '35-45' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('tests all range filter paths - domesticConnections', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ domesticConnections: '25-35' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('tests all range filter paths - internationalConnections', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ internationalConnections: '110-130' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('tests all range filter paths - airplaneTypeCount', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ airplaneTypeCount: '2-4' })
    })
    expect(result.current.filteredCount).toBe(2)
  })

  it('handles empty search term correctly', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('')
    })
    expect(result.current.filteredCount).toBe(2)
    expect(result.current.paginatedAirlines.length).toBe(2)
  })

  it('handles search term with only whitespace', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('   ')
    })
    expect(result.current.filteredCount).toBe(2)
    expect(result.current.paginatedAirlines.length).toBe(2)
  })

  it('handles search when airline fields are undefined/null', () => {
    const airlineWithMissingFields: any = {
      ...mockedAirlines[0],
      id: '3',
      name: undefined,
      iataCode: null,
      icaoCode: undefined,
      operations: {
        ...mockedAirlines?.[0]?.operations,
        country: null,
        hub: {
          ...mockedAirlines?.[0]?.operations.hub,
          city: undefined,
        },
      },
    }

    useQuery.mockReturnValue({
      data: [...mockedAirlines, airlineWithMissingFields],
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('test')
    })

    expect(result.current.filteredCount).toBe(0)
  })

  it('search loading state changes correctly', async () => {
    jest.useFakeTimers()

    const { result } = renderHook(() => useAirline())

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

  it('page resets when search term changes', () => {
    const largeAirlineList = generateMockAirlines(25)
    useQuery.mockReturnValue({
      data: largeAirlineList,
      isLoading: false,
      isSuccess: true,
    })

    const { result } = renderHook(() => useAirline())

    act(() => {
      result.current.loadMore()
    })

    expect(result.current.paginatedAirlines.length).toBe(25)

    mockedDebounce.mockImplementation(value => value)

    act(() => {
      result.current.setSearchTerm('Airline 1')
    })

    expect(result.current.filteredCount).toBe(11)
    expect(result.current.paginatedAirlines.length).toBe(11)
  })

  it('page resets when filters change', () => {
    const largeAirlineList = generateMockAirlines(25)
    useQuery.mockReturnValue({
      data: largeAirlineList,
      isLoading: false,
      isSuccess: true,
    })

    const { result } = renderHook(() => useAirline())

    act(() => {
      result.current.loadMore()
    })

    expect(result.current.paginatedAirlines.length).toBe(25)

    act(() => {
      result.current.setFilters({ region: 'US' })
    })

    expect(result.current.filteredCount).toBe(0)
    expect(result.current.paginatedAirlines.length).toBe(0)
  })

  it('handles exact IATA code match with case insensitivity', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('a3')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('handles exact ICAO code match with case insensitivity', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('ein')
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aer Lingus')
  })

  it('prioritizes exact matches over partial matches', () => {
    const airlineWithA3InName: any = {
      ...mockedAirlines[1],
      id: '3',
      name: 'A3 Airways',
      iataCode: 'XX',
      icaoCode: 'XXX',
    }

    useQuery.mockReturnValue({
      data: [...mockedAirlines, airlineWithA3InName],
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('A3')
    })

    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
    expect(result.current.paginatedAirlines[0]?.iataCode).toBe('A3')
  })

  it('falls back to partial matching when no exact matches found', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('Aer')
    })

    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aer Lingus')
  })

  it('returns error from useQuery', () => {
    const mockError = new Error('Network error')
    useQuery.mockReturnValue({
      data: null,
      error: mockError,
      isLoading: false,
      isError: true,
    })

    const { result } = renderHook(() => useAirline())
    expect(result.current.error).toBe(mockError)
  })

  it('returns loading state from useQuery', () => {
    useQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isError: false,
    })

    const { result } = renderHook(() => useAirline())
    expect(result.current.isLoading).toBe(true)
  })

  it('handles range filter with value at exact boundary', () => {
    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setFilters({ passengerCapacity: '15-15' })
    })
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.paginatedAirlines[0]?.name).toBe('Aegean Airlines')
  })

  it('handles multiple exact code matches correctly', () => {
    const duplicateIata: any = {
      ...mockedAirlines[1],
      id: '3',
      name: 'Another A3 Airline',
      iataCode: 'A3',
      icaoCode: 'AAA',
    }

    useQuery.mockReturnValue({
      data: [...mockedAirlines, duplicateIata],
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useAirline())
    act(() => {
      result.current.setSearchTerm('A3')
    })

    expect(result.current.filteredCount).toBe(2)
  })
})

describe('useAirlineById hook', () => {
  it('fetches airline by id', async () => {
    const aegeanAirlines = mockedAirlines[0]
    useQuery.mockReturnValue({
      data: aegeanAirlines,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirlineById('1'))
    expect(result.current.data?.name).toBe('Aegean Airlines')
    expect(result.current.data?.id).toBe('1')
    expect(result.current.isSuccess).toBe(true)
  })

  it('fetches second airline by id', async () => {
    const aerLingus = mockedAirlines[1]
    useQuery.mockReturnValue({
      data: aerLingus,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    })
    const { result } = renderHook(() => useAirlineById('2'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.name).toBe('Aer Lingus')
    expect(result.current.data?.id).toBe('2')
    expect(result.current.isSuccess).toBe(true)
  })

  it('disables the query when id is not provided', () => {
    renderHook(() => useAirlineById(''))
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
  })

  it('handles null id correctly', () => {
    renderHook(() => useAirlineById(null as any))
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
  })

  it('handles undefined id correctly', () => {
    renderHook(() => useAirlineById(undefined as any))
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
  })

  it('passes correct parameters to useQuery', () => {
    const testId = 'test-id'
    const testLocale = 'fr'

    mockedUseLocaleStore.mockReturnValue({ selectedLocale: testLocale })

    renderHook(() => useAirlineById(testId))

    expect(useQuery).toHaveBeenCalledWith({
      enabled: true,
      queryFn: expect.any(Function),
      queryKey: ['airline', testId, testLocale],
      staleTime: 5 * 60 * 1000,
    })
  })

  it('returns error state correctly', () => {
    const mockError = new Error('Fetch error')
    useQuery.mockReturnValue({
      data: null,
      error: mockError,
      isLoading: false,
      isError: true,
      isSuccess: false,
    })

    const { result } = renderHook(() => useAirlineById('1'))
    expect(result.current.error).toBe(mockError)
    expect(result.current.isError).toBe(true)
  })

  it('returns loading state correctly', () => {
    useQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
    })

    const { result } = renderHook(() => useAirlineById('1'))
    expect(result.current.isLoading).toBe(true)
  })

  it('updates when locale changes', () => {
    const { rerender } = renderHook(() => useAirlineById('1'))

    mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'fr' })

    rerender({})

    expect(useQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryKey: ['airline', '1', 'fr'],
      }),
    )
  })

  it('calls airlineService.getAirlineById with correct parameters', async () => {
    const getAirlineByIdSpy = jest.spyOn(airlineService, 'getAirlineById')
    getAirlineByIdSpy.mockResolvedValue(mockedAirlines?.[0] as any)

    let capturedQueryFn: any
    useQuery.mockImplementation((options: any) => {
      capturedQueryFn = options.queryFn
      return {
        data: mockedAirlines[0],
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      }
    })

    renderHook(() => useAirlineById('1'))

    if (capturedQueryFn) {
      await capturedQueryFn()
      expect(getAirlineByIdSpy).toHaveBeenCalledWith('1', 'en')
    }

    getAirlineByIdSpy.mockRestore()
  })
})
