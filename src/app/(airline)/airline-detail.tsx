import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Platform } from 'react-native'
import { Tabs } from 'react-native-collapsible-tab-view'
import { ScrollView } from 'react-native-gesture-handler'
import { TestIds } from 'react-native-google-mobile-ads'

import { FullScreenLoading, Header, RenderDetailTabBar, SafeLayout } from '@/components/common'
import {
  AdBanner,
  AirlineFlightTab,
  AirlineHeader,
  CompanyTab,
  FleetTab,
  SafetyEnvTab,
} from '@/components/feature'
import { useAirlineById } from '@/hooks/services/useAirline'
import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airline } from '@/types/feature/airline'
import type { RegionKey } from '@/types/feature/region'
import { AnalyticsService } from '@/utils/common/analyticsService'
import { cn } from '@/utils/common/cn'
import { LinkingService } from '@/utils/common/linkingService'
import { setSystemColors } from '@/utils/common/setSystemColors'

export default function AirlineDetail() {
  const { airline, airlineId } = useLocalSearchParams() as { airline: string; airlineId: string }

  const { data: airlineByIdData } = useAirlineById(airlineId)

  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const airlineData = useMemo(() => {
    if (airlineId) {
      return airlineByIdData as Airline
    }

    if (airline) {
      return JSON.parse(airline) as Airline
    }

    return null
  }, [airlineByIdData, airline, airlineId])

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { id: currentAirlineId, name, operations } = airlineData || {}
  const { region } = operations || {}

  const regionLower = useMemo(() => region?.toLowerCase() as RegionKey, [region])

  useFocusEffect(
    useCallback(() => {
      setSystemColors(colors?.[regionLower], selectedTheme)
      return () => setSystemColors(colors?.background?.primary, selectedTheme)
    }, [regionLower, colors, selectedTheme]),
  )

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const id = useMemo(() => String(currentAirlineId), [currentAirlineId])
  const type = useMemo(() => 'airline' as const, [])

  const { handleFavoritePress, isFavorite, isPending } = useFavoriteToggle({ id, type })

  const handleBackPress = useCallback(() => {
    if (airlineId) {
      router.dismissAll()
      router.replace('/home')
    } else {
      router.back()
    }
  }, [airlineId])

  const handleIndexChange = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const HeaderSectionComponent = useCallback(
    () => (airlineData ? <AirlineHeader airlineData={airlineData} /> : null),
    [airlineData],
  )

  const tabViews = useMemo(
    () =>
      airlineData
        ? [
            () => <CompanyTab airlineData={airlineData} />,
            () => <FleetTab airlineData={airlineData} />,
            () => <AirlineFlightTab airlineData={airlineData} />,
            () => <SafetyEnvTab airlineData={airlineData} />,
          ]
        : [],
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

  const shareIconOnPress = useCallback(async () => {
    await LinkingService.shareAirline(airlineData as Airline)

    await AnalyticsService.sendEvent('airport_shared', {
      airport_id: airlineData?.id,
      airport_name: airlineData?.name,
      iata_code: airlineData?.iataCode,
      user_locale: selectedLocale,
    })
  }, [])

  const shareIcon = useMemo(
    () => <Ionicons color={colors.onPrimary100} name="share-outline" size={20} />,
    [],
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
      backIconOnPress: handleBackPress,
      containerClassName: 'h-14 my-1',
      rightIcon,
      rightIconClassName: 'bg-background-primary overflow-hidden rounded-full p-2',
      rightIconOnPress: handleFavoritePress,
      shareIcon,
      shareIconClassName: 'bg-background-primary overflow-hidden rounded-full p-2',
      shareIconOnPress,
      title: name as string,
      titleClassName: 'ml-[46px] mr-[100px]',
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

  const adUnitId = useMemo(() => {
    if (__DEV__) {
      return TestIds.BANNER
    }
    return Platform.OS === 'ios'
      ? 'ca-app-pub-4123130377375974/1937454469'
      : 'ca-app-pub-4123130377375974/9656162382'
  }, [])

  return !airlineData ? (
    <FullScreenLoading />
  ) : (
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

      <AdBanner adUnitId={adUnitId} />
    </SafeLayout>
  )
}
