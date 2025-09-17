import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

interface EmptyFavoriteProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  text: string
}

export const EmptyFavorite = ({ icon, text }: EmptyFavoriteProps) => {
  const { bottom } = useSafeAreaInsets()

  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  return (
    <View
      className="flex-1 items-center justify-center mt-[52px] px-4"
      style={{ marginBottom: bottom + 60 }}
      testID="EmptyFavoriteContainer"
    >
      <View className="bg-background-secondary p-6 rounded-full overflow-hidden mb-6">
        <MaterialCommunityIcons color={colors?.onPrimary100} name={icon} size={64} />
      </View>

      <ThemedText color="text-100" type="h1" center>
        {text}
      </ThemedText>
    </View>
  )
}
