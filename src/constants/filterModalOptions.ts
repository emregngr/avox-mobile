import { getLocale } from '@/locales/i18next'
import type { FilterOption, RangeFilterOption } from '@/types/feature/filter'

export const getRegions = (): FilterOption[] => [
  { label: getLocale('europe'), value: 'EU' },
  { label: getLocale('asia'), value: 'AS' },
  { label: getLocale('northAmerica'), value: 'NA' },
  { label: getLocale('southAmerica'), value: 'SA' },
  { label: getLocale('africa'), value: 'AF' },
  { label: getLocale('oceania'), value: 'OC' },
]

export const getFoundingYearRanges = (): RangeFilterOption[] => [
  { label: '< 1944', value: '0-1944' },
  { label: '1945-1969', value: '1945-1969' },
  { label: '1970-1999', value: '1970-1999' },
  { label: '> 2000', value: '2000+' },
]

export const getPassengerCapacityRanges = (): RangeFilterOption[] => [
  { label: '< 2M', value: '0-2' },
  { label: '2.1M-6.4M', value: '2.1-6.4' },
  { label: '6.5M-14.9M', value: '6.5-14.9' },
  { label: '15M-24.9M', value: '15-24.9' },
  { label: '25M-49.9M', value: '25-49.9' },
  { label: '> 50M', value: '50+' },
]

export const getEmployeeCountRanges = (): RangeFilterOption[] => [
  { label: '< 2000', value: '0-200' },
  { label: '201-600', value: '201-600' },
  { label: '601-1.000', value: '601-1000' },
  { label: '> 1.001', value: '1001+' },
]

export const getDestinationCountRanges = (): RangeFilterOption[] => [
  { label: '< 10', value: '0-10' },
  { label: '11-22', value: '11-22' },
  { label: '23-50', value: '23-50' },
  { label: '> 51', value: '51+' },
]

export const getDestinationCountriesRanges = (): RangeFilterOption[] => [
  { label: '< 5', value: '0-10' },
  { label: '6-15', value: '11-15' },
  { label: '16-20', value: '16-20' },
  { label: '> 21', value: '21+' },
]

export const getDomesticConnectionsRanges = (): RangeFilterOption[] => [
  { label: '< 5', value: '0-5' },
  { label: '6-10', value: '6-10' },
  { label: '11-15', value: '11-15' },
  { label: '> 16', value: '16+' },
]

export const getInternationalConnectionsRanges = (): RangeFilterOption[] => [
  { label: '< 12', value: '0-12' },
  { label: '13-25', value: '13-25' },
  { label: '26-40', value: '26-40' },
  { label: '> 41', value: '41+' },
]

export const getAirportTypes = (): FilterOption[] => [
  { label: getLocale('mega'), value: 'mega_airport' },
  { label: getLocale('large'), value: 'large_airport' },
  { label: getLocale('medium'), value: 'medium_airport' },
  { label: getLocale('small'), value: 'small_airport' },
]

export const getElevationFtRanges = (): RangeFilterOption[] => [
  { label: '< 54', value: '0-54' },
  { label: '55-184', value: '55-184' },
  { label: '185-782', value: '185-782' },
  { label: '> 783', value: '783+' },
]

export const getBaggageCapacityRanges = (): RangeFilterOption[] => [
  { label: '< 400', value: '0-400' },
  { label: '401-700', value: '401-700' },
  { label: '701-950', value: '701-950' },
  { label: '> 951', value: '951+' },
]

export const getTerminalCountRanges = (): RangeFilterOption[] => [
  { label: '1-2', value: '0-2' },
  { label: '3-4', value: '3-4' },
  { label: '> 5', value: '5+' },
]

export const getTerminalAreaHectaresRanges = (): RangeFilterOption[] => [
  { label: '< 4', value: '0-4' },
  { label: '4.1-6', value: '4.1-6' },
  { label: '6.1-15', value: '6.1-15' },
  { label: '> 15.1', value: '15.1+' },
]

export const getAirportAreaHectaresRanges = (): RangeFilterOption[] => [
  { label: '< 400', value: '0-400' },
  { label: '401-800', value: '401-800' },
  { label: '801-1.550', value: '801-1550' },
  { label: '> 1.551', value: '1551+' },
]

export const getApronCountRanges = (): RangeFilterOption[] => [
  { label: '< 5', value: '0-5' },
  { label: '6-8', value: '6-8' },
  { label: '9-15', value: '9-15' },
  { label: '> 16', value: '16+' },
]

export const getAirportServices = (): FilterOption[] => [
  { label: getLocale('dutyFree'), value: 'hasDutyFree' },
  { label: getLocale('restaurants'), value: 'hasRestaurants' },
  { label: getLocale('lounges'), value: 'hasLounges' },
  { label: getLocale('carRental'), value: 'hasCarRental' },
  { label: getLocale('healthServices'), value: 'hasHealthServices' },
  { label: getLocale('childrensPlayground'), value: 'hasChildrensPlayArea' },
  { label: getLocale('placeOfWorship'), value: 'hasPrayerRoom' },
  { label: getLocale('hotels'), value: 'hasHotels' },
]

export const getRunwayCountRanges = (): RangeFilterOption[] => [
  { label: '1-2', value: '0-2' },
  { label: '3-4', value: '3-4' },
  { label: '> 5', value: '5+' },
]

export const getRunwayLengthMRanges = (): RangeFilterOption[] => [
  { label: '< 2.930', value: '0-2930' },
  { label: '2.931-3.350', value: '2931-3350' },
  { label: '3.351-3.650', value: '3351-3650' },
  { label: '> 3.651', value: '3651+' },
]

export const getTowerHeightMRanges = (): RangeFilterOption[] => [
  { label: '< 30', value: '0-30' },
  { label: '31-35', value: '31-35' },
  { label: '36-40', value: '36-40' },
  { label: '> 41', value: '41+' },
]

export const getParkingCapacityVehiclesRanges = (): RangeFilterOption[] => [
  { label: '< 1.500', value: '0-1500' },
  { label: '1.501-4.000', value: '1501-4000' },
  { label: '4.001-8.000', value: '4001-8000' },
  { label: '> 8.000', value: '8001+' },
]

export const getLoungeCountRanges = (): RangeFilterOption[] => [
  { label: '< 2', value: '0-2' },
  { label: '3-5', value: '3-5' },
  { label: '> 6', value: '6+' },
]

export const getSecurityQueueTimeRanges = (): RangeFilterOption[] => [
  { label: '< 10', value: '0-10' },
  { label: '11-15', value: '11-15' },
  { label: '16-20', value: '16-20' },
  { label: '> 21', value: '21+' },
]

export const getCheckinTimeAvgRanges = (): RangeFilterOption[] => [
  { label: '< 12', value: '0-12' },
  { label: '13-16', value: '13-16' },
  { label: '17-22', value: '17-22' },
  { label: '> 23', value: '23+' },
]

export const getBusinessModels = (): FilterOption[] => [
  { label: getLocale('cargo'), value: 'cargo' },
  { label: getLocale('passenger'), value: 'passenger' },
]

export const getBusinessTypes = (): FilterOption[] => [
  { label: getLocale('majorInternational'), value: 'major_international' },
  { label: getLocale('regional'), value: 'regional' },
  { label: getLocale('lowCost'), value: 'low_cost' },
  { label: getLocale('cargo'), value: 'cargo' },
]

export const getTotalAirplaneRanges = (): RangeFilterOption[] => [
  { label: '< 20', value: '0-8' },
  { label: '21-50', value: '9-15' },
  { label: '51-100', value: '16-40' },
  { label: '101-200', value: '41-99' },
  { label: '100-199', value: '100-199' },
  { label: '> 200', value: '200+' },
]

export const getAverageAgeRanges = (): RangeFilterOption[] => [
  { label: '< 8', value: '0-8' },
  { label: '8.1-11', value: '8.1-11' },
  { label: '11.1-13', value: '11.1-13' },
  { label: '> 13.1', value: '13.1+' },
]

export const getAirplaneTypeCountRanges = (): RangeFilterOption[] => [
  { label: '< 2', value: '0-2' },
  { label: '3-4', value: '3-4' },
  { label: '5-6', value: '5-6' },
  { label: '> 7', value: '7+' },
]

export const getAlliances = (): FilterOption[] => [
  { label: 'Star Alliance', value: 'star alliance' },
  { label: 'OneWorld', value: 'oneworld' },
  { label: 'SkyTeam', value: 'skyteam' },
  { label: getLocale('none'), value: 'none' },
]

export const getGoogleRatings = () => [1, 2, 3, 4, 5]

export const getSkytraxRatings = () => [1, 2, 3, 4, 5]
