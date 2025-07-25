import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'

interface CertificationCardProps {
  certification: string
  iconColor: string
}

export const CertificationCard = ({ certification, iconColor }: CertificationCardProps) => (
  <View className="flex-row items-center px-3 py-2 rounded-full overflow-hidden my-1 self-start bg-background-tertiary">
    <Ionicons color={iconColor} name="ribbon" size={16} />

    <ThemedText className="ml-2" color="text-70" type="body2">
      {certification}
    </ThemedText>
  </View>
)
