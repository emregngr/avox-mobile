import { Zoomable } from '@likashefqet/react-native-image-zoom'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { SafeLayout, ThemedText } from '@/components/common'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { ImageKeyType } from '@/utils/feature/getAirplaneImage'
import { getAirplaneImageSource } from '@/utils/feature/getAirplaneImage'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { GlassView } from 'expo-glass-effect'

const STATIC_STYLES = {
  closeIcon: {
    borderRadius: 50,
    padding: 8,
  },
  image: {
    height: '100%' as const,
    width: '100%' as const,
  },
  imageContainer: {
    alignItems: 'center' as const,
    flex: 1,
    justifyContent: 'center' as const,
  },
  zoomableContainer: {
    flex: 1,
    width: '100%' as const,
  },
}

export default function ImageModal() {
  const { selectedImageKey, title } = useLocalSearchParams()

  const selectedImage = useMemo(
    () => (selectedImageKey ? getAirplaneImageSource(selectedImageKey as ImageKeyType) : null),
    [selectedImageKey],
  )

  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const handleBackPress = useCallback(() => {
    router?.back()
  }, [])

  const glassViewStyle = useMemo(
    () => ({
      ...STATIC_STYLES.closeIcon,
      ...((Platform.OS !== 'ios' ||
        (Platform.OS === 'ios' && parseInt(Platform.Version as string) < 26)) && {
        backgroundColor: colors?.background?.secondary,
      }),
    }),
    [colors],
  )

  return (
    <SafeLayout testID="image-modal-screen" topBlur={false}>
      <GestureHandlerRootView className="flex-1 bg-background-primary">
        <View className="flex-row items-center justify-between p-4 z-10 bg-transparent">
          <View className="flex-1 ml-10 mr-4">
            <ThemedText color="text-100" ellipsizeMode="tail" numberOfLines={2} type="h3" center>
              {title}
            </ThemedText>
          </View>
          <GlassView
            style={glassViewStyle}
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

        <Zoomable
          doubleTapScale={3}
          maxScale={5}
          minScale={1}
          pointerEvents="box-none"
          style={STATIC_STYLES.zoomableContainer}
          isDoubleTapEnabled
          isSingleTapEnabled
        >
          <View style={STATIC_STYLES.imageContainer}>
            <Image
              cachePolicy="memory-disk"
              contentFit="contain"
              source={selectedImage}
              style={STATIC_STYLES.image}
              transition={0}
            />
          </View>
        </Zoomable>
      </GestureHandlerRootView>
    </SafeLayout>
  )
}
