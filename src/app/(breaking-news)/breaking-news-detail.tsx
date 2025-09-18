import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Platform, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header, SafeLayout, ThemedText } from '@/components/common'
import { AdBanner } from '@/components/feature'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import type { BreakingNewsType } from '@/types/feature/home'

const AD_UNIT_ID =
  Platform.OS === 'ios'
    ? 'ca-app-pub-4123130377375974/8155997003'
    : 'ca-app-pub-4123130377375974/6016918825'

const STATIC_STYLES = {
  image: {
    borderRadius: 12,
    height: 256,
    width: '100%' as const,
  },
}

export default function BreakingNewsDetail() {
  const { bottom, top } = useSafeAreaInsets()

  const { item } = useLocalSearchParams() as { item: string }

  const itemData = useMemo(() => JSON.parse(item) as BreakingNewsType, [item])

  const { description, image, title } = itemData ?? {}

  const { selectedTheme } = useThemeStore()

  const indicatorStyle = useMemo(
    () => (selectedTheme === 'dark' ? 'white' : 'black'),
    [selectedTheme],
  )

  const handleBackPress = useCallback(() => {
    router?.back()
  }, [])

  return (
    <SafeLayout testID="breaking-news-detail-screen">
      <Header
        backIconOnPress={handleBackPress}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        style={{ top }}
        title={getLocale('breakingNewsDetailTitle')}
      />

      <ScrollView
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 20, paddingTop: top + 64 }}
        indicatorStyle={indicatorStyle}
        testID="breaking-news-scroll-view"
      >
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          source={{ uri: image }}
          style={STATIC_STYLES.image}
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

      <AdBanner adUnitId={AD_UNIT_ID} />
    </SafeLayout>
  )
}
