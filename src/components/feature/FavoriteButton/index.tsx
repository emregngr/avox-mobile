import { Ionicons } from '@expo/vector-icons'
import React, { memo, useMemo } from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { FavoriteItem } from '@/types/feature/favorite'

const FavoriteButtonComponent = ({ id, type }: FavoriteItem) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { handleFavoritePress, isFavorite, isPending } = useFavoriteToggle({ id, type })

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="bg-background-quaternary p-2 rounded-full overflow-hidden absolute top-2 right-2"
      disabled={isPending}
      hitSlop={20}
      onPress={handleFavoritePress}
    >
      {isPending ? (
        <ActivityIndicator color={colors?.tertiary100} size="small" />
      ) : (
        <Ionicons
          color={isFavorite ? colors?.tertiary100 : colors?.onPrimary100}
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={20}
        />
      )}
    </TouchableOpacity>
  )
}

export const FavoriteButton = memo(FavoriteButtonComponent)
