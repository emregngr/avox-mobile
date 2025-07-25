import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import type { ThemeColors } from '@/themes'

interface FleetHeaderProps {
  colors?: ThemeColors
  fleetDetailText: string
}

export const FleetHeader = ({ colors, fleetDetailText }: FleetHeaderProps) => (
  <View className="flex-row items-center">
    <Ionicons color={colors?.onPrimary100} name="airplane" size={20} />

    <ThemedText className="ml-3" color="text-100" type="h3">
      {fleetDetailText}
    </ThemedText>
  </View>
)
