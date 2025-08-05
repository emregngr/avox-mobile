import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { memo, useCallback, useMemo } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import { TestIds } from 'react-native-google-mobile-ads'

import { ThemedText } from '@/components/common/ThemedText'
import { FavoriteButton } from '@/components/feature/FavoriteButton'
import { useInterstitialAdHandler } from '@/hooks/advertisement/useInterstitialAdHandler'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airline } from '@/types/feature/airline'
import { AnalyticsService } from '@/utils/common/analyticsService'
import type { AirlineType } from '@/utils/feature/getBadge'
import { getAirlineBadge } from '@/utils/feature/getBadge'

interface HomeAirlineCardProps {
  airline: Airline
}

const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
    ? 'ca-app-pub-4123130377375974/1756124081'
    : 'ca-app-pub-4123130377375974/2330839152'

const STATIC_STYLES = {
  badge: {
    bottom: 4,
    height: 40,
    left: 4,
    position: 'absolute' as const,
    width: 40,
  },
  title: {
    height: 130,
  },
}

export const HomeAirlineCard = memo(({ airline }: HomeAirlineCardProps) => {
  const { selectedLocale } = useLocaleStore()

  const {
    iataCode,
    icaoCode,
    id,
    name,
    operations: {
      businessModel,
      businessType,
      country,
      hub: { city },
      region,
    },
  } = airline ?? {}

  const badge = useMemo(() => getAirlineBadge(businessType as AirlineType), [businessType])

  const locationText = useMemo(() => `${city}, ${country}, ${region}`, [city, country, region])

  const classNames = useMemo(
    () => ({
      cargoContainer: 'bg-error px-2 py-1 rounded-xl overflow-hidden absolute top-2 left-2',
      container:
        'w-36 mb-4 bg-background-secondary rounded-xl border border-background-quaternary shadow shadow-background-quaternary',
      content: 'px-3 py-3',
      contentInner: 'h-28 justify-between',
      header:
        'bg-background-primary rounded-t-xl overflow-hidden w-full justify-center overflow-hidden',
      icaoCodeContainer:
        'bg-primary-100 px-2 py-1 rounded-xl overflow-hidden absolute bottom-2 right-2',
      locationText: 'mt-1',
    }),
    [],
  )

  const cargoLabel = useMemo(
    () =>
      businessModel === 'cargo' ? (
        <View className={classNames.cargoContainer}>
          <ThemedText color="text-100" type="body3">
            {getLocale('cargo')}
          </ThemedText>
        </View>
      ) : null,
    [businessModel, classNames.cargoContainer],
  )

  const logAirlineCardPress = useCallback(async () => {
    await AnalyticsService.sendEvent('airline_card_press', {
      airline_id: id,
      airline_name: name,
      iata_code: iataCode,
      user_locale: selectedLocale,
    })
  }, [id, name, iataCode, selectedLocale])

  const handlePress = useCallback(() => {
    router.navigate({
      params: {
        airline: JSON.stringify(airline),
      },
      pathname: '/airline-detail',
    })
  }, [airline])

  const { showInterstitialAd } = useInterstitialAdHandler({
    adUnitId: AD_UNIT_ID,
  })

  const onCardPress = useCallback(() => {
    logAirlineCardPress()
    handlePress()
    showInterstitialAd()
  }, [logAirlineCardPress, handlePress, showInterstitialAd])

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={classNames.container}
      hitSlop={20}
      onPress={onCardPress}
    >
      <View className={classNames.header} style={STATIC_STYLES.title}>
        <ThemedText color="tertiary-100" type="title" center>
          {iataCode}
        </ThemedText>

        <Image
          cachePolicy="memory-disk"
          contentFit="contain"
          source={badge}
          style={STATIC_STYLES.badge}
          transition={0}
        />

        <View className={classNames.icaoCodeContainer}>
          <ThemedText color="text-100" type="button2">
            {icaoCode}
          </ThemedText>
        </View>

        {cargoLabel}

        <FavoriteButton id={String(id)} type="airline" />
      </View>

      <View className={classNames.content}>
        <View className={classNames.contentInner}>
          <ThemedText
            color="text-100" ellipsizeMode="tail" numberOfLines={2}
            type="body3"
          >
            {name}
          </ThemedText>

          <ThemedText
            className={classNames.locationText}
            color="text-90"
            ellipsizeMode="tail"
            numberOfLines={2}
            type="body3"
          >
            {locationText}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  )
})

HomeAirlineCard.displayName = 'HomeAirlineCard'
