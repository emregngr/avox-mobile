import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { memo, useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { FavoriteButton } from '@/components/feature/FavoriteButton'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airline } from '@/types/feature/airline'
import { responsive } from '@/utils/common/responsive'
import type { AirlineType } from '@/utils/feature/getBadge'
import { getAirlineBadge } from '@/utils/feature/getBadge'

interface AirlineFavoriteItemCardProps {
  airline: Airline
}

const AirlineFavoriteItemCard = memo(({ airline }: AirlineFavoriteItemCardProps) => {
  const { selectedLocale } = useLocaleStore()

  const {
    fleet: { totalAirplane },
    iataCode,
    icaoCode,
    id,
    name,
    network: { destinationCount, destinationCountries, destinations },
    operations: {
      businessModel,
      businessType,
      country,
      hub: { city },
      region,
      skytraxRating,
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

  const popularDestinations = useMemo(() => destinations?.slice(0, 4).join(', '), [destinations])

  const containerWidth = useMemo(() => responsive.deviceWidth / 2 - 44, [])

  const localeStrings = useMemo(
    () => ({
      airplane: getLocale('airplane'),
      cargo: getLocale('cargo'),
      country: getLocale('country'),
      popularRoutes: getLocale('popularRoutes'),
      rating: getLocale('rating'),
      route: getLocale('route'),
    }),
    [selectedLocale],
  )

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="bg-background-secondary rounded-xl mb-4 w-[48%] border border-background-quaternary shadow shadow-background-quaternary"
      hitSlop={20}
      onPress={handlePress}
    >
      <View
        className="bg-background-primary rounded-t-xl overflow-hidden w-full justify-center"
        style={{ height: 130 }}
      >
        <ThemedText
          className="mb-1" color="tertiary-100" type="title"
          center
        >
          {icaoCode}
        </ThemedText>

        <Image
          style={{
            bottom: 4,
            height: 40,
            left: 4,
            position: 'absolute',
            width: 40,
          }}
          cachePolicy="memory-disk"
          contentFit="contain"
          source={badge}
          transition={0}
        />

        <View className="bg-primary-100 px-2 py-1 rounded-xl overflow-hidden absolute bottom-2 right-2">
          <ThemedText color="text-100" type="button2">
            {iataCode}
          </ThemedText>
        </View>

        {businessModel === 'cargo' ? (
          <View className="bg-error px-2 py-1 rounded-xl overflow-hidden absolute top-2 left-2">
            <ThemedText color="text-100" type="button2">
              {localeStrings.cargo}
            </ThemedText>
          </View>
        ) : null}

        <FavoriteButton id={String(id)} type="airline" />
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
            color="text-100"
            ellipsizeMode="tail"
            numberOfLines={2}
            type="body2"
          >
            {city}, {country}, {region}
          </ThemedText>

          <View
            className={
              'bg-background-secondary rounded-xl p-2 shadow shadow-background-quaternary mt-2 border border-background-quaternary'
            }
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 items-center">
                <ThemedText className=" mb-1" color="text-100" type="h4">
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
                <ThemedText className=" mb-1" color="text-100" type="h4">
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
                  {totalAirplane}
                </ThemedText>
                <ThemedText
                  color="text-90" lineBreakMode="tail" numberOfLines={1}
                  type="body4"
                >
                  {localeStrings.airplane}
                </ThemedText>
              </View>

              <View className="w-[1px] h-6 bg-primary-100" />
              <View className="flex-1 items-center">
                <ThemedText className="mb-1" color="text-100" type="h4">
                  {skytraxRating}
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
          {localeStrings.popularRoutes}
        </ThemedText>

        <View
          className="bg-background-quaternary px-2 py-1 rounded-xl overflow-hidden mt-2"
          style={{ width: containerWidth }}
        >
          <View className="flex-row items-center px-1">
            <ThemedText
              color="text-90" ellipsizeMode="tail" numberOfLines={2}
              type="body4"
            >
              {popularDestinations}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
})

AirlineFavoriteItemCard.displayName = 'AirlineFavoriteItemCard'

export { AirlineFavoriteItemCard }
