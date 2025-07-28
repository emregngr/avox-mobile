import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { memo, useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import type { BreakingNews } from '@/types/feature/home'
import { responsive } from '@/utils/common/responsive'

const itemWidth = responsive.deviceWidth

interface BreakingNewsCardProps {
  item: BreakingNews
}

export const BreakingNewsCard = memo(({ item }: BreakingNewsCardProps) => {
  const { image, title } = item || {}
  const imageSource = useMemo(() => ({ uri: image }), [image])

  const handlePress = useCallback(() => {
    router.navigate({
      params: {
        item: JSON.stringify(item),
      },
      pathname: '/breaking-news-detail',
    })
  }, [item])

  const dimensions = useMemo(
    () => ({
      cardWidth: itemWidth - 32,
      containerWidth: itemWidth,
    }),
    [],
  )

  return (
    <View className="items-center px-4" style={{ width: dimensions.containerWidth }}>
      <TouchableOpacity
        activeOpacity={0.7}
        className="h-64 rounded-xl overflow-hidden"
        hitSlop={20}
        onPress={handlePress}
        style={{ width: dimensions.cardWidth }}
      >
        <Image
          style={{
            height: '100%',
            width: '100%',
          }}
          cachePolicy="memory-disk"
          contentFit="cover"
          source={imageSource}
          transition={0}
        />
        <View className="absolute bottom-2 mx-3 bg-background-blur px-2 py-1 overflow-hidden rounded-xl">
          <ThemedText
            color="text-100" ellipsizeMode="tail" numberOfLines={3}
            type="h4"
          >
            {title}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  )
})

BreakingNewsCard.displayName = 'BreakingNewsCard'
