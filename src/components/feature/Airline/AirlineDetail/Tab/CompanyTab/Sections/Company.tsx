import React, { useMemo } from 'react'

import { AirlineRowItem } from '@/components/feature/Airline/AirlineDetail/AirlineRowItem'
import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airline } from '@/types/feature/airline'
import { formatNumber } from '@/utils/feature/formatNumber'

interface CompanyProps {
  airlineData: Airline
}

export const Company = ({ airlineData }: CompanyProps) => {
  const { selectedLocale } = useLocaleStore()

  const { companyInfo, isoCountry, isoRegion, operations } = airlineData || {}
  const { employeeCount, foundingYear, parentCompany, passengerCapacity } = companyInfo || {}
  const { businessModel, businessType, skytraxRating, slogan } = operations || {}

  const localeStrings = useMemo(
    () => ({
      airlineInfo: getLocale('airlineInfo'),
      businessModel: getLocale('businessModel'),
      businessType: getLocale('businessType'),
      isoCountryCode: getLocale('isoCountryCode'),
      isoRegionCode: getLocale('isoRegionCode'),
      millionPerYear: getLocale('million/year'),
      numberOfEmployees: getLocale('numberOfEmployees'),
      numberOfPassengers: getLocale('numberOfPassengers'),
      parentCompany: getLocale('parentCompany'),
      skytraxRating: getLocale('skytraxRating'),
      slogan: getLocale('slogan'),
      year: getLocale('year'),
      yearOfEstablishment: getLocale('yearOfEstablishment'),
    }),
    [selectedLocale],
  )

  return (
    <AirlineSectionRow title={localeStrings.airlineInfo}>
      <AirlineRowItem
        icon="calendar"
        label={localeStrings.yearOfEstablishment}
        value={`${foundingYear} (${new Date().getFullYear() - parseInt(foundingYear)} ${localeStrings.year})`}
      />

      <AirlineRowItem icon="business" label={localeStrings.parentCompany} value={parentCompany} />

      <AirlineRowItem
        icon="people"
        label={localeStrings.numberOfPassengers}
        value={`${passengerCapacity} ${localeStrings.millionPerYear}`}
      />

      <AirlineRowItem
        icon="people"
        label={localeStrings.numberOfEmployees}
        value={formatNumber(employeeCount)}
      />

      <AirlineRowItem
        className="capitalize"
        icon="briefcase"
        label={localeStrings.businessModel}
        value={businessModel?.replace('_', ' ')}
      />

      <AirlineRowItem
        className="capitalize"
        icon="airplane"
        label={localeStrings.businessType}
        value={businessType?.replace('_', ' ')}
      />

      <AirlineRowItem icon="flag" label={localeStrings.isoCountryCode} value={isoCountry} />

      <AirlineRowItem icon="location" label={localeStrings.isoRegionCode} value={isoRegion} />

      <AirlineRowItem
        icon="star"
        label={localeStrings.skytraxRating}
        value={`${skytraxRating?.toFixed(1)} / 5`}
      />

      <AirlineRowItem icon="chatbox-ellipses" label={localeStrings.slogan} value={slogan} />
    </AirlineSectionRow>
  )
}
