import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Close from '@/assets/icons/close'
import { ThemedButton } from '@/components/common/ThemedButton'
import { ThemedText } from '@/components/common/ThemedText'
import { AirportServices } from '@/components/feature/FilterModal/AirportServices'
import { FilterSection } from '@/components/feature/FilterModal/FilterSection'
import { RatingSection } from '@/components/feature/FilterModal/RatingSection'
import { SwitchFilter } from '@/components/feature/FilterModal/SwitchFilter'
import {
  getAirplaneTypeCountRanges,
  getAirportAreaHectaresRanges,
  getAirportTypes,
  getAlliances,
  getApronCountRanges,
  getAverageAgeRanges,
  getBaggageCapacityRanges,
  getBusinessModels,
  getBusinessTypes,
  getCheckinTimeAvgRanges,
  getDestinationCountRanges,
  getDestinationCountriesRanges,
  getDomesticConnectionsRanges,
  getElevationFtRanges,
  getEmployeeCountRanges,
  getFoundingYearRanges,
  getGoogleRatings,
  getInternationalConnectionsRanges,
  getLoungeCountRanges,
  getParkingCapacityVehiclesRanges,
  getPassengerCapacityRanges,
  getRegions,
  getRunwayCountRanges,
  getRunwayLengthMRanges,
  getSecurityQueueTimeRanges,
  getSkytraxRatings,
  getTerminalAreaHectaresRanges,
  getTerminalCountRanges,
  getTotalAirplaneRanges,
  getTowerHeightMRanges,
} from '@/constants/filterModalOptions'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { FilterModalPropsType } from '@/types/feature/filter'

export const FilterModal = forwardRef<BottomSheet, FilterModalPropsType>(
  ({ currentFilters, onApply, onClose, type }, ref) => {
    const { bottom } = useSafeAreaInsets()

    const extraBottomPadding = Platform.OS === 'ios' ? 70 : 80
    const bottomPadding = bottom + extraBottomPadding

    const [localFilters, setLocalFilters] = useState<any>(currentFilters)

    const { selectedTheme } = useThemeStore()
    const { selectedLocale } = useLocaleStore()

    const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

    useEffect(() => {
      setLocalFilters(currentFilters)
    }, [currentFilters])

    const handleSingleSelectToggle = useCallback((filterKey: string, value: string | null) => {
      setLocalFilters((prevFilters: any) => {
        const newFilters = { ...prevFilters }
        if (newFilters[filterKey] === value) {
          delete newFilters[filterKey]
        } else {
          newFilters[filterKey] = value
        }
        return newFilters
      })
    }, [])

    const handleBooleanToggle = useCallback((filterKey: string | number) => {
      setLocalFilters((prevFilters: any) => {
        const newFilters = { ...prevFilters }
        if (newFilters[filterKey] === true) {
          delete newFilters[filterKey]
        } else {
          newFilters[filterKey] = true
        }
        return newFilters
      })
    }, [])

    const handleRatingChange = useCallback((filterKey: string, rating: number) => {
      setLocalFilters((prevFilters: any) => {
        const newFilters = { ...prevFilters }
        if (newFilters[filterKey] === rating) {
          delete newFilters[filterKey]
        } else {
          newFilters[filterKey] = rating
        }
        return newFilters
      })
    }, [])

    const clearFilters = useCallback(() => {
      setLocalFilters({})
    }, [])

    const applyFilters = useCallback(() => {
      onApply(localFilters)
      onClose()
    }, [onApply, onClose, localFilters])

    const snapPoints = useMemo(() => [1, '70%'], [])

    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} />,
      [],
    )

    const localeStrings = useMemo(
      () => ({
        airplaneType: getLocale('airplaneType'),
        airportArea: getLocale('airportArea'),
        airportType: getLocale('airportType'),
        alliance: getLocale('alliance'),
        apply: getLocale('apply'),
        apron: getLocale('apron'),
        averageAgeYears: getLocale('averageAgeYears'),
        businessModel: getLocale('businessModel'),
        businessType: getLocale('businessType'),
        checkIn: getLocale('checkIn'),
        clear: getLocale('clear'),
        domesticDestinations: getLocale('domesticDestinations'),
        elevation: getLocale('elevation'),
        filter: getLocale('filter'),
        freeWifi: getLocale('freeWifi'),
        internationalDestination: getLocale('internationalDestination'),
        lounges: getLocale('lounges'),
        luggage: getLocale('luggage'),
        metro: getLocale('metro'),
        minGoogleRating: getLocale('minGoogleRating'),
        minSkytraxRating: getLocale('minSkytraxRating'),
        numberOfCountries: getLocale('numberOfCountries'),
        numberOfDestination: getLocale('numberOfDestination'),
        numberOfEmployees: getLocale('numberOfEmployees'),
        numberOfPassengers: getLocale('numberOfPassengers'),
        open24Hours: getLocale('open24Hours'),
        parking: getLocale('parking'),
        region: getLocale('region'),
        runway: getLocale('runway'),
        runwaym: getLocale('runwaym'),
        security: getLocale('security'),
        terminal: getLocale('terminal'),
        terminalArea: getLocale('terminalArea'),
        totalAirplane: getLocale('totalAirplane'),
        tower: getLocale('tower'),
        yearOfEstablishment: getLocale('yearOfEstablishment'),
      }),
      [selectedLocale],
    )

    const filterOptions = useMemo(
      () => ({
        airplaneTypeCountRanges: getAirplaneTypeCountRanges(),
        airportAreaHectaresRanges: getAirportAreaHectaresRanges(),
        airportTypes: getAirportTypes(),
        alliances: getAlliances(),
        apronCountRanges: getApronCountRanges(),
        averageAgeRanges: getAverageAgeRanges(),
        baggageCapacityRanges: getBaggageCapacityRanges(),
        businessModels: getBusinessModels(),
        businessTypes: getBusinessTypes(),
        checkinTimeAvgRanges: getCheckinTimeAvgRanges(),
        destinationCountRanges: getDestinationCountRanges(),
        destinationCountriesRanges: getDestinationCountriesRanges(),
        domesticConnectionsRanges: getDomesticConnectionsRanges(),
        elevationFtRanges: getElevationFtRanges(),
        employeeCountRanges: getEmployeeCountRanges(),
        foundingYearRanges: getFoundingYearRanges(),
        googleRatings: getGoogleRatings(),
        internationalConnectionsRanges: getInternationalConnectionsRanges(),
        loungeCountRanges: getLoungeCountRanges(),
        parkingCapacityVehiclesRanges: getParkingCapacityVehiclesRanges(),
        passengerCapacityRanges: getPassengerCapacityRanges(),
        regions: getRegions(),
        runwayCountRanges: getRunwayCountRanges(),
        runwayLengthMRanges: getRunwayLengthMRanges(),
        securityQueueTimeRanges: getSecurityQueueTimeRanges(),
        skytraxRatings: getSkytraxRatings(),
        terminalAreaHectaresRanges: getTerminalAreaHectaresRanges(),
        terminalCountRanges: getTerminalCountRanges(),
        totalAirplaneRanges: getTotalAirplaneRanges(),
        towerHeightMRanges: getTowerHeightMRanges(),
      }),
      [selectedLocale],
    )

    return (
      <BottomSheet
        backgroundStyle={{
          backgroundColor: colors?.background?.primary,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors?.onPrimary100,
        }}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <View className="flex-row items-center justify-between p-4 border-b border-background-quaternary">
          <ThemedText color="text-100" type="h2">
            {localeStrings.filter}
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={20}
            onPress={onClose}
            testID="filter-close-button"
          >
            <Close
              height={24}
              primaryColor={colors?.background?.quaternary}
              secondaryColor={colors?.onPrimary100}
              width={24}
            />
          </TouchableOpacity>
        </View>

        <BottomSheetScrollView
          className="flex-1"
          contentContainerClassName="py-5 px-4"
          showsVerticalScrollIndicator={false}
        >
          <FilterSection
            filterKey="region"
            handlerType="single"
            localFilters={localFilters}
            onSingleSelectToggle={handleSingleSelectToggle}
            options={filterOptions.regions}
            title={localeStrings.region}
          />

          <FilterSection
            filterKey="foundingYear"
            handlerType="single"
            localFilters={localFilters}
            onSingleSelectToggle={handleSingleSelectToggle}
            options={filterOptions.foundingYearRanges}
            title={localeStrings.yearOfEstablishment}
          />

          <FilterSection
            filterKey="passengerCapacity"
            handlerType="single"
            localFilters={localFilters}
            onSingleSelectToggle={handleSingleSelectToggle}
            options={filterOptions.passengerCapacityRanges}
            title={localeStrings.numberOfPassengers}
          />

          <FilterSection
            filterKey="employeeCount"
            handlerType="single"
            localFilters={localFilters}
            onSingleSelectToggle={handleSingleSelectToggle}
            options={filterOptions.employeeCountRanges}
            title={localeStrings.numberOfEmployees}
          />

          <FilterSection
            filterKey="destinationCount"
            handlerType="single"
            localFilters={localFilters}
            onSingleSelectToggle={handleSingleSelectToggle}
            options={filterOptions.destinationCountRanges}
            title={localeStrings.numberOfDestination}
          />

          <FilterSection
            filterKey="destinationCountries"
            handlerType="single"
            localFilters={localFilters}
            onSingleSelectToggle={handleSingleSelectToggle}
            options={filterOptions.destinationCountriesRanges}
            title={localeStrings.numberOfCountries}
          />

          <FilterSection
            filterKey="domesticConnections"
            handlerType="single"
            localFilters={localFilters}
            onSingleSelectToggle={handleSingleSelectToggle}
            options={filterOptions.domesticConnectionsRanges}
            title={localeStrings.domesticDestinations}
          />

          <FilterSection
            filterKey="internationalConnections"
            handlerType="single"
            localFilters={localFilters}
            onSingleSelectToggle={handleSingleSelectToggle}
            options={filterOptions.internationalConnectionsRanges}
            title={localeStrings.internationalDestination}
          />

          {type === 'airports' ? (
            <>
              <FilterSection
                filterKey="airportType"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.airportTypes}
                title={localeStrings.airportType}
              />

              <FilterSection
                filterKey="elevationFt"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.elevationFtRanges}
                title={localeStrings.elevation}
              />

              <SwitchFilter
                filterKey="is24Hour"
                onToggle={handleBooleanToggle}
                title={localeStrings.open24Hours}
                value={!!localFilters.is24Hour}
              />

              <FilterSection
                filterKey="baggageCapacity"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.baggageCapacityRanges}
                title={localeStrings.luggage}
              />

              <FilterSection
                filterKey="terminalCount"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.terminalCountRanges}
                title={localeStrings.terminal}
              />

              <FilterSection
                filterKey="terminalAreaHectares"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.terminalAreaHectaresRanges}
                title={localeStrings.terminalArea}
              />

              <FilterSection
                filterKey="airportAreaHectares"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.airportAreaHectaresRanges}
                title={localeStrings.airportArea}
              />

              <FilterSection
                filterKey="apronCount"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.apronCountRanges}
                title={localeStrings.apron}
              />

              <AirportServices localFilters={localFilters} onBooleanToggle={handleBooleanToggle} />

              <FilterSection
                filterKey="runwayCount"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.runwayCountRanges}
                title={localeStrings.runway}
              />

              <FilterSection
                filterKey="mainRunwayLengthM"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.runwayLengthMRanges}
                title={localeStrings.runwaym}
              />

              <FilterSection
                filterKey="towerHeightM"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.towerHeightMRanges}
                title={localeStrings.tower}
              />

              <FilterSection
                filterKey="parkingCapacityVehicles"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.parkingCapacityVehiclesRanges}
                title={localeStrings.parking}
              />

              <SwitchFilter
                filterKey="hasMetro"
                onToggle={handleBooleanToggle}
                title={localeStrings.metro}
                value={!!localFilters.hasMetro}
              />

              <SwitchFilter
                filterKey="freeWifi"
                onToggle={handleBooleanToggle}
                title={localeStrings.freeWifi}
                value={!!localFilters.freeWifi}
              />

              <FilterSection
                filterKey="loungeCount"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.loungeCountRanges}
                title={localeStrings.lounges}
              />

              <FilterSection
                filterKey="securityQueueTime"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.securityQueueTimeRanges}
                title={localeStrings.security}
              />

              <FilterSection
                filterKey="checkinTimeAvg"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.checkinTimeAvgRanges}
                title={localeStrings.checkIn}
              />

              <RatingSection
                onRatingChange={handleRatingChange}
                ratingKey="minGoogleRating"
                ratings={filterOptions.googleRatings}
                selectedRating={localFilters.minGoogleRating}
                title={localeStrings.minGoogleRating}
              />
            </>
          ) : (
            <>
              <FilterSection
                filterKey="businessModel"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.businessModels}
                title={localeStrings.businessModel}
              />

              <FilterSection
                filterKey="businessType"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.businessTypes}
                title={localeStrings.businessType}
              />

              <FilterSection
                filterKey="totalAirplane"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.totalAirplaneRanges}
                title={localeStrings.totalAirplane}
              />

              <FilterSection
                filterKey="averageAgeYears"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.averageAgeRanges}
                title={localeStrings.averageAgeYears}
              />

              <FilterSection
                filterKey="airplaneTypeCount"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.airplaneTypeCountRanges}
                title={localeStrings.airplaneType}
              />

              <FilterSection
                filterKey="alliance"
                handlerType="single"
                localFilters={localFilters}
                onSingleSelectToggle={handleSingleSelectToggle}
                options={filterOptions.alliances}
                title={localeStrings.alliance}
              />

              <RatingSection
                onRatingChange={handleRatingChange}
                ratingKey="minSkytraxRating"
                ratings={filterOptions.skytraxRatings}
                selectedRating={localFilters.minSkytraxRating}
                title={localeStrings.minSkytraxRating}
              />
            </>
          )}
        </BottomSheetScrollView>

        <View
          className="flex-row items-center justify-between px-10 py-4 border-t border-background-quaternary"
          style={{ marginBottom: bottomPadding }}
        >
          <View className="w-[45%]">
            <ThemedButton
              label={localeStrings.clear}
              onPress={clearFilters}
              testID="filter-clear-button"
              type="danger"
            />
          </View>
          <View className="w-[45%]">
            <ThemedButton
              label={localeStrings.apply}
              onPress={applyFilters}
              testID="filter-apply-button"
            />
          </View>
        </View>
      </BottomSheet>
    )
  },
)
