import React from 'react'
import { View } from 'react-native'

import { Cargo } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Cargo'
import { Certifications } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Certifications'
import { Facilities } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Facilities'
import { Runway } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Runway'
import { Terminal } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Terminal'
import type { Airport } from '@/types/feature/airport'

interface InfrastructureTabProps {
  airportData: Airport
}

export const InfrastructureTab = ({ airportData }: InfrastructureTabProps) => {
  const { cargo, facilities, infrastructure, safety } = airportData || {}

  return (
    <View className="px-4 gap-y-4">
      <Terminal infrastructure={infrastructure} />

      <Runway infrastructure={infrastructure} />

      <Facilities facilities={facilities} infrastructure={infrastructure} />

      <Cargo cargo={cargo} />

      <Certifications safety={safety} />
    </View>
  )
}
