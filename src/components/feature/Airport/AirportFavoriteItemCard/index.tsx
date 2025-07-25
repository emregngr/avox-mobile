import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { memo, useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { FavoriteButton } from '@/components/feature/FavoriteButton'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airport } from '@/types/feature/airport'
import { responsive } from '@/utils/common/responsive'
import getAirportImage from '@/utils/feature/getAirportImage'
import type { AirportType } from '@/utils/feature/getBadge'
import { getAirportBadge } from '@/utils/feature/getBadge'

interface AirportFavoriteItemCardProps {
  airport: Airport
}

export const AirportFavoriteItemCard = memo(({ airport }: AirportFavoriteItemCardProps) => {
  const { selectedLocale } = useLocaleStore()

  const {
    facilities: { googleMapsRating },
    flightOperations: { airlines = [], destinationCount, destinationCountries },
    iataCode,
    icaoCode,
    id,
    infrastructure: { passengerCapacity },
    name,
    operations: {
      airportType,
      country,
      location: { city },
      region,
    },
  } = airport || {}

  const image = useMemo(() => getAirportImage(airportType as AirportType), [airportType])
  const badge = useMemo(() => getAirportBadge(airportType as AirportType), [airportType])

  const handlePress = useCallback(() => {
    router.navigate({
      params: {
        airport: JSON.stringify(airport),
      },
      pathname: '/airport-detail',
    })
  }, [airport])

  const localeStrings = useMemo(
    () => ({
      country: getLocale('country'),
      passenger: getLocale('passenger'),
      popularAirlines: getLocale('popularAirlines'),
      rating: getLocale('rating'),
      route: getLocale('route'),
    }),
    [selectedLocale],
  )

  const locationText = useMemo(() => `${city}, ${country}, ${region}`, [city, country, region])

  const airlinesText = useMemo(() => airlines?.map(airline => airline).join(', '), [airlines])

  const airlinesContainerWidth = useMemo(() => responsive.deviceWidth / 2 - 44, [])

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="bg-background-secondary rounded-xl mb-4 w-[48%] border border-background-quaternary shadow shadow-background-quaternary"
      hitSlop={20}
      onPress={handlePress}
    >
      <View className="rounded-t-xl overflow-hidden w-full justify-center">
        <Image
          style={{
            height: 130,
            width: '100%',
          }}
          cachePolicy="memory-disk"
          contentFit="cover"
          source={image}
          transition={0}
        />

        <Image
          style={{
            height: 40,
            left: 4,
            position: 'absolute',
            top: 4,
            width: 40,
          }}
          cachePolicy="memory-disk"
          contentFit="contain"
          source={badge}
          transition={0}
        />

        <View className="bg-primary-100 px-2 py-1 rounded-xl overflow-hidden absolute bottom-2 left-2">
          <ThemedText color="text-100" type="button2">
            {iataCode}
          </ThemedText>
        </View>

        <View className="bg-primary-100 px-2 py-1 rounded-xl overflow-hidden absolute bottom-2 right-2">
          <ThemedText color="text-100" type="button2">
            {icaoCode}
          </ThemedText>
        </View>

        <FavoriteButton id={String(id)} type="airport" />
      </View>

      <View className="px-3 py-3">
        <View className="h-56 justify-between">
          <ThemedText
            color="text-100" ellipsizeMode="tail" numberOfLines={2}
            type="h4"
          >
            {name}
          </ThemedText>

          <ThemedText
            className="mt-1"
            color="text-90"
            ellipsizeMode="tail"
            numberOfLines={2}
            type="body2"
          >
            {locationText}
          </ThemedText>

          <View
            className={
              'bg-background-secondary rounded-xl p-2 shadow shadow-background-quaternary mt-2 border border-background-quaternary'
            }
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 items-center">
                <ThemedText className="mb-1" color="text-100" type="h4">
                  {destinationCount}
                </ThemedText>
                <ThemedText
                  color="text-90" lineBreakMode="tail" numberOfLines={1}
                  type="body4"
                >
                  {localeStrings.route}
                </ThemedText>
              </View>

              <View className="w-[1px] h-6 bg-primary-100" />

              <View className="flex-1 items-center">
                <ThemedText className="mb-1" color="text-100" type="h4">
                  {destinationCountries}
                </ThemedText>
                <ThemedText
                  color="text-90" lineBreakMode="tail" numberOfLines={1}
                  type="body4"
                >
                  {localeStrings.country}
                </ThemedText>
              </View>
            </View>

            <View className="my-3 w-[100px] self-center flex flex-row justify-between">
              <View className="h-[1px] w-8 bg-primary-100" />
              <View className="h-[1px] w-8 bg-primary-100" />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1 items-center">
                <ThemedText className="mb-1" color="text-100" type="h4">
                  {passengerCapacity} m
                </ThemedText>
                <ThemedText
                  color="text-90" lineBreakMode="tail" numberOfLines={1}
                  type="body4"
                >
                  {localeStrings.passenger}
                </ThemedText>
              </View>

              <View className="w-[1px] h-6 bg-primary-100" />
              <View className="flex-1 items-center">
                <ThemedText className="mb-1" color="text-100" type="h4">
                  {googleMapsRating}
                </ThemedText>
                <ThemedText
                  color="text-90" lineBreakMode="tail" numberOfLines={1}
                  type="body4"
                >
                  {localeStrings.rating}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="h-20 px-3 mb-3">
        <ThemedText color="text-100" type="body3">
          {localeStrings.popularAirlines}
        </ThemedText>

        <View
          className="bg-background-quaternary px-2 py-1 rounded-xl overflow-hidden mt-2"
          style={{ width: airlinesContainerWidth }}
        >
          <View className="flex-row items-center px-1">
            <ThemedText
              color="text-90" ellipsizeMode="tail" numberOfLines={2}
              type="body4"
            >
              {airlinesText}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
})
