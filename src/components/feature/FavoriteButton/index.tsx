import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React, { memo, useMemo } from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { FavoriteItemType } from '@/types/feature/favorite'

interface FavoriteButtonProps extends FavoriteItemType {
  hapticFeedback?: boolean
}

const FavoriteButtonComponent = ({ hapticFeedback = true, id, type }: FavoriteButtonProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { handleFavoritePress, isFavorite, isPending } = useFavoriteToggle({ id, type })

  const handlePress = () => {
    if (isPending) return

    if (hapticFeedback) {
      if (isFavorite) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }
    }

    handleFavoritePress()
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="bg-background-quaternary p-2 rounded-full overflow-hidden absolute top-2 right-2"
      disabled={isPending}
      hitSlop={20}
      onPress={handlePress}
      testID="favorite-button"
    >
      {isPending ? (
        <ActivityIndicator color={colors?.tertiary100} size="small" testID="activity-indicator" />
      ) : (
        <MaterialCommunityIcons
          color={isFavorite ? colors?.tertiary100 : colors?.onPrimary100}
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={20}
        />
      )}
    </TouchableOpacity>
  )
}

export const FavoriteButton = memo(FavoriteButtonComponent)
