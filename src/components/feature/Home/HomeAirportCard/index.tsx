import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { memo, useCallback, useMemo } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { FavoriteButton } from '@/components/feature/FavoriteButton'
import { useInterstitialAdHandler } from '@/hooks/advertisement/useInterstitialAdHandler'
import useLocaleStore from '@/store/locale'
import type { AirportType } from '@/types/feature/airport'
import { AnalyticsService } from '@/utils/common/analyticsService'
import { getAirportImage } from '@/utils/feature/getAirportImage'
import type { AirportBadgeType } from '@/utils/feature/getBadge'
import { getAirportBadge } from '@/utils/feature/getBadge'

interface HomeAirportCardProps {
  airport: AirportType
}

const AD_UNIT_ID =
  Platform.OS === 'ios'
    ? 'ca-app-pub-4123130377375974/7531194946'
    : 'ca-app-pub-4123130377375974/8992450420'

const STATIC_STYLES = {
  badge: {
    height: 40,
    left: 4,
    position: 'absolute' as const,
    top: 4,
    width: 40,
  },
  image: {
    height: 130,
    width: '100%' as const,
  },
}

export const HomeAirportCard = memo(({ airport }: HomeAirportCardProps) => {
  const { selectedLocale } = useLocaleStore()

  const {
    iataCode,
    icaoCode,
    id,
    image,
    name,
    operations: {
      airportType,
      country,
      location: { city },
      region,
    },
  } = airport ?? {}

  const defaultImage = useMemo(
    () => getAirportImage(airportType as AirportBadgeType),
    [airportType],
  )

  const badge = useMemo(() => getAirportBadge(airportType as AirportBadgeType), [airportType])

  const locationText = useMemo(() => `${city}, ${country}, ${region}`, [city, country, region])

  const classNames = useMemo(
    () => ({
      container:
        'w-36 mb-4 bg-background-secondary rounded-xl border border-background-quaternary shadow shadow-background-quaternary',
      content: 'px-3 py-3',
      contentInner: 'h-28 justify-between',
      iataCodeContainer:
        'bg-primary-100 px-2 py-1 rounded-xl overflow-hidden absolute bottom-2 left-2',
      icaoCodeContainer:
        'bg-primary-100 px-2 py-1 rounded-xl overflow-hidden absolute bottom-2 right-2',
      imageContainer: 'rounded-t-xl w-full justify-center overflow-hidden',
      locationText: 'mt-1',
    }),
    [],
  )

  const logAirportCardPress = useCallback(async () => {
    await AnalyticsService.sendEvent('airport_card_press', {
      airline_id: id,
      airline_name: name,
      iata_code: iataCode,
      user_locale: selectedLocale,
    })
  }, [id, name, iataCode, selectedLocale])

  const handlePress = useCallback(() => {
    router.navigate({
      params: {
        airport: JSON.stringify(airport),
      },
      pathname: '/airport-detail',
    })
  }, [airport])

  const { showInterstitialAd } = useInterstitialAdHandler({
    adUnitId: AD_UNIT_ID,
  })

  const onCardPress = useCallback(() => {
    logAirportCardPress()
    handlePress()
    showInterstitialAd()
  }, [logAirportCardPress, handlePress, showInterstitialAd])

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={classNames.container}
      hitSlop={20}
      onPress={onCardPress}
    >
      <View className={classNames.imageContainer}>
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          source={image || defaultImage}
          style={STATIC_STYLES.image}
          transition={0}
        />

        <Image
          cachePolicy="memory-disk"
          contentFit="contain"
          source={badge}
          style={STATIC_STYLES.badge}
          transition={0}
        />

        <View className={classNames.iataCodeContainer}>
          <ThemedText color="text-100" type="button2">
            {iataCode}
          </ThemedText>
        </View>

        <View className={classNames.icaoCodeContainer}>
          <ThemedText color="text-100" type="button2">
            {icaoCode}
          </ThemedText>
        </View>

        <FavoriteButton id={id} type="airport" />
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

HomeAirportCard.displayName = 'HomeAirportCard'
