import React, { useMemo } from 'react'

import { AirlineRowItem } from '@/components/feature/Airline/AirlineDetail/AirlineRowItem'
import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { AirlineType } from '@/types/feature/airline'

interface HubProps {
  operations: AirlineType['operations']
}

export const Hub = ({ operations }: HubProps) => {
  const { selectedLocale } = useLocaleStore()

  const { country, hub } = operations ?? {}
  const { city } = hub ?? {}

  const localeStrings = useMemo(
    () => ({
      city: getLocale('city'),
      country: getLocale('country'),
      hubInformation: getLocale('hubInformation'),
    }),
    [selectedLocale],
  )

  return (
    <AirlineSectionRow title={localeStrings.hubInformation}>
      <AirlineRowItem icon="city-variant-outline" label={localeStrings.city} value={city} />

      <AirlineRowItem icon="earth" label={localeStrings.country} value={country} />
    </AirlineSectionRow>
  )
}
