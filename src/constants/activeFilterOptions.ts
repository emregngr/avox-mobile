import { getLocale } from '@/locales/i18next'
import type { FilterOptionType, RangeFilterOptionType } from '@/types/feature/filter'

export const getRegionOptions = (): FilterOptionType[] => [
  { label: getLocale('europe'), value: 'EU' },
  { label: getLocale('asia'), value: 'AS' },
  { label: getLocale('northAmerica'), value: 'NA' },
  { label: getLocale('southAmerica'), value: 'SA' },
  { label: getLocale('africa'), value: 'AF' },
  { label: getLocale('oceania'), value: 'OC' },
]

export const getAirportTypes = (): FilterOptionType[] => [
  { label: `${getLocale('airportType')}: ${getLocale('mega')}`, value: 'mega_airport' },
  { label: `${getLocale('airportType')}: ${getLocale('large')}`, value: 'large_airport' },
  { label: `${getLocale('airportType')}: ${getLocale('medium')}`, value: 'medium_airport' },
  { label: `${getLocale('airportType')}: ${getLocale('small')}`, value: 'small_airport' },
]

export const getBusinessModels = (): FilterOptionType[] => [
  { label: getLocale('cargo'), value: 'cargo' },
  { label: getLocale('passenger'), value: 'passenger' },
]

export const getBusinessTypes = (): FilterOptionType[] => [
  { label: getLocale('majorInternational'), value: 'major_international' },
  { label: getLocale('regional'), value: 'regional' },
  { label: getLocale('lowCost'), value: 'low_cost' },
  { label: getLocale('cargo'), value: 'cargo' },
]

export const getAlliances = (): FilterOptionType[] => [
  { label: 'Star Alliance', value: 'star alliance' },
  { label: 'OneWorld', value: 'oneworld' },
  { label: 'SkyTeam', value: 'skyteam' },
  { label: getLocale('none'), value: 'none' },
]

export const getFoundingYearRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('yearOfEstablishment')}: < 1944`, value: '0-1944' },
  { label: `${getLocale('yearOfEstablishment')}: 1945-1969`, value: '1945-1969' },
  { label: `${getLocale('yearOfEstablishment')}: 1970-1999`, value: '1970-1999' },
  { label: `${getLocale('yearOfEstablishment')}: > 2000`, value: '2000+' },
]

export const getPassengerCapacityRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('numberOfPassengers')}: < 2M`, value: '0-2' },
  { label: `${getLocale('numberOfPassengers')}: 2.1M-6.4M`, value: '2.1-6.4' },
  { label: `${getLocale('numberOfPassengers')}: 6.5M-14.9M`, value: '6.5-14.9' },
  { label: `${getLocale('numberOfPassengers')}: 15M-24.9M`, value: '15-24.9' },
  { label: `${getLocale('numberOfPassengers')}: 25M-49.9M`, value: '25-49.9' },
  { label: `${getLocale('numberOfPassengers')}: > 50M`, value: '50+' },
]

export const getEmployeeCountRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('numberOfEmployees')}: < 200`, value: '1-200' },
  { label: `${getLocale('numberOfEmployees')}: 201-600`, value: '201-600' },
  { label: `${getLocale('numberOfEmployees')}: 601-1.000`, value: '601-1000' },
  { label: `${getLocale('numberOfEmployees')}: > 1001`, value: '1001+' },
]

export const getDestinationCountRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('numberOfDestination')}: < 10`, value: '0-10' },
  { label: `${getLocale('numberOfDestination')}: 11-22`, value: '11-22' },
  { label: `${getLocale('numberOfDestination')}: 23-50`, value: '23-50' },
  { label: `${getLocale('numberOfDestination')}: > 51`, value: '51+' },
]

export const getDestinationCountriesRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('numberOfCountries')}: < 10`, value: '0-10' },
  { label: `${getLocale('numberOfCountries')}: 11-15`, value: '11-15' },
  { label: `${getLocale('numberOfCountries')}: 16-20`, value: '16-20' },
  { label: `${getLocale('numberOfCountries')}: > 21`, value: '21+' },
]

export const getDomesticConnectionsRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('domesticDestinations')}: < 5`, value: '0-5' },
  { label: `${getLocale('domesticDestinations')}: 6-10`, value: '6-10' },
  { label: `${getLocale('domesticDestinations')}: 11-15`, value: '11-15' },
  { label: `${getLocale('domesticDestinations')}: > 16`, value: '16+' },
]

export const getInternationalConnectionsRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('internationalDestination')}: < 12`, value: '0-12' },
  { label: `${getLocale('internationalDestination')}: 13-25`, value: '13-25' },
  { label: `${getLocale('internationalDestination')}: 26-40`, value: '26-40' },
  { label: `${getLocale('internationalDestination')}: > 41`, value: '41+' },
]

export const getElevationFtRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('elevation')}: < 54`, value: '0-54' },
  { label: `${getLocale('elevation')}: 55-184`, value: '55-184' },
  { label: `${getLocale('elevation')}: 185-782`, value: '185-782' },
  { label: `${getLocale('elevation')}: > 783`, value: '783+' },
]

export const getBaggageCapacityRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('luggage')}: < 400`, value: '0-400' },
  { label: `${getLocale('luggage')}: 401-700`, value: '401-700' },
  { label: `${getLocale('luggage')}: 701-950`, value: '701-950' },
  { label: `${getLocale('luggage')}: > 951`, value: '951+' },
]

export const getTerminalCountRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('terminal')}: 1-2`, value: '0-2' },
  { label: `${getLocale('terminal')}: 3-4`, value: '3-4' },
  { label: `${getLocale('terminal')}: > 5`, value: '5+' },
]

export const getTerminalAreaHectaresRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('terminalArea')}: < 4`, value: '0-4' },
  { label: `${getLocale('terminalArea')}: 4.1-6`, value: '4.1-6' },
  { label: `${getLocale('terminalArea')}: 6.1-15`, value: '6.1-15' },
  { label: `${getLocale('terminalArea')}: > 15.1`, value: '15.1+' },
]

export const getAirportAreaHectaresRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('airportArea')}: < 400`, value: '0-400' },
  { label: `${getLocale('airportArea')}: 401-800`, value: '401-800' },
  { label: `${getLocale('airportArea')}: 801-1.550`, value: '801-1550' },
  { label: `${getLocale('airportArea')}: > 1.551`, value: '1551+' },
]

export const getApronCountRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('apron')}: < 5`, value: '0-5' },
  { label: `${getLocale('apron')}: 6-8`, value: '6-8' },
  { label: `${getLocale('apron')}: 9-15`, value: '9-15' },
  { label: `${getLocale('apron')}: > 16`, value: '16+' },
]

export const getRunwayCountRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('runway')}: 1-2`, value: '0-2' },
  { label: `${getLocale('runway')}: 3-4`, value: '3-4' },
  { label: `${getLocale('runway')}: > 5`, value: '5+' },
]

export const getRunwayLengthMRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('runwaym')}: < 2.930`, value: '0-2930' },
  { label: `${getLocale('runwaym')}: 2.931-3.350`, value: '2931-3350' },
  { label: `${getLocale('runwaym')}: 3.351-3.650`, value: '3351-3650' },
  { label: `${getLocale('runwaym')}: > 3.651`, value: '3651+' },
]

export const getTowerHeightMRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('tower')}: < 30`, value: '0-30' },
  { label: `${getLocale('tower')}: 31-35`, value: '31-35' },
  { label: `${getLocale('tower')}: 36-40`, value: '36-40' },
  { label: `${getLocale('tower')}: > 41`, value: '41+' },
]

export const getParkingCapacityVehiclesRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('parking')}: < 1.500`, value: '0-1500' },
  { label: `${getLocale('parking')}: 1.501-4.000`, value: '1501-4000' },
  { label: `${getLocale('parking')}: 4.001-8.000`, value: '4001-8000' },
  { label: `${getLocale('parking')}: > 8.001`, value: '8001+' },
]

export const getLoungeCountRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('lounges')}: < 2`, value: '0-2' },
  { label: `${getLocale('lounges')}: 3-5`, value: '3-5' },
  { label: `${getLocale('lounges')}: > 6`, value: '6+' },
]

export const getSecurityQueueTimeRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('security')}: < 10`, value: '0-10' },
  { label: `${getLocale('security')}: 11-15`, value: '11-15' },
  { label: `${getLocale('security')}: 16-20`, value: '16-20' },
  { label: `${getLocale('security')}: > 21`, value: '21+' },
]

export const getCheckinTimeAvgRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('checkIn')}: < 12`, value: '0-12' },
  { label: `${getLocale('checkIn')}: 13-16`, value: '13-16' },
  { label: `${getLocale('checkIn')}: 17-22`, value: '17-22' },
  { label: `${getLocale('checkIn')}: > 23`, value: '23+' },
]

export const getTotalAirplaneRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('totalAirplane')}: < 8`, value: '0-8' },
  { label: `${getLocale('totalAirplane')}: 9-15`, value: '9-15' },
  { label: `${getLocale('totalAirplane')}: 16-40`, value: '16-40' },
  { label: `${getLocale('totalAirplane')}: 41-99`, value: '41-99' },
  { label: `${getLocale('totalAirplane')}: 100-199`, value: '100-199' },
  { label: `${getLocale('totalAirplane')}: > 200`, value: '200+' },
]

export const getAverageAgeRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('averageAgeYears')}: < 8`, value: '0-8' },
  { label: `${getLocale('averageAgeYears')}: 8.1-11`, value: '8.1-11' },
  { label: `${getLocale('averageAgeYears')}: 11.1-13`, value: '11.1-13' },
  { label: `${getLocale('averageAgeYears')}: > 13.1`, value: '13.1+' },
]

export const getAirplaneTypeCountRanges = (): RangeFilterOptionType[] => [
  { label: `${getLocale('airplaneType')}: < 2`, value: '0-2' },
  { label: `${getLocale('airplaneType')}: 3-4`, value: '3-4' },
  { label: `${getLocale('airplaneType')}: 5-6`, value: '5-6' },
  { label: `${getLocale('airplaneType')}: > 7+`, value: '7+' },
]

export const getFilterLabelMap = (): Record<
  string,
  (FilterOptionType | RangeFilterOptionType)[]
> => ({
  airplaneTypeCount: getAirplaneTypeCountRanges(),
  airportAreaHectares: getAirportAreaHectaresRanges(),
  airportType: getAirportTypes(),
  alliance: getAlliances(),
  apronCount: getApronCountRanges(),
  averageAgeYears: getAverageAgeRanges(),
  baggageCapacity: getBaggageCapacityRanges(),
  businessModel: getBusinessModels(),
  businessType: getBusinessTypes(),
  checkinTimeAvg: getCheckinTimeAvgRanges(),
  destinationCount: getDestinationCountRanges(),
  destinationCountries: getDestinationCountriesRanges(),
  domesticConnections: getDomesticConnectionsRanges(),
  elevationFt: getElevationFtRanges(),
  employeeCount: getEmployeeCountRanges(),
  foundingYear: getFoundingYearRanges(),
  internationalConnections: getInternationalConnectionsRanges(),
  loungeCount: getLoungeCountRanges(),
  mainRunwayLengthM: getRunwayLengthMRanges(),
  parkingCapacityVehicles: getParkingCapacityVehiclesRanges(),
  passengerCapacity: getPassengerCapacityRanges(),
  region: getRegionOptions(),
  runwayCount: getRunwayCountRanges(),
  securityQueueTime: getSecurityQueueTimeRanges(),
  terminalAreaHectares: getTerminalAreaHectaresRanges(),
  terminalCount: getTerminalCountRanges(),
  totalAirplane: getTotalAirplaneRanges(),
  towerHeightM: getTowerHeightMRanges(),
})
