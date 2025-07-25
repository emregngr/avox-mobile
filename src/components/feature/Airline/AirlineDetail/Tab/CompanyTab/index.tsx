import React from 'react'
import { View } from 'react-native'

import { Company } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Company'
import { Contact } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Contact'
import { Hub } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Hub'
import { Map } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Map'
import { SocialMedia } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/SocialMedia'
import type { Airline } from '@/types/feature/airline'

interface CompanyTabProps {
  airlineData: Airline
}

export const CompanyTab = ({ airlineData }: CompanyTabProps) => {
  const { companyInfo, operations } = airlineData

  return (
    <View className="px-4 gap-y-4">
      <Company airlineData={airlineData} />

      <Contact companyInfo={companyInfo} operations={operations} />

      <SocialMedia companyInfo={companyInfo} />

      <Hub operations={operations} />

      <Map airlineData={airlineData} />
    </View>
  )
}
