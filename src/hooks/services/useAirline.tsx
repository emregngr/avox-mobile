import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { getAllAirlines } from '@/services/airlineService'
import useLocaleStore from '@/store/locale'
import type { Airline } from '@/types/feature/airline'
import { useDebounce } from '@/utils/common/useDebounce'
import { parseFilterRange } from '@/utils/feature/parseFilterRange'

const ITEMS_PER_PAGE = 20

export function useAirline() {
  const { selectedLocale } = useLocaleStore()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filters, setFilters] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false)
  const debouncedSearch = useDebounce<string>(searchTerm, 500)

  const {
    data: allAirlinesData,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getAllAirlines(selectedLocale),
    queryKey: ['allAirlines', selectedLocale],
    staleTime: 5 * 60 * 1000,
  })

  const applyFilters = (airlines: Airline[]): Airline[] => {
    if (!airlines) return []

    return airlines.filter(airline => {
      if (!airline) return false

      if (filters?.region) {
        const airlineRegion = airline?.operations?.region?.toLowerCase()
        const filterRegion = filters?.region?.toLowerCase()

        if (airlineRegion !== filterRegion) {
          return false
        }
      }

      if (filters?.businessType) {
        const businessType = airline?.operations?.businessType?.toLowerCase()
        const filterBusinessType = filters?.businessType?.toLowerCase()

        if (businessType !== filterBusinessType) {
          return false
        }
      }

      if (filters?.businessModel) {
        const businessModel = airline?.operations?.businessModel?.toLowerCase()
        const filterBusinessModel = filters?.businessModel?.toLowerCase()

        if (businessModel !== filterBusinessModel) {
          return false
        }
      }

      if (filters?.alliance) {
        const alliance = airline?.operations?.alliance?.toLowerCase()
        const filterAlliance = filters?.alliance?.toLowerCase()

        if (alliance !== filterAlliance) {
          return false
        }
      }

      if (filters?.minSkytraxRating && airline?.operations?.skytraxRating) {
        if (airline?.operations?.skytraxRating < filters?.minSkytraxRating) {
          return false
        }
      }

      const airlineRangeChecks: {
        filterKey: keyof typeof filters
        isYear?: boolean
        jsonPath: (a: Airline) => number | undefined | null
      }[] = [
        {
          filterKey: 'foundingYear',
          isYear: true,
          jsonPath: a =>
            a.companyInfo?.foundingYear
              ? parseInt(String(a?.companyInfo?.foundingYear), 10)
              : undefined,
        },
        { filterKey: 'passengerCapacity', jsonPath: a => a?.companyInfo?.passengerCapacity },
        { filterKey: 'employeeCount', jsonPath: a => a?.companyInfo?.employeeCount },
        { filterKey: 'destinationCount', jsonPath: a => a?.network?.destinationCount },
        { filterKey: 'destinationCountries', jsonPath: a => a?.network?.destinationCountries },
        { filterKey: 'domesticConnections', jsonPath: a => a?.network?.domesticConnections },
        {
          filterKey: 'internationalConnections',
          jsonPath: a => a?.network?.internationalConnections,
        },
        { filterKey: 'totalAirplane', jsonPath: a => a?.fleet?.totalAirplane },
        { filterKey: 'averageAgeYears', jsonPath: a => a?.fleet?.averageAgeYears },
        { filterKey: 'airplaneTypeCount', jsonPath: a => a?.fleet?.airplaneTypeCount },
      ]

      for (const check of airlineRangeChecks) {
        const filterValueStr = filters?.[check.filterKey] as string
        if (filterValueStr) {
          const parsed = parseFilterRange(filterValueStr)
          if (parsed) {
            let itemValue = check?.jsonPath(airline)
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

  const filteredAirlines = useMemo(() => {
    if (!allAirlinesData) return []

    let filtered = allAirlinesData

    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase().trim()

      const exactMatches = filtered.filter(
        airline =>
          airline.iataCode?.toLowerCase() === searchLower ||
          airline.icaoCode?.toLowerCase() === searchLower,
      )

      if (exactMatches.length > 0) {
        filtered = exactMatches
      } else {
        filtered = filtered.filter(airline => {
          const name = airline?.name?.toLowerCase() || ''
          const city = airline?.operations?.hub?.city?.toLowerCase() || ''
          const country = airline?.operations?.country?.toLowerCase() || ''
          const iata = airline?.iataCode?.toLowerCase() || ''
          const icao = airline?.icaoCode?.toLowerCase() || ''

          return (
            name.includes(searchLower) ||
            city.includes(searchLower) ||
            country.includes(searchLower) ||
            iata.includes(searchLower) ||
            icao.includes(searchLower)
          )
        })
      }
    }

    return applyFilters(filtered)
  }, [allAirlinesData, debouncedSearch, filters])

  const paginatedAirlines = useMemo(() => {
    if (!filteredAirlines) return []
    return filteredAirlines.slice(0, page * ITEMS_PER_PAGE)
  }, [filteredAirlines, page])

  const hasMore = paginatedAirlines.length < filteredAirlines.length

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
    filteredCount: filteredAirlines?.length,
    filters,
    hasMore,
    isLoading,
    isSearchLoading,
    loadMore,
    paginatedAirlines,
    searchTerm,
    setFilters,
    setSearchTerm,
  }
}
