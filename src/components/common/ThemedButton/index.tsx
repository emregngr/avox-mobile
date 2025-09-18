import * as Haptics from 'expo-haptics'
import type { ReactNode } from 'react'
import React from 'react'
import type { TouchableOpacityProps } from 'react-native'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { cn } from '@/utils/common/cn'

interface ThemedButtonProps extends Omit<TouchableOpacityProps, 'className'> {
  className?: string
  disabled?: boolean
  hapticFeedback?: boolean
  hapticType?: 'light' | 'medium' | 'heavy'
  icon?: ReactNode
  label: string
  loading?: boolean
  onPress: () => void
  type?: 'normal' | 'border' | 'social' | 'danger'
}

export const ThemedButton = ({
  className = '',
  disabled = false,
  hapticFeedback = true,
  hapticType = 'medium',
  icon = null,
  label,
  loading = false,
  onPress,
  type = 'normal',
  ...rest
}: ThemedButtonProps) => {
  const buttonClasses: Record<string, { activeOpacity: number; className: string }> = {
    border: {
      activeOpacity: 1,
      className: cn(
        disabled ? 'bg-background-quaternary' : 'bg-background-primary',
        'border border-onPrimary-100 rounded-xl overflow-hidden',
      ),
    },
    danger: {
      activeOpacity: 0.7,
      className: cn(disabled ? 'bg-background-quaternary' : 'bg-error'),
    },
    normal: {
      activeOpacity: 0.7,
      className: cn(disabled ? 'bg-background-quaternary' : 'bg-primary-100'),
    },
    social: {
      activeOpacity: 0.7,
      className: cn(disabled ? 'bg-background-quaternary' : 'bg-onPrimary-100'),
    },
  }

  const labelColors: Record<string, string> = {
    border: disabled ? 'text-50' : 'text-100',
    danger: disabled ? 'text-50' : 'text-100',
    normal: disabled ? 'text-50' : 'text-100',
    social: disabled ? 'text-50' : 'background-primary',
  }

  const getHapticStyle = () => {
    if (type === 'danger') {
      return Haptics.ImpactFeedbackStyle.Heavy
    }

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
        className={cn(
          'h-14 flex-row justify-center items-center',
          buttonClasses?.[type]?.className,
          className,
        )}
        activeOpacity={buttonClasses?.[type]?.activeOpacity}
        disabled={disabled || loading}
        hitSlop={20}
        onPress={handlePress}
        testID="themed-button"
        {...rest}
      >
        {loading ? (
          <ActivityIndicator className="color-text-100" size="large" testID="activity-indicator" />
        ) : (
          <>
            {icon ? <View className="mr-2 pointer-events-none">{icon}</View> : null}
            <ThemedText color={labelColors[type] as string} type="button1">
              {label}
            </ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}
