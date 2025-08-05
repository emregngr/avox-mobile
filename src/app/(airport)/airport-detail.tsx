import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Platform } from 'react-native'
import { Tabs } from 'react-native-collapsible-tab-view'
import { ScrollView } from 'react-native-gesture-handler'
import { TestIds } from 'react-native-google-mobile-ads'

import { FullScreenLoading, Header, RenderDetailTabBar, SafeLayout } from '@/components/common'
import {
  AdBanner,
  AirportFlightTab,
  AirportHeader,
  GeneralTab,
  InfrastructureTab,
  NearbyPlacesTab,
} from '@/components/feature'
import { useAirportById } from '@/hooks/services/useAirport'
import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airport } from '@/types/feature/airport'
import type { RegionKey } from '@/types/feature/region'
import { AnalyticsService } from '@/utils/common/analyticsService'
import { cn } from '@/utils/common/cn'
import { shareAirport } from '@/utils/common/linkingService'
import { setSystemColors } from '@/utils/common/setSystemColors'

export default function AirportDetail() {
  const { airport, airportId } = useLocalSearchParams() as { airport: string; airportId: string }

  const { data: airportByIdData } = useAirportById(airportId)

  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const airportData = useMemo(() => {
    if (airportId) {
      return airportByIdData as Airport
    }

    if (airport) {
      return JSON.parse(airport) as Airport
    }

    return null
  }, [airportByIdData, airport, airportId])

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { id: currentAirportId, name, operations } = airportData ?? {}
  const { region } = operations ?? {}

  const regionLower = useMemo(() => region?.toLowerCase() as RegionKey, [region])

  const regionColor = useMemo(() => colors?.[regionLower as RegionKey], [colors, regionLower])

  useEffect(() => {
    setSystemColors(regionColor)
  }, [regionColor])

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const id = useMemo(() => String(currentAirportId), [currentAirportId])
  const type = useMemo(() => 'airport' as const, [])

  const { handleFavoritePress, isFavorite, isPending } = useFavoriteToggle({ id, type })

  const handleBackPress = useCallback(() => {
    setSystemColors(colors?.background?.primary)

    if (airportId) {
      router.dismissAll()
      router.replace('/home')
    } else {
      router.back()
    }
  }, [colors, airportId])

  const handleIndexChange = useCallback((index: number) => setActiveIndex(index), [])

  const HeaderSectionComponent = useCallback(
    () => (airportData ? <AirportHeader airportData={airportData} /> : null),
    [airportData],
  )

  const tabViews = useMemo(
    () =>
      airportData
        ? [
            () => <GeneralTab airportData={airportData} />,
            () => <InfrastructureTab airportData={airportData} />,
            () => <AirportFlightTab airportData={airportData} />,
            () => <NearbyPlacesTab airportData={airportData} />,
          ]
        : [],
    [airportData],
  )

  const tabRoutes = useCallback(
    () => [
      { key: 'general', label: getLocale('general') },
      { key: 'infrastructure', label: getLocale('infrastructure') },
      { key: 'airportFlight', label: getLocale('flights') },
      { key: 'nearbyPlaces', label: getLocale('discover') },
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
    await shareAirport(airportData as Airport)

    await AnalyticsService.sendEvent('airport_shared', {
      airport_id: airportData?.id,
      airport_name: airportData?.name,
      iata_code: airportData?.iataCode,
      user_locale: selectedLocale,
    })
  }, [airportData, selectedLocale])

  const shareIcon = useMemo(
    () => <Ionicons color={colors.onPrimary100} name="share-outline" size={20} />,
    [colors?.onPrimary100],
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

  const containerStyle = useMemo(
    () => ({ backgroundColor: colors?.background?.primary, flex: 1 }),
    [colors?.background?.primary],
  )

  const headerContainerStyle = useMemo(
    () => ({ backgroundColor: colors?.background?.primary, elevation: 0, shadowOpacity: 0 }),
    [colors?.background?.primary],
  )

  const safeAreaClassName = useMemo(() => cn(`bg-${regionLower}`, 'flex-1'), [regionLower])

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
    [name, handleBackPress, rightIcon, handleFavoritePress, shareIcon, shareIconOnPress],
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
      ? 'ca-app-pub-4123130377375974/3677410537'
      : 'ca-app-pub-4123130377375974/8669334024'
  }, [])

  return !airportData ? (
    <FullScreenLoading />
  ) : (
    <SafeLayout className={safeAreaClassName}>
      <Header {...headerProps} />

      <ScrollView {...scrollViewProps}>
        <Tabs.Container {...tabsContainerProps}>
          {tabRoutes().map((route, index) => {
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
