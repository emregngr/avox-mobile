import React from 'react'

import { ThemedText } from '@/components/common/ThemedText'
import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'
import { CertificationsList } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Cards/CertificationsList'
import { SafetyHeader } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Cards/SafetyHeader'

interface SafetyProps {
  certifications: string[]
  certificationsTitle: string
  iconColor: string
  safetyRecord: string
  safetyRecordTitle: string
  title: string
}

export const Safety = ({
  certifications,
  certificationsTitle,
  iconColor,
  safetyRecord,
  safetyRecordTitle,
  title,
}: SafetyProps) => (
  <AirlineSectionRow title={title}>
    <SafetyHeader iconColor={iconColor} iconName="shield-check" title={safetyRecordTitle} />

    <ThemedText className="mb-4" color="text-70" type="body2">
      {safetyRecord}
    </ThemedText>

    <CertificationsList
      certifications={certifications}
      iconColor={iconColor}
      title={certificationsTitle}
    />
  </AirlineSectionRow>
)
