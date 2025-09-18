import React, { useMemo } from 'react'

import FireStationIcon from '@/assets/icons/fireStation.svg'
import TowerIcon from '@/assets/icons/tower.svg'
import { AirportRowItem } from '@/components/feature/Airport/AirportDetail/AirportRowItem'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { AirportType } from '@/types/feature/airport'
import { formatNumber } from '@/utils/feature/formatNumber'

interface FacilitiesProps {
  facilities: AirportType['facilities']
  infrastructure: AirportType['infrastructure']
}

export const Facilities = ({ facilities, infrastructure }: FacilitiesProps) => {
  const { selectedLocale } = useLocaleStore()

  const { fireCategory, towerHeightM } = infrastructure ?? {}

  const {
    checkinTimeAvg,
    freeWifi,
    googleMapsRating,
    hasMetro,
    loungeCount,
    parkingCapacityVehicles,
    securityQueueTime,
  } = facilities ?? {}

  const formattedParkingCapacity = useMemo(
    () => formatNumber(parkingCapacityVehicles),
    [parkingCapacityVehicles],
  )

  const formattedSecurityTime = useMemo(() => `~${securityQueueTime}`, [securityQueueTime])
  const formattedCheckinTime = useMemo(() => `~${checkinTimeAvg}`, [checkinTimeAvg])

  const formattedGoogleRating = useMemo(
    () => `${googleMapsRating?.toFixed(1)} / 5`,
    [googleMapsRating],
  )

  const metroStatus = useMemo(() => (hasMetro ? getLocale('yes') : getLocale('no')), [hasMetro])
  const wifiStatus = useMemo(() => (freeWifi ? getLocale('free') : getLocale('paid')), [freeWifi])

  const localeStrings = useMemo(
    () => ({
      checkIn: getLocale('checkIn'),
      facilities: getLocale('facilities'),
      fireDepartmentCategory: getLocale('fireDepartmentCategory'),
      googleRating: getLocale('googleRating'),
      lounges: getLocale('lounges'),
      metro: getLocale('metro'),
      parking: getLocale('parking'),
      security: getLocale('security'),
      tower: getLocale('tower'),
      wifiStatus: getLocale('wifiStatus'),
    }),
    [selectedLocale],
  )

  return (
    <AirportSectionRow title={localeStrings.facilities}>
      <AirportRowItem customIcon={TowerIcon} label={localeStrings.tower} value={towerHeightM} />

      <AirportRowItem
        customIcon={FireStationIcon}
        label={localeStrings.fireDepartmentCategory}
        value={fireCategory}
      />

      <AirportRowItem
        icon="car-outline"
        label={localeStrings.parking}
        value={formattedParkingCapacity}
      />

      <AirportRowItem icon="subway" label={localeStrings.metro} value={metroStatus} />

      <AirportRowItem icon="wifi" label={localeStrings.wifiStatus} value={wifiStatus} />

      <AirportRowItem icon="food-fork-drink" label={localeStrings.lounges} value={loungeCount} />

      <AirportRowItem
        icon="timer-outline"
        label={localeStrings.security}
        value={formattedSecurityTime}
      />

      <AirportRowItem
        icon="clock-outline"
        label={localeStrings.checkIn}
        value={formattedCheckinTime}
      />

      <AirportRowItem
        icon="star-outline"
        label={localeStrings.googleRating}
        value={formattedGoogleRating}
      />
    </AirportSectionRow>
  )
}
