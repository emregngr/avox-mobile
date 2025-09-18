import React, { useCallback, useMemo, useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'

import { FullScreenLoading, RenderTabBar, SafeLayout } from '@/components/common'
import { FavoriteAirlines, FavoriteAirports } from '@/components/feature'
import { useFavoriteDetails } from '@/hooks/services/useFavorite'
import { getLocale } from '@/locales/i18next'
import useAuthStore from '@/store/auth'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { AirlineType } from '@/types/feature/airline'
import type { AirportType } from '@/types/feature/airport'

export default function Favorites() {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const { isAuthenticated } = useAuthStore()

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { data: favoriteItems = [], isLoading, refetch } = useFavoriteDetails(true)

  const isAirport = (item: AirportType | AirlineType): item is AirportType =>
    'operations' in item && typeof item.operations === 'object' && 'airportType' in item.operations

  const isAirline = (item: AirportType | AirlineType): item is AirlineType =>
    'operations' in item && typeof item.operations === 'object' && 'businessType' in item.operations

  const favoriteAirports = useMemo(() => favoriteItems?.filter(isAirport), [favoriteItems])
  const favoriteAirlines = useMemo(() => favoriteItems?.filter(isAirline), [favoriteItems])

  const onRefresh = useCallback(() => {
    refetch?.()
  }, [refetch])

  const routes = useCallback(
    () => [
      { key: 'airports', label: getLocale('airports') },
      { key: 'airlines', label: getLocale('airlines') },
    ],
    [selectedLocale],
  )

  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors?.background?.primary,
      flex: 1,
    }),
    [colors],
  )

  const headerContainerStyle = useMemo(
    () => ({
      backgroundColor: colors?.background?.primary,
      elevation: 0,
      shadowOpacity: 0,
    }),
    [colors],
  )

  const renderTabContent = useCallback(
    (key: string) => {
      switch (key) {
        case 'airports':
          return (
            <FavoriteAirports
              airports={favoriteAirports}
              isLoading={isLoading}
              onRefresh={onRefresh}
            />
          )
        case 'airlines':
          return (
            <FavoriteAirlines
              airlines={favoriteAirlines}
              isLoading={isLoading}
              onRefresh={onRefresh}
            />
          )
        default:
          return null
      }
    },
    [favoriteAirports, favoriteAirlines, isLoading, onRefresh],
  )

  if (!isAuthenticated) {
    return <FullScreenLoading />
  }

  return (
    <SafeLayout testID="favorites-screen" topBlur={false}>
      <Tabs.Container
        renderTabBar={props => (
          <RenderTabBar activeIndex={activeIndex} props={props} tabType="favorites" />
        )}
        containerStyle={containerStyle}
        headerContainerStyle={headerContainerStyle}
        onIndexChange={setActiveIndex}
      >
        {routes().map(route => (
          <Tabs.Tab key={route.key} name={route.label}>
            {renderTabContent(route.key)}
          </Tabs.Tab>
        ))}
      </Tabs.Container>
    </SafeLayout>
  )
}
