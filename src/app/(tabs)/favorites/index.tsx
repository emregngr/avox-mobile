import React, { useCallback, useMemo, useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'

import { RenderTabBar, SafeLayout } from '@/components/common'
import { FavoriteAirlinesList, FavoriteAirportsList } from '@/components/feature'
import { useFavoriteDetails } from '@/hooks/services/useFavorite'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airline } from '@/types/feature/airline'
import type { Airport } from '@/types/feature/airport'

export default function Favorites() {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { data: favoriteItems = [], isLoading, refetch } = useFavoriteDetails(true)

  const isAirport = (item: Airport | Airline): item is Airport =>
    'operations' in item && typeof item.operations === 'object' && 'airportType' in item.operations

  const isAirline = (item: Airport | Airline): item is Airline =>
    'operations' in item && typeof item.operations === 'object' && 'businessType' in item.operations

  const favoriteAirports = useMemo(() => favoriteItems?.filter(isAirport), [favoriteItems])
  const favoriteAirlines = useMemo(() => favoriteItems?.filter(isAirline), [favoriteItems])

  const onRefresh = useCallback(() => {
    refetch?.()
  }, [refetch])

  const routes = useMemo(
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
            <FavoriteAirportsList
              airports={favoriteAirports}
              isLoading={isLoading}
              onRefresh={onRefresh}
            />
          )
        case 'airlines':
          return (
            <FavoriteAirlinesList
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

  return (
    <SafeLayout>
      <Tabs.Container
        containerStyle={containerStyle}
        headerContainerStyle={headerContainerStyle}
        onIndexChange={setActiveIndex}
        renderTabBar={props => <RenderTabBar activeIndex={activeIndex} props={props} />}
      >
        {routes.map(route => (
          <Tabs.Tab key={route.key} name={route.label}>
            {renderTabContent(route.key)}
          </Tabs.Tab>
        ))}
      </Tabs.Container>
    </SafeLayout>
  )
}
