import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { AttractionCard } from '@/components/feature/Airport/AirportDetail/Tab/NearbyPlacesTab/Cards/AttractionCard'
import { useMapNavigation } from '@/hooks/maps/useMapNavigation'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airport } from '@/types/feature/airport'

interface NearbyPlacesTabProps {
  airportData: Airport
}
interface AttractionCard {
  attractionId: number
  attractionLatitude: number
  attractionLongitude: number
  attractionName: string
  description: string
  formattedDistance: string
  handleDirectionPress: () => void
}

export const NearbyPlacesTab = ({ airportData }: NearbyPlacesTabProps) => {
  const { selectedLocale } = useLocaleStore()

  const { nearbyAttractions } = airportData || {}

  const localeStrings = useMemo(
    () => ({
      getDirection: getLocale('getDirection'),
      km: getLocale('km'),
    }),
    [selectedLocale],
  )

  const mapLocaleStrings = useMemo(
    () => ({
      appleMaps: getLocale('appleMaps'),
      cancel: getLocale('cancel'),
      googleMaps: getLocale('googleMaps'),
      selectMapApp: getLocale('selectMapApp'),
    }),
    [selectedLocale],
  )

  const { openMapNavigation } = useMapNavigation(mapLocaleStrings)

  const attractionItems: AttractionCard[] = useMemo(
    () =>
      nearbyAttractions?.map(attraction => {
        const {
          attractionCoordinates: { attractionLatitude, attractionLongitude },
          attractionId,
          attractionName,
          description,
          distanceKm,
        } = attraction

        const handleDirectionPress = () => {
          openMapNavigation(attractionLatitude, attractionLongitude, attractionName)
        }

        const formattedDistance = `${distanceKm} ${localeStrings.km}`

        return {
          attractionId,
          attractionLatitude,
          attractionLongitude,
          attractionName,
          description,
          formattedDistance,
          handleDirectionPress,
        }
      }) || [],
    [nearbyAttractions, openMapNavigation, localeStrings.km],
  )

  const renderAttraction = useCallback(
    (item: AttractionCard) => (
      <AttractionCard
        attractionId={item.attractionId}
        attractionName={item.attractionName}
        description={item.description}
        formattedDistance={item.formattedDistance}
        getDirectionText={localeStrings.getDirection}
        handleDirectionPress={item.handleDirectionPress}
        key={item.attractionId}
      />
    ),
    [localeStrings.getDirection],
  )

  return <View className="px-4 gap-y-4">{attractionItems?.map(renderAttraction)}</View>
}
