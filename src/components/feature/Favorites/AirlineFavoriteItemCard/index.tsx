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
import { responsive } from '@/utils/common/responsive'
import type { AirlineType } from '@/utils/feature/getBadge'
import { getAirlineBadge } from '@/utils/feature/getBadge'

interface AirlineFavoriteItemCardProps {
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
  containerWidth: {
    width: responsive.deviceWidth / 2 - 44,
  },
  title: {
    height: 130,
  },
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
  } = airline ?? {}

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

  const badge = useMemo(() => getAirlineBadge(businessType as AirlineType), [businessType])

  const locationText = useMemo(() => `${city}, ${country}, ${region}`, [city, country, region])

  const popularDestinations = useMemo(() => destinations?.slice(0, 4).join(', '), [destinations])

  const cargoLabel = useMemo(
    () =>
      businessModel === 'cargo' ? (
        <View className="bg-error px-2 py-1 rounded-xl overflow-hidden absolute top-2 left-2">
          <ThemedText color="text-100" type="button2">
            {localeStrings.cargo}
          </ThemedText>
        </View>
      ) : null,
    [businessModel, localeStrings],
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
      className="bg-background-secondary rounded-xl mb-4 w-[48%] border border-background-quaternary shadow shadow-background-quaternary"
      hitSlop={20}
      onPress={onCardPress}
    >
      <View
        className="bg-background-primary rounded-t-xl overflow-hidden w-full justify-center"
        style={STATIC_STYLES.title}
      >
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

        <View className="bg-primary-100 px-2 py-1 rounded-xl overflow-hidden absolute bottom-2 right-2">
          <ThemedText color="text-100" type="button2">
            {iataCode}
          </ThemedText>
        </View>

        {cargoLabel}

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
            {locationText}
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
          style={STATIC_STYLES.containerWidth}
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
