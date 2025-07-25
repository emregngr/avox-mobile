import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { ScrollView, View } from 'react-native'

import { Header, SafeLayout, ThemedText } from '@/components/common'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import type { BreakingNew } from '@/types/feature/home'

export default function BreakingNewDetail() {
  const params = useLocalSearchParams()
  const { item } = params as { item: string }

  const itemData = useMemo(() => JSON.parse(item) as BreakingNew, [item])

  const { description, image, title } = itemData
  const { selectedTheme } = useThemeStore()

  const indicatorStyle = useMemo(
    () => (selectedTheme === 'light' ? 'black' : 'white'),
    [selectedTheme],
  )

  const imageStyle = useMemo(
    () => ({
      borderRadius: 12,
      height: 256,
      width: '100%' as const,
    }),
    [],
  )

  const handleBackPress = useCallback(() => {
    router?.back()
  }, [])

  return (
    <SafeLayout>
      <Header leftIconOnPress={handleBackPress} title={getLocale('breakingNewDetailTitle')} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-5 pb-20 px-4"
        indicatorStyle={indicatorStyle}
      >
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          source={{ uri: image }}
          style={imageStyle}
          transition={0}
        />

        <View className="mt-5">
          <ThemedText className="mb-3" color="text-100" type="h3">
            {title}
          </ThemedText>

          <ThemedText color="text-90" type="body1">
            {description}
          </ThemedText>
        </View>
      </ScrollView>
    </SafeLayout>
  )
}
