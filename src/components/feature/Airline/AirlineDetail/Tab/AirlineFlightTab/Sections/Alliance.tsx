import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'

interface AllianceProps {
  alliance: string
  iconColor: string
  title: string
}

export const Alliance = ({ alliance, iconColor, title }: AllianceProps) => (
  <AirlineSectionRow title={title}>
    <View className="items-center my-5">
      <MaterialCommunityIcons color={iconColor} name="shield" size={40} />

      <ThemedText className="mt-2.5" color="text-90" type="h4">
        {alliance}
      </ThemedText>
    </View>
  </AirlineSectionRow>
)
