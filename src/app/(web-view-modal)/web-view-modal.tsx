import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'
import WebView from 'react-native-webview'

import Close from '@/assets/icons/close'
import { SafeLayout, ThemedText } from '@/components/common'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { RegionKey } from '@/types/feature/region'
import { setSystemColors } from '@/utils/common/setSystemColors'

export default function ImageModal() {
  const params = useLocalSearchParams()
  const { regionLower, selectedWebsite, webViewUrl } = params

  const { selectedTheme } = useThemeStore()
  const colors = themeColors?.[selectedTheme]

  const handleBackPress = useCallback(() => {
    router?.back()
  }, [])

  useFocusEffect(
    useCallback(() => {
      setSystemColors(colors?.[regionLower as RegionKey], selectedTheme)
    }, [regionLower, colors, selectedTheme]),
  )

  return (
    <SafeLayout>
      <View className="flex-1 bg-background-primary">
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-1 mr-4">
            <ThemedText
              color="text-100" ellipsizeMode="tail" numberOfLines={2}
              type="h3"
            >
              {selectedWebsite}
            </ThemedText>
          </View>
          <TouchableOpacity activeOpacity={0.7} hitSlop={20} onPress={handleBackPress}>
            <Close
              height={24}
              primaryColor={colors?.background?.quaternary}
              secondaryColor={colors?.onPrimary100}
              width={24}
            />
          </TouchableOpacity>
        </View>

        <WebView
          originWhitelist={['*']}
          source={{ uri: webViewUrl as string }}
          style={{ flex: 1 }}
          allowsInlineMediaPlayback
          domStorageEnabled
          javaScriptEnabled
          scalesPageToFit
          startInLoadingState
          useWebKit
        />
      </View>
    </SafeLayout>
  )
}
