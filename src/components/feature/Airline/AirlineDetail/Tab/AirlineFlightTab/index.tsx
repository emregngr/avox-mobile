import React, { useMemo } from 'react'
import { View } from 'react-native'

import { Alliance } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/Alliance'
import { DestinationList } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/DestinationList'
import { RoutesList } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/RoutesList'
import { StatsGrid } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/StatsGrid'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airline } from '@/types/feature/airline'

interface AirlineFlightTabProps {
  airlineData: Airline
}

export const AirlineFlightTab = ({ airlineData }: AirlineFlightTabProps) => {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { network, operations } = airlineData ?? {}
  const { alliance } = operations ?? {}
  const {
    destinationCount,
    destinationCountries,
    destinations,
    domesticConnections,
    internationalConnections,
    routes,
  } = network ?? {}

  const memoizedStats = useMemo(
    () => ({
      destinationCount,
      destinationCountries,
      domesticConnections,
      internationalConnections,
    }),
    [destinationCount, destinationCountries, domesticConnections, internationalConnections],
  )

  const iconColor = useMemo(() => colors.onPrimary100, [colors.onPrimary100])

  const localeStrings = useMemo(
    () => ({
      activeRoutes: getLocale('activeRoutes'),
      alliance: getLocale('alliance'),
      country: getLocale('country'),
      domesticDestinations: getLocale('domesticDestinations'),
      internationalDestination: getLocale('internationalDestination'),
      mainDestinations: getLocale('mainDestinations'),
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
        iconColor={iconColor}
        stats={memoizedStats}
      />

      <DestinationList
        destinations={destinations}
        iconColor={iconColor}
        title={localeStrings.mainDestinations}
      />

      <RoutesList iconColor={iconColor} routes={routes} title={localeStrings.activeRoutes} />

      {alliance !== 'none' && (
        <Alliance alliance={alliance} iconColor={iconColor} title={localeStrings.alliance} />
      )}
    </View>
  )
}
