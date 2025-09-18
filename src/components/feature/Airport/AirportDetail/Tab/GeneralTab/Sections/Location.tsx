import React, { useMemo } from 'react'

import { AirportRowItem } from '@/components/feature/Airport/AirportDetail/AirportRowItem'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { AirportType } from '@/types/feature/airport'
import { formatNumber } from '@/utils/feature/formatNumber'

interface LocationProps {
  operations: AirportType['operations']
}

export const Location = ({ operations }: LocationProps) => {
  const { selectedLocale } = useLocaleStore()

  const {
    country,
    location: { city, elevationFt },
  } = operations ?? {}

  const formattedElevation = useMemo(() => formatNumber(elevationFt), [elevationFt])

  const localeStrings = useMemo(
    () => ({
      city: getLocale('city'),
      country: getLocale('country'),
      elevation: getLocale('elevation'),
      locationInformation: getLocale('locationInformation'),
    }),
    [selectedLocale],
  )

  return (
    <AirportSectionRow title={localeStrings.locationInformation}>
      <AirportRowItem icon="city-variant-outline" label={localeStrings.city} value={city} />

      <AirportRowItem icon="earth" label={localeStrings.country} value={country} />

      <AirportRowItem
        icon="elevation-rise"
        label={localeStrings.elevation}
        value={formattedElevation}
      />
    </AirportSectionRow>
  )
}
