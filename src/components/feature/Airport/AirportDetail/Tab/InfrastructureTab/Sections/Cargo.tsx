import React, { useMemo } from 'react'

import { AirportRowItem } from '@/components/feature/Airport/AirportDetail/AirportRowItem'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airport } from '@/types/feature/airport'
import { formatNumber } from '@/utils/feature/formatNumber'

interface CargoProps {
  cargo: Airport['cargo']
}

export const Cargo = ({ cargo }: CargoProps) => {
  const { selectedLocale } = useLocaleStore()

  const { annualCargoTonnes, coldStorage, dangerousGoods, terminalCapacityTonnes } = cargo ?? {}

  const formattedAnnualCargo = useMemo(() => formatNumber(annualCargoTonnes), [annualCargoTonnes])

  const formattedTerminalCapacity = useMemo(
    () => formatNumber(terminalCapacityTonnes),
    [terminalCapacityTonnes],
  )

  const coldStorageStatus = useMemo(
    () => (coldStorage ? getLocale('existing') : getLocale('none')),
    [coldStorage],
  )

  const dangerousGoodsStatus = useMemo(
    () => (dangerousGoods ? getLocale('yes') : getLocale('no')),
    [dangerousGoods],
  )

  const localeStrings = useMemo(
    () => ({
      annualShipping: getLocale('annualShipping'),
      cargo: getLocale('cargo'),
      coldStorage: getLocale('coldStorage'),
      dangerousGoods: getLocale('dangerousGoods'),
      terminalCapacity: getLocale('terminalCapacity'),
    }),
    [selectedLocale],
  )

  return (
    <AirportSectionRow title={localeStrings.cargo}>
      <AirportRowItem
        icon="cube"
        label={localeStrings.annualShipping}
        value={formattedAnnualCargo}
      />

      <AirportRowItem
        icon="cube-outline"
        label={localeStrings.terminalCapacity}
        value={formattedTerminalCapacity}
      />

      <AirportRowItem icon="snow" label={localeStrings.coldStorage} value={coldStorageStatus} />

      <AirportRowItem
        icon="warning"
        label={localeStrings.dangerousGoods}
        value={dangerousGoodsStatus}
      />
    </AirportSectionRow>
  )
}
