import React from 'react'
import { View } from 'react-native'

import { Contact } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Contact'
import { General } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/General'
import { Location } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Location'
import { Map } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Map'
import { Services } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Services'
import { SocialMedia } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/SocialMedia'
import type { Airport } from '@/types/feature/airport'

interface GeneralTabProps {
  airportData: Airport
}

export const GeneralTab = ({ airportData }: GeneralTabProps) => {
  const { airportInfo, facilities, operations } = airportData ?? {}

  return (
    <View className="px-4 gap-y-4">
      <General airportInfo={airportInfo} operations={operations} />

      <Services facilities={facilities} />

      <Contact airportInfo={airportInfo} />

      <SocialMedia airportInfo={airportInfo} />

      <Location operations={operations} />

      <Map airportData={airportData} />
    </View>
  )
}
