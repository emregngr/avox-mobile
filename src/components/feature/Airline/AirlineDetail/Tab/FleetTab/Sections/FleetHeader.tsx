import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

interface FleetHeaderProps {
  fleetDetailText: string
}

export const FleetHeader = ({ fleetDetailText }: FleetHeaderProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  return (
    <View className="flex-row items-center">
      <MaterialCommunityIcons color={colors?.onPrimary100} name="airplane" size={20} />

      <ThemedText className="ml-3" color="text-100" type="h3">
        {fleetDetailText}
      </ThemedText>
    </View>
  )
}
