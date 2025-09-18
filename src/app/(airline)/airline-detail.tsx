import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Platform, ScrollView } from 'react-native'
import { Tabs } from 'react-native-collapsible-tab-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
import type { AirlineType } from '@/types/feature/airline'
import type { RegionKeyType } from '@/types/feature/region'
import { AnalyticsService } from '@/utils/common/analyticsService'
import { cn } from '@/utils/common/cn'
import { shareAirline } from '@/utils/common/linkingService'
import { setSystemColors } from '@/utils/common/setSystemColors'

const AD_UNIT_ID =
  Platform.OS === 'ios'
    ? 'ca-app-pub-4123130377375974/1937454469'
    : 'ca-app-pub-4123130377375974/9656162382'

export default function AirlineDetail() {
  const { bottom } = useSafeAreaInsets()

  const { airline, airlineId } = useLocalSearchParams() as { airline: string; airlineId: string }

  const { data: airlineByIdData } = useAirlineById(airlineId)

  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const airlineData = useMemo(() => {
    if (airlineId) {
      return airlineByIdData as AirlineType
    }

    if (airline) {
      return JSON.parse(airline) as AirlineType
    }

    return null
  }, [airlineByIdData, airline, airlineId])

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { id: currentAirlineId, name, operations } = airlineData ?? {}
  const { region } = operations ?? {}

  const regionLower = useMemo(() => region?.toLowerCase() as RegionKeyType, [region])

  const regionColor = useMemo(() => colors?.[regionLower as RegionKeyType], [colors, regionLower])

  useEffect(() => {
    setSystemColors(regionColor)
  }, [regionColor])

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const id = useMemo(() => currentAirlineId as string, [currentAirlineId])
  const type = useMemo(() => 'airline' as const, [])

  const { handleFavoritePress, isFavorite, isPending } = useFavoriteToggle({ id, type })

  const handleBackPress = useCallback(() => {
    setSystemColors(colors?.background?.primary)

    if (airlineId) {
      router.dismissAll()
      router.replace('/home')
    } else {
      router.back()
    }
  }, [colors, airlineId])

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

  const tabRoutes = useCallback(
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
        tabType="airline"
      />
    ),
    [regionLower, activeIndex],
  )

  const shareIconOnPress = useCallback(async () => {
    await shareAirline(airlineData as AirlineType)

    await AnalyticsService.sendEvent('airport_shared', {
      airport_id: airlineData?.id,
      airport_name: airlineData?.name,
      iata_code: airlineData?.iataCode,
      user_locale: selectedLocale,
    })
  }, [airlineData, selectedLocale])

  const shareIcon = useMemo(
    () => (
      <MaterialCommunityIcons color={colors.onPrimary100} name="share-variant-outline" size={20} />
    ),
    [colors.onPrimary100],
  )

  const rightIcon = useMemo(() => {
    if (isPending) {
      return <ActivityIndicator color={colors?.tertiary100} size="small" />
    }
    return (
      <MaterialCommunityIcons
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
      hapticFeedback: true,
      isFavorite,
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
      contentContainerStyle: { paddingBottom: bottom + 20 },
      showsVerticalScrollIndicator: false,
    }),
    [],
  )

  if (!airlineData) {
    return <FullScreenLoading />
  }

  return (
    <SafeLayout className={safeAreaClassName} testID="airline-detail-screen" topBlur={false}>
      <Header {...headerProps} />

      <ScrollView {...scrollViewProps}>
        <Tabs.Container {...tabsContainerProps}>
          {tabRoutes().map((route, index) => {
            const TabComponent = tabViews[index]
            return (
              <Tabs.Tab key={route.key} name={route.label}>
                <Tabs.ScrollView {...tabsScrollViewProps} testID="airline-detail-scroll-view">
                  {TabComponent ? <TabComponent /> : null}
                </Tabs.ScrollView>
              </Tabs.Tab>
            )
          })}
        </Tabs.Container>
      </ScrollView>

      <AdBanner adUnitId={AD_UNIT_ID} />
    </SafeLayout>
  )
}
