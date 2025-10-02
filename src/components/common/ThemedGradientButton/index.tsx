import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { type ReactNode, useMemo } from 'react'
import type { TouchableOpacityProps } from 'react-native'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'

type GradientColors = [string, string, ...string[]]

interface ThemedGradientButtonProps extends Omit<TouchableOpacityProps, 'className'> {
  className?: string
  customGradientColors?: GradientColors
  customLabelColor?: string
  disabled?: boolean
  gradientEnd?: { x: number; y: number }
  gradientStart?: { x: number; y: number }
  hapticFeedback?: boolean
  hapticType?: 'light' | 'medium' | 'heavy'
  icon?: ReactNode
  label: string
  loading?: boolean
  onPress: () => void
  type?: 'primary' | 'secondary' | 'custom'
}

const STYLES = {
  linearGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
  } as const,
}

export const ThemedGradientButton = ({
  className = '',
  customGradientColors,
  customLabelColor = 'text-100',
  disabled = false,
  gradientEnd = { x: 1, y: 0 },
  gradientStart = { x: 0, y: 0 },
  hapticFeedback = true,
  hapticType = 'medium',
  icon = null,
  label,
  loading = false,
  onPress,
  type = 'primary',
  ...rest
}: ThemedGradientButtonProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const disabledColors: GradientColors = [
    colors?.background?.tertiary,
    colors?.background?.quaternary,
  ]
  const primaryColors: GradientColors = [colors?.primaryGradientStart, colors?.primaryGradientEnd]
  const secondaryColors: GradientColors = [
    colors?.secondaryGradientStart,
    colors?.secondaryGradientEnd,
  ]

  const getActiveOpacity = (): number => {
    switch (type) {
      case 'primary':
        return 0.7
      case 'secondary':
        return 0.7
      case 'custom':
        return 0.7
      default:
        return 0.7
    }
  }

  const getGradientColors = (): GradientColors => {
    if (disabled) return disabledColors

    switch (type) {
      case 'primary':
        return primaryColors
      case 'secondary':
        return secondaryColors
      case 'custom':
        return customGradientColors as GradientColors
      default:
        return primaryColors
    }
  }

  const getLabelColor = (): string => {
    if (disabled) return 'text-50'

    switch (type) {
      case 'custom':
        return customLabelColor
      default:
        return 'text-100'
    }
  }

  const getHapticStyle = () => {
    switch (hapticType) {
      case 'light':
        return Haptics.ImpactFeedbackStyle.Light
      case 'medium':
        return Haptics.ImpactFeedbackStyle.Medium
      case 'heavy':
        return Haptics.ImpactFeedbackStyle.Heavy
      default:
        return Haptics.ImpactFeedbackStyle.Medium
    }
  }

  const handlePress = () => {
    if (disabled || loading) return

    if (hapticFeedback) {
      Haptics.impactAsync(getHapticStyle())
    }

    onPress()
  }

  return (
    <View className="overflow-hidden rounded-xl">
      <TouchableOpacity
        activeOpacity={getActiveOpacity()}
        className={cn(className)}
        disabled={disabled || loading}
        hitSlop={20}
        onPress={handlePress}
        {...rest}
      >
        <LinearGradient
          colors={getGradientColors()}
          end={gradientEnd}
          start={gradientStart}
          style={STYLES.linearGradient}
        >
          {loading ? (
            <ActivityIndicator
              color={colors?.onPrimary100}
              size="large"
              testID="activity-indicator"
            />
          ) : (
            <>
              {icon ? <View className="mr-2 pointer-events-none">{icon}</View> : null}
              <ThemedText color={getLabelColor()} type="button1">
                {label}
              </ThemedText>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}
