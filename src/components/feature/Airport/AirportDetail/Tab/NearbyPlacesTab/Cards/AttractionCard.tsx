import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

interface AttractionCardProps {
  attractionId: number
  attractionName: string
  description: string
  formattedDistance: string
  getDirectionText: string
  handleDirectionPress: () => void
}

export const AttractionCard = ({
  attractionId,
  attractionName,
  description,
  formattedDistance,
  getDirectionText,
  handleDirectionPress,
}: AttractionCardProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = themeColors?.[selectedTheme]

  return (
    <View
      className="p-4 rounded-xl overflow-hidden flex-row justify-between items-center bg-background-secondary"
      key={attractionId}
    >
      <View className="w-[70px] h-[80px] items-center justify-between">
        <View className="w-10 h-10 rounded-full overflow-hidden bg-background-tertiary items-center justify-center">
          <Ionicons color={colors?.onPrimary100} name="location" size={24} />
        </View>

        <View className="px-2.5 py-1 rounded-xl overflow-hidden flex-row items-center bg-background-tertiary">
          <Ionicons color={colors?.onPrimary100} name="car" size={14} />
          <ThemedText className="ml-1" color="text-90" type="body3">
            {formattedDistance}
          </ThemedText>
        </View>
      </View>

      <View className="flex-1 ml-4">
        <ThemedText
          className="mb-2"
          color="text-100"
          ellipsizeMode="tail"
          numberOfLines={1}
          type="body1"
        >
          {attractionName}
        </ThemedText>

        <ThemedText
          className="mb-2"
          color="text-70"
          ellipsizeMode="tail"
          numberOfLines={5}
          type="body2"
        >
          {description}
        </ThemedText>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center self-end px-2.5 py-2 rounded-xl overflow-hidden bg-background-quaternary"
          hitSlop={20}
          onPress={handleDirectionPress}
        >
          <Ionicons color={colors?.onPrimary100} name="location" size={14} />
          <ThemedText className="ml-1" color="text-90" type="body3">
            {getDirectionText}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  )
}
