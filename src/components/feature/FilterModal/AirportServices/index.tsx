import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { FilterChip } from '@/components/feature/FilterModal/FilterChip'
import { getAirportServices } from '@/constants/filterModalOptions'
import { getLocale } from '@/locales/i18next'

interface AirportServicesProps {
  localFilters: any
  onBooleanToggle: (filterKey: string | number) => void
}

export const AirportServices = ({ localFilters, onBooleanToggle }: AirportServicesProps) => {
  const airportServices = useMemo(() => getAirportServices(), [])

  const handleToggle = useCallback(
    (serviceValue: string | number) => {
      onBooleanToggle(serviceValue)
    },
    [onBooleanToggle],
  )

  return (
    <View className="mb-6">
      <ThemedText className="mb-3" color="text-100" type="h3">
        {getLocale('additionalServicesFacilities')}
      </ThemedText>
      <View className="flex-row flex-wrap">
        {airportServices?.map(service => (
          <FilterChip
            key={service.value}
            label={service.label}
            onPress={() => handleToggle(service.value)}
            selected={!!localFilters[service.value]}
          />
        ))}
      </View>
    </View>
  )
}
