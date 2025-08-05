import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { memo, useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airplane } from '@/types/feature/airline'
import { cn } from '@/utils/common/cn'
import { getAirplaneImageKey, getAirplaneImageSource } from '@/utils/feature/getAirplaneImage'

interface AirplaneRowCardProps {
  airplane: Airplane
  onImagePress: (type: string, image: string) => void
  region: string
  totalAirplane: number
}

const STATIC_STYLES = {
  image: {
    height: '100%' as const,
    width: '100%' as const,
  },
}

export const AirplaneRowCard = memo(
  ({ airplane, onImagePress, region, totalAirplane }: AirplaneRowCardProps) => {
    const { selectedLocale } = useLocaleStore()
    const { selectedTheme } = useThemeStore()

    const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

    const { bodyType, capacitySeats, capacityTons, count, rangeKm, speedKmh, type } = airplane ?? {}

    const percentage: string = useMemo(
      () => ((count / totalAirplane) * 100).toFixed(0),
      [count, totalAirplane],
    )

    const imageKey = useMemo(() => getAirplaneImageKey(type), [type])
    const imageSource = useMemo(() => getAirplaneImageSource(imageKey), [imageKey])

    const handleImagePress = useCallback(() => {
      onImagePress(type, imageKey)
    }, [type, imageKey, onImagePress])

    const localeStrings = useMemo(
      () => ({
        count: getLocale('count'),
        km: getLocale('km'),
        kmh: getLocale('kmh'),
        person: getLocale('person'),
        ton: getLocale('ton'),
      }),
      [selectedLocale],
    )

    const bodyTypeValue = useMemo((): string => {
      if (bodyType === 'narrow_body') {
        return getLocale('narrowBody')
      } else if (bodyType === 'wide_body') {
        return getLocale('wideBody')
      }

      return bodyType?.replace('-', ' ')
    }, [bodyType, selectedLocale])

    return (
      <View className="mb-4 p-4 rounded-xl overflow-hidden bg-background-secondary">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-[60px] h-[60px] rounded-xl overflow-hidden"
            hitSlop={20}
            onPress={handleImagePress}
          >
            <Image
              cachePolicy="memory-disk"
              contentFit="cover"
              source={imageSource}
              style={STATIC_STYLES.image}
              transition={0}
            />
          </TouchableOpacity>

          <View className="flex-1 ml-3">
            <ThemedText
              className="mb-1"
              color="text-100"
              lineBreakMode="tail"
              numberOfLines={2}
              type="body1"
            >
              {type}
            </ThemedText>

            <View className="px-2.5 py-1 rounded-xl overflow-hidden self-start mt-1 bg-background-tertiary">
              <ThemedText className="capitalize" color="text-90" type="body4">
                {bodyTypeValue}
              </ThemedText>
            </View>
          </View>

          <View className="px-4 py-2.5 rounded-xl overflow-hidden items-center bg-background-tertiary">
            <ThemedText color="text-100" type="h2">
              {count}
            </ThemedText>

            <ThemedText color="text-90" type="body4">
              {localeStrings.count}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row justify-evenly py-3 mb-3">
          <View className="flex-row items-center">
            <Ionicons color={colors.onPrimary70} name="speedometer" size={16} />

            <ThemedText className="mx-1" color="text-100" type="body2">
              {speedKmh}
            </ThemedText>

            <ThemedText color="text-70" type="body2">
              {localeStrings.kmh}
            </ThemedText>
          </View>

          <View className="flex-row items-center">
            <Ionicons color={colors.onPrimary70} name="navigate" size={16} />

            <ThemedText className="mx-1" color="text-100" type="body2">
              {(rangeKm / 1000).toFixed(1)}k
            </ThemedText>

            <ThemedText color="text-70" type="body2">
              {localeStrings.km}
            </ThemedText>
          </View>

          {capacitySeats ? (
            <View className="flex-row items-center">
              <Ionicons color={colors.onPrimary70} name="person" size={16} />

              <ThemedText className="mx-1" color="text-100" type="body2">
                {capacitySeats}
              </ThemedText>

              <ThemedText color="text-70" type="body2">
                {localeStrings.person}
              </ThemedText>
            </View>
          ) : null}

          {capacityTons ? (
            <View className="flex-row items-center">
              <Ionicons color={colors.onPrimary70} name="cube" size={16} />

              <ThemedText className="mx-1" color="text-100" type="body2">
                {capacityTons}
              </ThemedText>

              <ThemedText color="text-70" type="body2">
                {localeStrings.ton}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View className="h-6 rounded-xl overflow-hidden relative bg-background-tertiary">
          <View
            className={cn(`bg-${region?.toLowerCase()}`, 'h-full rounded-l-xl overflow-hidden')}
            style={{ width: `${percentage}%` as any }}
          />

          <View className="absolute inset-0 justify-center items-center z-10">
            <ThemedText color="text-100" type="body3">
              {percentage}%
            </ThemedText>
          </View>
        </View>
      </View>
    )
  },
)
