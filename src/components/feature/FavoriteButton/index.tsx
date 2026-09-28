import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { memo, useMemo } from 'react'
import { ActivityIndicator, Platform, TouchableOpacity } from 'react-native'

import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { FavoriteItemType } from '@/types/feature/favorite'
import { GlassView } from 'expo-glass-effect'

interface FavoriteButtonProps extends FavoriteItemType {
  hapticFeedback?: boolean
}

const STATIC_STYLES = {
  container: {
    position: 'absolute' as const,
    top: 4,
    right: 4,
    borderRadius: 50,
    padding: 8,
  },
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

  const glassViewStyle = useMemo(
    () => ({
      ...STATIC_STYLES.container,
      ...((Platform.OS !== 'ios' ||
        (Platform.OS === 'ios' && parseInt(Platform.Version as string) < 26)) && {
        backgroundColor: colors?.background?.tertiary,
      }),
    }),
    [colors],
  )

  return (
    <GlassView
      style={glassViewStyle}
      tintColor={colors?.background?.glass}
      glassEffectStyle="clear"
      isInteractive
    >
      <TouchableOpacity
        activeOpacity={0.7}
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
    </GlassView>
  )
}

export const FavoriteButton = memo(FavoriteButtonComponent)
