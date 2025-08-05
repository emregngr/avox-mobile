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

  const { employeeCount, foundingYear } = airportInfo ?? {}
  const { airportType, is24Hour, scheduledService } = operations ?? {}

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

  const formattedYearOfEstablishment = useMemo(
    () => `${foundingYear} (${yearsSinceEstablishment} ${localeStrings.year})`,
    [foundingYear, yearsSinceEstablishment, localeStrings],
  )

  const formattedEmployeeCount = useMemo(() => formatNumber(employeeCount), [employeeCount])

  const airportTypeValue = useMemo((): string => {
    if (airportType === 'small_airport') {
      return getLocale('small')
    } else if (airportType === 'medium_airport') {
      return getLocale('medium')
    } else if (airportType === 'large_airport') {
      return getLocale('large')
    } else if (airportType === 'mega_airport') {
      return getLocale('mega')
    }

    return airportType?.replace('_', ' ')
  }, [airportType])

  const is24HourValue = useMemo(() => (is24Hour ? getLocale('yes') : getLocale('no')), [is24Hour])

  const scheduledServiceValue = useMemo(
    () => (scheduledService ? getLocale('yes') : getLocale('no')),
    [scheduledService],
  )

  return (
    <AirportSectionRow title={localeStrings.airportInfo}>
      <AirportRowItem
        icon="calendar"
        label={localeStrings.yearOfEstablishment}
        value={formattedYearOfEstablishment}
      />

      <AirportRowItem
        icon="people"
        label={localeStrings.numberOfEmployees}
        value={formattedEmployeeCount}
      />

      <AirportRowItem icon="airplane" label={localeStrings.airportType} value={airportTypeValue} />

      <AirportRowItem icon="time" label={localeStrings.open24Hours} value={is24HourValue} />

      <AirportRowItem
        icon="calendar-outline"
        label={localeStrings.scheduledService}
        value={scheduledServiceValue}
      />
    </AirportSectionRow>
  )
}
