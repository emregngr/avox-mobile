import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { CertificationCard } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Cards/CertificationCard'

interface CertificationsListProps {
  certifications: string[]
  iconColor: string
  title: string
}

export const CertificationsList = ({ certifications, iconColor, title }: CertificationsListProps) => (
  <View>
    <ThemedText className="mb-2" color="text-90" type="body2">
      {title}:
    </ThemedText>

    {certifications?.map((cert, index) => (
      <CertificationCard certification={cert} iconColor={iconColor} key={index} />
      ))}
  </View>
  )
