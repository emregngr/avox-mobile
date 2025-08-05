import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Platform, ScrollView, View } from 'react-native'
import { TestIds } from 'react-native-google-mobile-ads'

import { Header, SafeLayout, ThemedText } from '@/components/common'
import { AdBanner } from '@/components/feature'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import type { BreakingNews } from '@/types/feature/home'

const STATIC_STYLES = {
  image: {
    borderRadius: 12,
    height: 256,
    width: '100%' as const,
  },
}

export default function BreakingNewsDetail() {
  const { item } = useLocalSearchParams() as { item: string }

  const itemData = useMemo(() => JSON.parse(item) as BreakingNews, [item])

  const { description, image, title } = itemData ?? {}

  const { selectedTheme } = useThemeStore()

  const indicatorStyle = useMemo(
    () => (selectedTheme === 'dark' ? 'white' : 'black'),
    [selectedTheme],
  )

  const handleBackPress = useCallback(() => {
    router?.back()
  }, [])

  const adUnitId = useMemo(() => {
    if (__DEV__) {
      return TestIds.BANNER
    }
    return Platform.OS === 'ios'
      ? 'ca-app-pub-4123130377375974/8155997003'
      : 'ca-app-pub-4123130377375974/6016918825'
  }, [])

  return (
    <SafeLayout>
      <Header backIconOnPress={handleBackPress} title={getLocale('breakingNewsDetailTitle')} />

      <ScrollView contentContainerClassName="pt-5 pb-20 px-4" indicatorStyle={indicatorStyle}>
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

      <AdBanner adUnitId={adUnitId} />
    </SafeLayout>
  )
}
