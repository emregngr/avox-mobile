import React, { useMemo } from 'react'

import RunwayIcon from '@/assets/icons/runway.svg'
import { AirportRowItem } from '@/components/feature/Airport/AirportDetail/AirportRowItem'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { AirportType } from '@/types/feature/airport'
import { formatNumber } from '@/utils/feature/formatNumber'

interface RunwayProps {
  infrastructure: AirportType['infrastructure']
}

export const Runway = ({ infrastructure }: RunwayProps) => {
  const { selectedLocale } = useLocaleStore()
  const {
    runwayCount,
    runways: { ilsCategory, lengthM, pcn, surface },
  } = infrastructure ?? {}

  const formattedRunwayLength = useMemo(() => formatNumber(lengthM), [lengthM])

  const localeStrings = useMemo(
    () => ({
      ilsCategory: getLocale('ilsCategory'),
      pcn: getLocale('pcn'),
      runway: getLocale('runway'),
      runwaym: getLocale('runwaym'),
      surface: getLocale('surface'),
      trackInformation: getLocale('trackInformation'),
    }),
    [selectedLocale],
  )

  return (
    <AirportSectionRow title={localeStrings.trackInformation}>
      <AirportRowItem customIcon={RunwayIcon} label={localeStrings.runway} value={runwayCount} />

      <AirportRowItem icon="resize" label={localeStrings.runwaym} value={formattedRunwayLength} />

      <AirportRowItem icon="layers-outline" label={localeStrings.surface} value={surface} />

      <AirportRowItem icon="information-outline" label={localeStrings.pcn} value={pcn} />

      <AirportRowItem icon="eye" label={localeStrings.ilsCategory} value={ilsCategory} />
    </AirportSectionRow>
  )
}
