import React, { useMemo } from 'react'

import ApronIcon from '@/assets/icons/apron.svg'
import { AirportRowItem } from '@/components/feature/Airport/AirportDetail/AirportRowItem'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airport } from '@/types/feature/airport'
import { formatNumber } from '@/utils/feature/formatNumber'

interface TerminalProps {
  infrastructure: Airport['infrastructure']
}

export const Terminal = ({ infrastructure }: TerminalProps) => {
  const { selectedLocale } = useLocaleStore()
  const {
    airportAreaHectares,
    apronCount,
    baggageCapacity,
    passengerCapacity,
    terminalAreaHectares,
    terminalCount,
  } = infrastructure ?? {}

  const localeStrings = useMemo(
    () => ({
      airportArea: getLocale('airportArea'),
      apron: getLocale('apron'),
      baggageCapacity: getLocale('baggageCapacity'),
      luggagePerHour: getLocale('luggage/hour'),
      millionPerYear: getLocale('million/year'),
      numberOfPassengers: getLocale('numberOfPassengers'),
      terminal: getLocale('terminal'),
      terminalArea: getLocale('terminalArea'),
      terminalandCapacity: getLocale('terminalandCapacity'),
    }),
    [selectedLocale],
  )

  const formattedPassengerCapacity = useMemo(
    () => `${passengerCapacity} ${localeStrings.millionPerYear}`,
    [passengerCapacity],
  )

  const formattedBaggageCapacity = useMemo(
    () => `${formatNumber(baggageCapacity)} ${localeStrings.luggagePerHour}`,
    [baggageCapacity],
  )

  const formattedTerminalAreaHectares = useMemo(
    () => formatNumber(terminalAreaHectares),
    [terminalAreaHectares],
  )

  const formattedAirportAreaHectares = useMemo(
    () => formatNumber(airportAreaHectares),
    [airportAreaHectares],
  )

  return (
    <AirportSectionRow title={localeStrings.terminalandCapacity}>
      <AirportRowItem
        icon="people"
        label={localeStrings.numberOfPassengers}
        value={formattedPassengerCapacity}
      />

      <AirportRowItem
        icon="briefcase"
        label={localeStrings.baggageCapacity}
        value={formattedBaggageCapacity}
      />

      <AirportRowItem icon="terminal" label={localeStrings.terminal} value={terminalCount} />

      <AirportRowItem
        icon="grid"
        label={localeStrings.terminalArea}
        value={formattedTerminalAreaHectares}
      />

      <AirportRowItem
        icon="map"
        label={localeStrings.airportArea}
        value={formattedAirportAreaHectares}
      />

      <AirportRowItem customIcon={ApronIcon} label={localeStrings.apron} value={apronCount} />
    </AirportSectionRow>
  )
}
