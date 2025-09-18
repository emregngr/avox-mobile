import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import WebView from 'react-native-webview'

import Close from '@/assets/icons/close'
import { SafeLayout, ThemedText } from '@/components/common'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

export default function WebViewModal() {
  const { title, webViewUrl } = useLocalSearchParams()

  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const handleBackPress = useCallback(() => {
    router?.back()
  }, [])

  return (
    <SafeLayout testID="web-view-modal-screen" topBlur={false}>
      <View className="flex-1 bg-background-primary">
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-1 mr-4">
            <ThemedText
              color="text-100" ellipsizeMode="tail" numberOfLines={2}
              type="h3"
            >
              {title}
            </ThemedText>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={20}
            onPress={handleBackPress}
            testID="close-button"
          >
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
