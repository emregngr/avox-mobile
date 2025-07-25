import React, { useCallback, useMemo, useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'

import { RenderTabBar, SafeLayout } from '@/components/common'
import { AirlinesTab, AirportsTab } from '@/components/feature'
import { useAirline } from '@/hooks/services/useAirline'
import { useAirport } from '@/hooks/services/useAirport'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

export default function Discover() {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const airportProps = useAirport()

  const airlineProps = useAirline()

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
      paddingBottom: 8,
      shadowOpacity: 0,
    }),
    [colors],
  )

  const renderAirportsTab = useCallback(
    () => (
      <AirportsTab
        airportsFilters={airportProps.filters}
        airportsFiltersCount={airportProps.filteredCount}
        airportsHasMore={airportProps.hasMore}
        airportsLoading={airportProps.isLoading}
        airportsSearchLoading={airportProps.isSearchLoading}
        airportsSearchTerm={airportProps.searchTerm}
        loadMoreAirports={airportProps.loadMore}
        paginatedAirports={airportProps.paginatedAirports}
        setAirportsFilters={airportProps.setFilters}
        setAirportsSearchTerm={airportProps.setSearchTerm}
      />
    ),
    [airportProps],
  )

  const renderAirlinesTab = useCallback(
    () => (
      <AirlinesTab
        airlineFiltersCount={airlineProps.filteredCount}
        airlinesFilters={airlineProps.filters}
        airlinesHasMore={airlineProps.hasMore}
        airlinesLoading={airlineProps.isLoading}
        airlinesSearchLoading={airlineProps.isSearchLoading}
        airlinesSearchTerm={airlineProps.searchTerm}
        loadMoreAirlines={airlineProps.loadMore}
        paginatedAirlines={airlineProps.paginatedAirlines}
        setAirlinesFilters={airlineProps.setFilters}
        setAirlinesSearchTerm={airlineProps.setSearchTerm}
      />
    ),
    [airlineProps],
  )

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const renderTabContent = useCallback(
    (key: string) => {
      switch (key) {
        case 'airports':
          return renderAirportsTab()
        case 'airlines':
          return renderAirlinesTab()
        default:
          return null
      }
    },
    [renderAirportsTab, renderAirlinesTab],
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
