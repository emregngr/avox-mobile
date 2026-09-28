import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { FaqItemType } from '@/types/common/faq'

interface FaqItemProps {
  index: number
  isExpanded: boolean
  item: FaqItemType
  toggleExpanded: (index: number) => void
}

export const FaqItem = ({ index, isExpanded, item, toggleExpanded }: FaqItemProps) => {
  const { selectedTheme } = useThemeStore()
  const [contentHeight, setContentHeight] = useState<number>(0)

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { description, title } = item

  const heightProgress = useDerivedValue(() => {
    return isExpanded ? withTiming(contentHeight) : withTiming(0)
  }, [isExpanded, contentHeight])

  const opacityProgress = useDerivedValue(() => {
    return isExpanded ? withTiming(1) : withTiming(0)
  }, [isExpanded])

  const iconRotation = useDerivedValue(() => {
    return isExpanded ? withTiming('180deg') : withTiming('0deg')
  }, [isExpanded])

  const animatedBodyStyle = useAnimatedStyle(() => ({
    height: heightProgress.value,
    opacity: opacityProgress.value,
  }))

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: iconRotation.value }],
  }))

  return (
    <View className="mb-2">
      <TouchableOpacity
        activeOpacity={0.7}
        className="p-4 rounded-xl overflow-hidden bg-background-secondary z-10"
        hitSlop={10}
        onPress={() => toggleExpanded(index)}
        testID={`faq-${item?.id}`}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <ThemedText color="text-100" type="body1">
              {title}
            </ThemedText>
          </View>
          <Animated.View style={animatedIconStyle}>
            <MaterialCommunityIcons
              color={isExpanded ? colors?.onPrimary100 : colors?.onPrimary70}
              name="chevron-down"
              size={24}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Animated.View className="overflow-hidden" style={animatedBodyStyle}>
        <View
          className="absolute top-0 left-0 right-0"
          onLayout={(event) => {
            setContentHeight(event.nativeEvent.layout.height)
          }}
        >
          <View className="mt-2 p-4 rounded-xl overflow-hidden bg-background-tertiary">
            <ThemedText color="text-90" type="body2">
              {description}
            </ThemedText>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}
