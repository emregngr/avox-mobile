import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { getAllAirports } from '@/services/airportService'
import useLocaleStore from '@/store/locale'
import type { Airport } from '@/types/feature/airport'
import { useDebounce } from '@/utils/common/useDebounce'
import { parseFilterRange } from '@/utils/feature/parseFilterRange'

const ITEMS_PER_PAGE = 20

export function useAirport() {
  const { selectedLocale } = useLocaleStore()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filters, setFilters] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false)
  const debouncedSearch = useDebounce<string>(searchTerm, 500)

  const {
    data: allAirportsData,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getAllAirports(selectedLocale),
    queryKey: ['allAirports', selectedLocale],
    staleTime: 5 * 60 * 1000,
  })

  const applyFilters = (airports: Airport[]): Airport[] => {
    if (!airports) return []

    return airports.filter(airport => {
      if (!airport) return false

      if (filters?.region) {
        const airportRegion = airport?.operations?.region?.toLowerCase()
        const filterRegion = filters?.region?.toLowerCase()

        if (airportRegion !== filterRegion) {
          return false
        }
      }

      if (filters?.airportType) {
        const airportType = airport?.operations?.airportType?.toLowerCase()
        const filterAirportType = filters?.airportType?.toLowerCase()

        if (airportType !== filterAirportType) {
          return false
        }
      }

      const airportServices = airport?.facilities?.services?.map(s => s?.toLowerCase()) || []

      const serviceKeywords: Record<string, string[]> = {
        hasCarRental: ['car rental'],
        hasChildrensPlayArea: ["children's play area"],
        hasDutyFree: ['duty-free shops'],
        hasHealthServices: ['health services'],
        hasHotels: ['hotels'],
        hasLounges: ['lounges'],
        hasPrayerRoom: ['prayer rooms'],
        hasRestaurants: ['restaurants'],
      }

      for (const serviceName in serviceKeywords) {
        if (filters?.[serviceName] === true) {
          const keywords = serviceKeywords?.[serviceName]

          const hasMatchingService = airportServices?.some(serviceString =>
            keywords?.some((keyword: string) => serviceString?.includes?.(keyword)),
          )

          if (!hasMatchingService) {
            return false
          }
        }
      }

      if (filters?.is24Hour === true && !airport?.operations?.is24Hour) return false
      if (filters?.is24Hour === false && airport?.operations?.is24Hour) return false

      if (filters?.hasMetro === true && !airport?.facilities?.hasMetro) return false
      if (filters?.hasMetro === false && airport?.facilities?.hasMetro) return false

      if (filters?.freeWifi === true && !airport?.facilities?.freeWifi) return false
      if (filters?.freeWifi === false && airport?.facilities?.freeWifi) return false

      if (filters?.minGoogleRating && airport?.facilities?.googleMapsRating) {
        if (airport?.facilities?.googleMapsRating < filters?.minGoogleRating) {
          return false
        }
      }

      const rangeChecks: {
        filterKey: keyof typeof filters
        isYear?: boolean
        jsonPath: (a: Airport) => number | undefined | null
      }[] = [
        {
          filterKey: 'foundingYear',
          isYear: true,
          jsonPath: a =>
            a?.airportInfo?.foundingYear
              ? parseInt(String(a?.airportInfo?.foundingYear), 10)
              : undefined,
        },
        { filterKey: 'passengerCapacity', jsonPath: a => a?.infrastructure?.passengerCapacity },
        { filterKey: 'employeeCount', jsonPath: a => a?.airportInfo?.employeeCount },
        { filterKey: 'destinationCount', jsonPath: a => a?.flightOperations?.destinationCount },
        {
          filterKey: 'destinationCountries',
          jsonPath: a => a.flightOperations?.destinationCountries,
        },
        {
          filterKey: 'domesticConnections',
          jsonPath: a => a?.flightOperations?.domesticConnections,
        },
        {
          filterKey: 'internationalConnections',
          jsonPath: a => a?.flightOperations?.internationalConnections,
        },
        { filterKey: 'elevationFt', jsonPath: a => a?.operations?.location?.elevationFt },
        {
          filterKey: 'passengerCapacity',
          jsonPath: a => a?.infrastructure?.passengerCapacity,
        },
        { filterKey: 'baggageCapacity', jsonPath: a => a?.infrastructure?.baggageCapacity },
        { filterKey: 'terminalCount', jsonPath: a => a?.infrastructure?.terminalCount },
        {
          filterKey: 'terminalAreaHectares',
          jsonPath: a => a?.infrastructure?.terminalAreaHectares,
        },
        { filterKey: 'airportAreaHectares', jsonPath: a => a?.infrastructure?.airportAreaHectares },
        { filterKey: 'apronCount', jsonPath: a => a?.infrastructure?.apronCount },
        { filterKey: 'runwayCount', jsonPath: a => a?.infrastructure?.runwayCount },
        { filterKey: 'mainRunwayLengthM', jsonPath: a => a?.infrastructure?.runways?.lengthM },
        { filterKey: 'towerHeightM', jsonPath: a => a?.infrastructure?.towerHeightM },
        {
          filterKey: 'parkingCapacityVehicles',
          jsonPath: a => a?.facilities?.parkingCapacityVehicles,
        },
        { filterKey: 'loungeCount', jsonPath: a => a?.facilities?.loungeCount },
        { filterKey: 'securityQueueTime', jsonPath: a => a?.facilities?.securityQueueTime },
        { filterKey: 'checkinTimeAvg', jsonPath: a => a?.facilities?.checkinTimeAvg },
      ]

      for (const check of rangeChecks) {
        const filterValueStr = filters?.[check.filterKey] as string
        if (filterValueStr) {
          const parsed = parseFilterRange(filterValueStr)
          if (parsed) {
            let itemValue = check?.jsonPath(airport)
            if (itemValue === undefined || itemValue === null || isNaN(Number(itemValue))) {
              return false
            }
            itemValue = Number(itemValue)
            if (itemValue < parsed.min || itemValue > parsed.max) {
              return false
            }
          }
        }
      }
      return true
    })
  }

  const filteredAirports = useMemo(() => {
    if (!allAirportsData) return []
    let filtered = allAirportsData

    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase().trim()

      const exactMatches = filtered.filter(
        airport =>
          airport.iataCode?.toLowerCase() === searchLower ||
          airport.icaoCode?.toLowerCase() === searchLower,
      )

      if (exactMatches.length > 0) {
        filtered = exactMatches
      } else {
        filtered = filtered.filter(airport => {
          const name = airport?.name?.toLowerCase() || ''
          const city = airport?.operations?.location?.city?.toLowerCase() || ''
          const country = airport?.operations?.country?.toLowerCase() || ''
          const iata = airport?.iataCode?.toLowerCase() || ''
          const ident = airport?.icaoCode?.toLowerCase() || ''

          return (
            name.includes(searchLower) ||
            city.includes(searchLower) ||
            country.includes(searchLower) ||
            iata.includes(searchLower) ||
            ident.includes(searchLower)
          )
        })
      }
    }

    return applyFilters(filtered)
  }, [allAirportsData, debouncedSearch, filters])

  const paginatedAirports = useMemo(() => {
    if (!filteredAirports) return []
    return filteredAirports.slice(0, page * ITEMS_PER_PAGE)
  }, [filteredAirports, page])

  const hasMore = paginatedAirports.length < filteredAirports.length

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1)
    }
  }

  useEffect(() => {
    if (searchTerm !== debouncedSearch) {
      setIsSearchLoading(true)
    } else {
      setTimeout(() => setIsSearchLoading(false), 300)
    }
  }, [searchTerm, debouncedSearch])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters])

  return {
    error,
    filteredCount: filteredAirports?.length,
    filters,
    hasMore,
    isLoading,
    isSearchLoading,
    loadMore,
    paginatedAirports,
    searchTerm,
    setFilters,
    setSearchTerm,
  }
}
