import { Zoomable } from '@likashefqet/react-native-image-zoom'
import { Image } from 'expo-image'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import Close from '@/assets/icons/close'
import { SafeLayout, ThemedText } from '@/components/common'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { RegionKey } from '@/types/feature/region'
import { setSystemColors } from '@/utils/common/setSystemColors'
import type { ImageType } from '@/utils/feature/getAirplaneImage'
import { getAirplaneImageSource } from '@/utils/feature/getAirplaneImage'

export default function ImageModal() {
  const params = useLocalSearchParams()
  const { regionLower, selectedImageKey, title } = params

  const selectedImage = selectedImageKey
    ? getAirplaneImageSource(selectedImageKey as ImageType)
    : null

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
      <GestureHandlerRootView className="flex-1 bg-background-primary">
        <View className="flex-row items-center justify-between p-4 z-10 bg-background-primary">
          <View className="flex-1 ml-10 mr-4">
            <ThemedText
              color="text-100" ellipsizeMode="tail" numberOfLines={2}
              type="h3" center
            >
              {title}
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

        <Zoomable
          doubleTapScale={3}
          maxScale={5}
          minScale={1}
          pointerEvents="box-none"
          style={{ flex: 1, width: '100%' }}
          isDoubleTapEnabled
          isSingleTapEnabled
        >
          <Image
            cachePolicy="memory-disk"
            contentFit="contain"
            source={selectedImage}
            style={{ flex: 1, width: '100%' }}
            transition={0}
          />
        </Zoomable>
      </GestureHandlerRootView>
    </SafeLayout>
  )
}
