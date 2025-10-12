import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import WebView from 'react-native-webview'

import { SafeLayout, ThemedText } from '@/components/common'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { GlassView } from 'expo-glass-effect'

const STATIC_STYLES = {
  closeIcon: {
    borderRadius: 20,
    padding: 8,
  },
}

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
            <ThemedText color="text-100" ellipsizeMode="tail" numberOfLines={2} type="h3">
              {title}
            </ThemedText>
          </View>
          <GlassView
            style={STATIC_STYLES.closeIcon}
            tintColor={colors?.background?.glass}
            glassEffectStyle="clear"
            isInteractive
          >
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={20}
              onPress={handleBackPress}
              testID="close-button"
            >
              <MaterialCommunityIcons name="close" size={20} color={colors?.onPrimary100} />
            </TouchableOpacity>
          </GlassView>
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
