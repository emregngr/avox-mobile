import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { memo, useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { FavoriteButton } from '@/components/feature/FavoriteButton'
import { getLocale } from '@/locales/i18next'
import type { Airline } from '@/types/feature/airline'
import type { AirlineType } from '@/utils/feature/getBadge'
import { getAirlineBadge } from '@/utils/feature/getBadge'

interface HomeAirlineCardProps {
  airline: Airline
}

export const HomeAirlineCard = memo(({ airline }: HomeAirlineCardProps) => {
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
  } = airline || {}

  const badge = useMemo(() => getAirlineBadge(businessType as AirlineType), [businessType])

  const handlePress = useCallback(() => {
    router.navigate({
      params: {
        airline: JSON.stringify(airline),
      },
      pathname: '/airline-detail',
    })
  }, [airline])

  const locationText = useMemo(() => `${city}, ${country}, ${region}`, [city, country, region])

  const badgeImageStyle = useMemo(
    () => ({
      bottom: 4,
      height: 40,
      left: 4,
      position: 'absolute' as const,
      width: 40,
    }),
    [],
  )

  const titleContainerStyle = useMemo(
    () => ({
      height: 130,
    }),
    [],
  )

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

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={classNames.container}
      hitSlop={20}
      onPress={handlePress}
    >
      <View className={classNames.header} style={titleContainerStyle}>
        <ThemedText color="tertiary-100" type="title" center>
          {iataCode}
        </ThemedText>

        <Image
          cachePolicy="memory-disk"
          contentFit="contain"
          source={badge}
          style={badgeImageStyle}
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
