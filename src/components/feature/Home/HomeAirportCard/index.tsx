import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { memo, useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { FavoriteButton } from '@/components/feature/FavoriteButton'
import type { Airport } from '@/types/feature/airport'
import getAirportImage from '@/utils/feature/getAirportImage'
import type { AirportType } from '@/utils/feature/getBadge'
import { getAirportBadge } from '@/utils/feature/getBadge'

interface HomeAirportCardProps {
  airport: Airport
}

export const HomeAirportCard = memo(({ airport }: HomeAirportCardProps) => {
  const {
    iataCode,
    icaoCode,
    id,
    name,
    operations: {
      airportType,
      country,
      location: { city },
      region,
    },
  } = airport || {}

  const images = useMemo(() => {
    const airportImage = getAirportImage(airportType as AirportType)
    const airportBadge = getAirportBadge(airportType as AirportType)

    return {
      airportBadge,
      airportImage,
    }
  }, [airportType])

  const handlePress = useCallback(() => {
    router.navigate({
      params: {
        airport: JSON.stringify(airport),
      },
      pathname: '/airport-detail',
    })
  }, [airport])

  const locationText = useMemo(() => `${city}, ${country}, ${region}`, [city, country, region])

  const styles = useMemo(
    () => ({
      badgeImage: {
        height: 40,
        left: 4,
        position: 'absolute' as const,
        top: 4,
        width: 40,
      },
      mainImage: {
        height: 130,
        width: '100%' as const,
      },
    }),
    [],
  )

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

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={classNames.container}
      hitSlop={20}
      onPress={handlePress}
    >
      <View className={classNames.imageContainer}>
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          source={images.airportImage}
          style={styles.mainImage}
          transition={0}
        />

        <Image
          cachePolicy="memory-disk"
          contentFit="contain"
          source={images.airportBadge}
          style={styles.badgeImage}
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

        <FavoriteButton id={String(id)} type="airport" />
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
