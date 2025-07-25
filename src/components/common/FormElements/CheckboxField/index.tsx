import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useMemo } from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Pressable, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

interface CheckboxFieldProps {
  control: Control<any>
  disabled?: boolean
  error?: string
  labelKey: string
  name: string
  onPressLabel?: () => void
}

export const CheckboxField = ({
  control,
  disabled = false,
  error,
  labelKey,
  name,
  onPressLabel,
}: CheckboxFieldProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const getCheckboxColor = useCallback(
    (error: any, value: boolean) => {
      if (error) return colors?.error
      if (value) return colors?.success
      return colors?.onPrimary100
    },
    [colors],
  )

  return (
    <View>
      <View className="flex-row items-center">
        <Controller
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              className="p-1"
              disabled={disabled}
              hitSlop={10}
              onPress={() => onChange(!value)}
            >
              <View className="relative">
                <Ionicons color={getCheckboxColor(error, value)} name="square-outline" size={24} />
                {value ? (
                  <Ionicons
                    className="absolute top-0.5 left-0.5"
                    color={colors?.success}
                    name="checkmark-sharp"
                    size={20}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          )}
          control={control}
          name={name}
        />

        <Pressable className="flex-1 ml-3" hitSlop={10} onPress={onPressLabel}>
          <ThemedText className="underline" color="text-100" type="body1">
            {getLocale(labelKey)}
          </ThemedText>
        </Pressable>
      </View>

      {error ? (
        <ThemedText className="mt-1 ml-12" color="error" type="body2">
          {error}
        </ThemedText>
      ) : null}
    </View>
  )
}
