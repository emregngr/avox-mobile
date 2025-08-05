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

  const { companyInfo, isoCountry, isoRegion, operations } = airlineData ?? {}
  const { employeeCount, foundingYear, parentCompany, passengerCapacity } = companyInfo ?? {}
  const { businessModel, businessType, skytraxRating, slogan } = operations ?? {}

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

  const formattedYearOfEstablishment = useMemo(
    () =>
      `${foundingYear} (${new Date().getFullYear() - parseInt(foundingYear)} ${localeStrings.year})`,
    [foundingYear, localeStrings],
  )

  const formattedPassengerCapacity = useMemo(
    () => `${passengerCapacity} ${localeStrings.millionPerYear}`,
    [passengerCapacity, localeStrings],
  )

  const formattedEmployeeCount = useMemo(() => formatNumber(employeeCount), [employeeCount])

  const businessModelValue = useMemo((): string => {
    if (businessModel === 'cargo') {
      return getLocale('cargo')
    } else if (businessModel === 'passenger') {
      return getLocale('passenger')
    }

    return businessModel?.replace('_', ' ')
  }, [businessModel, selectedLocale])

  const businessTypeValue = useMemo((): string => {
    if (businessType === 'cargo') {
      return getLocale('cargo')
    } else if (businessType === 'low_cost') {
      return getLocale('lowCost')
    } else if (businessType === 'regional') {
      return getLocale('regional')
    } else if (businessType === 'major_international') {
      return getLocale('majorInternational')
    }

    return businessType?.replace('_', ' ')
  }, [businessType, selectedLocale])

  const skytraxRatingValue = useMemo(() => `${skytraxRating?.toFixed(1)} / 5`, [skytraxRating])

  return (
    <AirlineSectionRow title={localeStrings.airlineInfo}>
      <AirlineRowItem
        icon="calendar"
        label={localeStrings.yearOfEstablishment}
        value={formattedYearOfEstablishment}
      />

      <AirlineRowItem icon="business" label={localeStrings.parentCompany} value={parentCompany} />

      <AirlineRowItem
        icon="people"
        label={localeStrings.numberOfPassengers}
        value={formattedPassengerCapacity}
      />

      <AirlineRowItem
        icon="people"
        label={localeStrings.numberOfEmployees}
        value={formattedEmployeeCount}
      />

      <AirlineRowItem
        icon="briefcase"
        label={localeStrings.businessModel}
        value={businessModelValue}
      />

      <AirlineRowItem
        icon="airplane"
        label={localeStrings.businessType}
        value={businessTypeValue}
      />

      <AirlineRowItem icon="flag" label={localeStrings.isoCountryCode} value={isoCountry} />

      <AirlineRowItem icon="location" label={localeStrings.isoRegionCode} value={isoRegion} />

      <AirlineRowItem icon="star" label={localeStrings.skytraxRating} value={skytraxRatingValue} />

      <AirlineRowItem icon="chatbox-ellipses" label={localeStrings.slogan} value={slogan} />
    </AirlineSectionRow>
  )
}
