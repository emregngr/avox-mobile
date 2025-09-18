import { useMemo } from 'react'
import { View } from 'react-native'

import { AirlinesList } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Sections/AirlinesList'
import { RoutesList } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Sections/RoutesList'
import { StatsGrid } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Sections/StatsGrid'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { AirportType } from '@/types/feature/airport'

interface AirportFlightTabProps {
  airportData: AirportType
}

export const AirportFlightTab = ({ airportData }: AirportFlightTabProps) => {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { flightOperations } = airportData ?? {}
  const {
    airlines,
    destinationCount,
    destinationCountries,
    domesticConnections,
    internationalConnections,
    routes,
  } = flightOperations ?? {}

  const memoizedStats = useMemo(
    () => ({
      destinationCount,
      destinationCountries,
      domesticConnections,
      internationalConnections,
    }),
    [destinationCount, destinationCountries, domesticConnections, internationalConnections],
  )

  const localeStrings = useMemo(
    () => ({
      airlines: getLocale('airlines'),
      country: getLocale('country'),
      domesticDestinations: getLocale('domesticDestinations'),
      internationalDestination: getLocale('internationalDestination'),
      popularDestinations: getLocale('popularDestinations'),
      totalDestination: getLocale('totalDestination'),
    }),
    [selectedLocale],
  )

  return (
    <View className="px-4 gap-y-4">
      <StatsGrid
        localeStrings={{
          country: localeStrings.country,
          domesticDestinations: localeStrings.domesticDestinations,
          internationalDestination: localeStrings.internationalDestination,
          totalDestination: localeStrings.totalDestination,
        }}
        iconColor={colors?.onPrimary100}
        stats={memoizedStats}
      />

      <AirlinesList
        airlines={airlines}
        iconColor={colors?.onPrimary100}
        title={localeStrings.airlines}
      />

      <RoutesList
        iconColor={colors?.onPrimary100}
        routes={routes}
        title={localeStrings.popularDestinations}
      />
    </View>
  )
}
