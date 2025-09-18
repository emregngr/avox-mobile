import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useCallback, useMemo } from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'

import { ThemedButtonText } from '@/components/common/ThemedButtonText'
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
  testID?: string
}

export const CheckboxField = ({
  control,
  disabled = false,
  error,
  labelKey,
  name,
  onPressLabel,
  testID,
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
              testID={testID || 'checkbox'}
            >
              <MaterialCommunityIcons
                color={getCheckboxColor(error, value)}
                name={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
              />
            </TouchableOpacity>
          )}
          control={control}
          name={name}
        />

        <ThemedButtonText
          containerStyle="flex-1 ml-3"
          hitSlop={10}
          label={getLocale(labelKey)}
          onPress={onPressLabel as () => void}
          textColor="text-100"
          textStyle="underline"
          type="body1"
        />
      </View>

      {error ? (
        <ThemedText className="mt-1 ml-12" color="error" type="body2">
          {error}
        </ThemedText>
      ) : null}
    </View>
  )
}
