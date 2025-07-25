import React, { memo, useCallback, useMemo } from 'react'
import { Switch, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

interface SwitchFilterProps {
  filterKey: string
  onToggle: (filterKey: string) => void
  title: string
  value: boolean
}

export const SwitchFilter = memo(({ filterKey, onToggle, title, value }: SwitchFilterProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const handleToggle = useCallback(() => {
    onToggle(filterKey)
  }, [onToggle, filterKey])

  const switchColors = useMemo(
    () => ({
      ios_backgroundColor: colors?.background?.quaternary,
      thumbColor: colors?.onPrimary100,
      trackColor: {
        false: colors?.background?.quaternary,
        true: colors?.primary100,
      },
    }),
    [colors],
  )

  return (
    <View className="mb-6 flex flex-row items-center justify-between">
      <ThemedText className="mb-3" color="text-100" type="h3">
        {title}
      </ThemedText>
      <Switch
        ios_backgroundColor={switchColors.ios_backgroundColor}
        onValueChange={handleToggle}
        thumbColor={switchColors.thumbColor}
        trackColor={switchColors.trackColor}
        value={value}
      />
    </View>
  )
})
