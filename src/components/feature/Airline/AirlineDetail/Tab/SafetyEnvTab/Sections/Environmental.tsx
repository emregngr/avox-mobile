import React from 'react'

import { ThemedText } from '@/components/common/ThemedText'
import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'
import { SafetyHeader } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Cards/SafetyHeader'

interface EnvironmentalProps {
  content: string
  iconColor: string
  subtitle: string
  title: string
}

export const Environmental = ({ content, iconColor, subtitle, title }: EnvironmentalProps) => (
  <AirlineSectionRow title={title}>
    <SafetyHeader iconColor={iconColor} iconName="leaf" title={subtitle} />

    <ThemedText color="text-70" type="body2">
      {content}
    </ThemedText>
  </AirlineSectionRow>
)
