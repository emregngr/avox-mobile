import React, { useMemo } from 'react'

import { AirportRowItem } from '@/components/feature/Airport/AirportDetail/AirportRowItem'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airport } from '@/types/feature/airport'
import { formatNumber } from '@/utils/feature/formatNumber'

interface GeneralProps {
  airportInfo: Airport['airportInfo']
  operations: Airport['operations']
}

export const General = ({ airportInfo, operations }: GeneralProps) => {
  const { selectedLocale } = useLocaleStore()

  const { employeeCount, foundingYear } = airportInfo || {}
  const { airportType, is24Hour, scheduledService } = operations || {}

  const yearsSinceEstablishment = useMemo(
    () => (foundingYear ? new Date().getFullYear() - parseInt(foundingYear) : 0),
    [foundingYear],
  )

  const localeStrings = useMemo(
    () => ({
      airportInfo: getLocale('airportInfo'),
      airportType: getLocale('airportType'),
      numberOfEmployees: getLocale('numberOfEmployees'),
      open24Hours: getLocale('open24Hours'),
      scheduledService: getLocale('scheduledService'),
      year: getLocale('year'),
      yearOfEstablishment: getLocale('yearOfEstablishment'),
    }),
    [selectedLocale],
  )

  return (
    <AirportSectionRow title={localeStrings.airportInfo}>
      <AirportRowItem
        icon="calendar"
        label={localeStrings.yearOfEstablishment}
        value={`${foundingYear} (${yearsSinceEstablishment} ${localeStrings.year})`}
      />

      <AirportRowItem
        icon="people"
        label={localeStrings.numberOfEmployees}
        value={formatNumber(employeeCount)}
      />

      <AirportRowItem
        className="capitalize"
        icon="airplane"
        label={localeStrings.airportType}
        value={airportType?.replace('_', ' ')}
      />

      <AirportRowItem
        icon="time"
        label={localeStrings.open24Hours}
        value={is24Hour ? getLocale('yes') : getLocale('no')}
      />

      <AirportRowItem
        icon="calendar-outline"
        label={localeStrings.scheduledService}
        value={scheduledService ? getLocale('yes') : getLocale('no')}
      />
    </AirportSectionRow>
  )
}
