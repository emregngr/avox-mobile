import type { ReactNode } from 'react'
import React from 'react'
import type { TouchableOpacityProps } from 'react-native'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { cn } from '@/utils/common/cn'

interface FallButtonProps extends Omit<TouchableOpacityProps, 'className'> {
  className?: string
  disabled?: boolean
  icon?: ReactNode
  label: string
  loading?: boolean
  type?: 'normal' | 'border' | 'social' | 'danger'
}

export const ThemedButton = ({
  className = '',
  disabled = false,
  icon = null,
  label,
  loading = false,
  type = 'normal',
  ...rest
}: FallButtonProps) => {
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

  const labelClasses: Record<string, string> = {
    border: disabled ? 'text-50' : 'text-100',
    danger: disabled ? 'text-50' : 'text-100',
    normal: disabled ? 'text-50' : 'text-100',
    social: disabled ? 'text-50' : 'background-primary',
  }

  const Button = () => (
    <View className="overflow-hidden rounded-xl">
      <TouchableOpacity
        className={cn(
          'w-full h-14 flex-row justify-center items-center',
          buttonClasses[type]?.className,
          className,
        )}
        activeOpacity={buttonClasses?.[type]?.activeOpacity}
        disabled={disabled || loading}
        hitSlop={20}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator className="color-text-100" size="large" />
        ) : (
          <>
            {icon ? <View className="mr-2 pointer-events-none">{icon}</View> : null}
            <ThemedText color={labelClasses[type] as string} type="button1">
              {label}
            </ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  )

  return <Button />
}
