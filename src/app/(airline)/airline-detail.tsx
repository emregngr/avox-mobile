import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Tabs } from 'react-native-collapsible-tab-view'
import { ScrollView } from 'react-native-gesture-handler'

import { Header, RenderDetailTabBar, SafeLayout } from '@/components/common'
import {
  AirlineFlightTab,
  AirlineHeader,
  CompanyTab,
  FleetTab,
  SafetyEnvTab,
} from '@/components/feature'
import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airline } from '@/types/feature/airline'
import type { RegionKey } from '@/types/feature/region'
import { cn } from '@/utils/common/cn'
import { setSystemColors } from '@/utils/common/setSystemColors'

export default function AirlineDetailScreen() {
  const params = useLocalSearchParams()
  const { airline } = params as { airline: string }
  const airlineData = useMemo(() => JSON.parse(airline) as Airline, [airline])

  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { id: airlineId, name, operations } = airlineData || {}
  const { region } = operations || {}

  const regionLower = useMemo(() => region?.toLowerCase() as RegionKey, [region])

  useFocusEffect(
    useCallback(() => {
      setSystemColors(colors?.[regionLower], selectedTheme)
      return () => setSystemColors(colors?.background?.primary, selectedTheme)
    }, [regionLower, colors, selectedTheme]),
  )

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const id = useMemo(() => String(airlineId), [airlineId])
  const type = useMemo(() => 'airline' as const, [])

  const { handleFavoritePress, isFavorite, isPending } = useFavoriteToggle({ id, type })

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  const handleIndexChange = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const HeaderSectionComponent = useCallback(
    () => <AirlineHeader airlineData={airlineData} />,
    [airlineData],
  )

  const tabViews = useMemo(
    () => [
      () => <CompanyTab airlineData={airlineData} />,
      () => <FleetTab airlineData={airlineData} />,
      () => <AirlineFlightTab airlineData={airlineData} />,
      () => <SafetyEnvTab airlineData={airlineData} />,
    ],
    [airlineData],
  )

  const tabRoutes = useMemo(
    () => [
      { key: 'company', label: getLocale('company') },
      { key: 'fleet', label: getLocale('fleet') },
      { key: 'airlineFlight', label: getLocale('network') },
      { key: 'safetyEnv', label: getLocale('safety') },
    ],
    [selectedLocale],
  )

  const renderTabBar = useCallback(
    (props: any) => (
      <RenderDetailTabBar
        activeIndex={activeIndex}
        indicatorBackgroundColor={regionLower}
        props={props}
      />
    ),
    [regionLower, activeIndex],
  )

  const rightIcon = useMemo(() => {
    if (isPending) {
      return <ActivityIndicator color={colors?.tertiary100} size="small" />
    }
    return (
      <Ionicons
        color={isFavorite ? colors?.tertiary100 : colors?.onPrimary100}
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={20}
      />
    )
  }, [isPending, isFavorite, colors?.tertiary100, colors?.onPrimary100])

  const safeAreaClassName = useMemo(() => cn(`bg-${regionLower}`, 'flex-1'), [regionLower])

  const containerStyle = useMemo(
    () => ({ backgroundColor: colors?.background?.primary, flex: 1 }),
    [colors?.background?.primary],
  )

  const headerContainerStyle = useMemo(
    () => ({ backgroundColor: colors?.background?.primary, elevation: 0, shadowOpacity: 0 }),
    [colors?.background?.primary],
  )

  const headerProps = useMemo(
    () => ({
      containerClassName: 'h-14 my-1',
      leftIconOnPress: handleBackPress,
      rightIcon,
      rightIconClassName: 'bg-background-primary overflow-hidden rounded-full p-2',
      rightIconOnPress: handleFavoritePress,
      textClassName: 'mx-20',
      title: name,
    }),
    [name, handleBackPress, rightIcon, handleFavoritePress],
  )

  const scrollViewProps = useMemo(
    () => ({
      contentContainerClassName: 'flex-1',
      showsVerticalScrollIndicator: false,
    }),
    [],
  )

  const tabsContainerProps = useMemo(
    () => ({
      containerStyle,
      headerContainerStyle,
      onIndexChange: handleIndexChange,
      renderHeader: HeaderSectionComponent,
      renderTabBar,
    }),
    [handleIndexChange, HeaderSectionComponent, containerStyle, headerContainerStyle, renderTabBar],
  )

  const tabsScrollViewProps = useMemo(
    () => ({
      contentContainerClassName: 'pb-10',
      showsVerticalScrollIndicator: false,
    }),
    [],
  )

  return (
    <SafeLayout className={safeAreaClassName}>
      <Header {...headerProps} />

      <ScrollView {...scrollViewProps}>
        <Tabs.Container {...tabsContainerProps}>
          {tabRoutes.map((route, index) => {
            const TabComponent = tabViews[index]
            return (
              <Tabs.Tab key={route.key} name={route.label}>
                <Tabs.ScrollView {...tabsScrollViewProps}>
                  {TabComponent ? <TabComponent /> : null}
                </Tabs.ScrollView>
              </Tabs.Tab>
            )
          })}
        </Tabs.Container>
      </ScrollView>
    </SafeLayout>
  )
}
