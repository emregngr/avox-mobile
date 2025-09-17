import { fireEvent, render } from '@testing-library/react-native'
import React, { createRef } from 'react'

import { FilterModal } from '@/components/feature/FilterModal'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import type { FilterModalPropsType } from '@/types/feature/filter'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common', () => {
  const { TouchableOpacity, Text } = require('react-native')

  return {
    ThemedButton: ({ onPress, label }: { onPress: () => void; label: string }) => (
      <TouchableOpacity onPress={onPress} testID="themed-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),

    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/components/feature/FilterModal/FilterSection', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    FilterSection: ({
      title,
      filterKey,
      onSingleSelectToggle,
      options,
    }: {
      title: string
      filterKey: string
      onSingleSelectToggle: (key: string, value: string | null) => void
      options: { label: string; value: string }[]
    }) => (
      <View testID={`filter-section-${filterKey}`}>
        <Text>{title}</Text>
        {options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSingleSelectToggle(filterKey, option.value)}
            testID={`filter-option-${filterKey}-${option.value}`}
          >
            <Text>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
  }
})

jest.mock('@/components/feature/FilterModal/SwitchFilter', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    SwitchFilter: ({
      title,
      filterKey,
      onToggle,
      value,
    }: {
      title: string
      filterKey: string
      onToggle: (key: string) => void
      value: boolean
    }) => (
      <View testID={`switch-filter-${filterKey}`}>
        <Text>{title}</Text>
        <TouchableOpacity onPress={() => onToggle(filterKey)} testID={`switch-${filterKey}`}>
          <Text>{value ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>
      </View>
    ),
  }
})

jest.mock('@/components/feature/FilterModal/RatingSection', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    RatingSection: ({
      title,
      ratingKey,
      ratings,
      onRatingChange,
    }: {
      title: string
      ratingKey: string
      ratings: number[]
      onRatingChange: (key: string, rating: number) => void
    }) => (
      <View testID={`rating-section-${ratingKey}`}>
        <Text>{title}</Text>
        {ratings?.map(rating => (
          <TouchableOpacity
            key={rating}
            onPress={() => onRatingChange(ratingKey, rating)}
            testID={`rating-${ratingKey}-${rating}`}
          >
            <Text>{rating}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
  }
})

jest.mock('@/components/feature/FilterModal/AirportServices', () => {
  const { View, Text } = require('react-native')
  return {
    AirportServices: () => (
      <View testID="airport-services">
        <Text>Airport Services</Text>
      </View>
    ),
  }
})

jest.mock('@/constants/filterModalOptions', () => ({
  getRegions: () => [
    { label: 'Europe', value: 'europe' },
    { label: 'Asia', value: 'asia' },
    { label: 'North America', value: 'north_america' },
  ],
  getAirportTypes: () => [
    { label: 'International', value: 'international' },
    { label: 'Domestic', value: 'domestic' },
  ],
  getBusinessModels: () => [
    { label: 'Full Service', value: 'full_service' },
    { label: 'Low Cost', value: 'low_cost' },
  ],
  getGoogleRatings: () => [1, 2, 3, 4, 5],
  getSkytraxRatings: () => [1, 2, 3, 4, 5],
  getFoundingYearRanges: () => [
    { label: '1900-1950', value: '1900-1950' },
    { label: '1950-2000', value: '1950-2000' },
    { label: '2000-2024', value: '2000-2024' },
  ],
  getPassengerCapacityRanges: () => [
    { label: '0-1M', value: '0-1000000' },
    { label: '1M-10M', value: '1000000-10000000' },
    { label: '10M+', value: '10000000+' },
  ],
  getEmployeeCountRanges: () => [
    { label: '0-1000', value: '0-1000' },
    { label: '1000-10000', value: '1000-10000' },
    { label: '10000+', value: '10000+' },
  ],
  getDestinationCountRanges: () => [
    { label: '0-50', value: '0-50' },
    { label: '50-100', value: '50-100' },
    { label: '100+', value: '100+' },
  ],
  getDestinationCountriesRanges: () => [
    { label: '0-10', value: '0-10' },
    { label: '10-50', value: '10-50' },
    { label: '50+', value: '50+' },
  ],
  getDomesticConnectionsRanges: () => [
    { label: '0-20', value: '0-20' },
    { label: '20-50', value: '20-50' },
    { label: '50+', value: '50+' },
  ],
  getInternationalConnectionsRanges: () => [
    { label: '0-20', value: '0-20' },
    { label: '20-100', value: '20-100' },
    { label: '100+', value: '100+' },
  ],
  getElevationFtRanges: () => [],
  getBaggageCapacityRanges: () => [],
  getTerminalCountRanges: () => [],
  getTerminalAreaHectaresRanges: () => [],
  getAirportAreaHectaresRanges: () => [],
  getApronCountRanges: () => [],
  getRunwayCountRanges: () => [],
  getRunwayLengthMRanges: () => [],
  getTowerHeightMRanges: () => [],
  getParkingCapacityVehiclesRanges: () => [],
  getLoungeCountRanges: () => [],
  getSecurityQueueTimeRanges: () => [],
  getCheckinTimeAvgRanges: () => [],
  getTotalAirplaneRanges: () => [],
  getAverageAgeRanges: () => [],
  getAirplaneTypeCountRanges: () => [],
  getAlliances: () => [],
  getBusinessTypes: () => [],
}))

jest.mock('@/assets/icons/close', () => 'CloseIcon')

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      airplaneType: 'Airplane Type',
      airportArea: 'Airport Area',
      airportType: 'Airport Type',
      alliance: 'Alliance',
      apply: 'Apply',
      apron: 'Apron',
      averageAgeYears: 'Average Age (Years)',
      businessModel: 'Business Model',
      businessType: 'Business Type',
      checkIn: 'Check-in Time',
      clear: 'Clear',
      domesticDestinations: 'Domestic Destinations',
      elevation: 'Elevation',
      filter: 'Filter',
      freeWifi: 'Free WiFi',
      internationalDestination: 'International Destinations',
      lounges: 'Lounges',
      luggage: 'Luggage Capacity',
      metro: 'Metro Access',
      minGoogleRating: 'Min Google Rating',
      minSkytraxRating: 'Min Skytrax Rating',
      numberOfCountries: 'Number of Countries',
      numberOfDestination: 'Number of Destinations',
      numberOfEmployees: 'Number of Employees',
      numberOfPassengers: 'Number of Passengers',
      open24Hours: '24/7 Open',
      parking: 'Parking',
      region: 'Region',
      runway: 'Runway',
      runwaym: 'Runway Length (m)',
      security: 'Security Queue Time',
      terminal: 'Terminal',
      terminalArea: 'Terminal Area',
      totalAirplane: 'Total Airplanes',
      tower: 'Tower Height',
      yearOfEstablishment: 'Year of Establishment',
    }
    return translations[key] || key
  })
})

const mockedDefaultProps: FilterModalPropsType = {
  currentFilters: {},
  onApply: jest.fn(),
  onClose: jest.fn(),
  type: 'airports',
}

const ref = createRef<any>()

describe('FilterModal', () => {
  describe('Rendering Tests', () => {
    it('should render the FilterModal correctly with default props', () => {
      const { getByText, getByTestId } = render(<FilterModal {...mockedDefaultProps} ref={ref} />)

      expect(getByText('Filter')).toBeTruthy()
      expect(getByTestId('filter-close-button')).toBeTruthy()
      expect(getByTestId('filter-clear-button')).toBeTruthy()
      expect(getByTestId('filter-apply-button')).toBeTruthy()
    })

    it('should render airport-specific filters when type is airports', () => {
      const { getByTestId, queryByTestId } = render(
        <FilterModal {...mockedDefaultProps} ref={ref} type="airports" />,
      )

      expect(getByTestId('filter-section-airportType')).toBeTruthy()
      expect(getByTestId('switch-filter-is24Hour')).toBeTruthy()
      expect(getByTestId('switch-filter-freeWifi')).toBeTruthy()
      expect(getByTestId('switch-filter-hasMetro')).toBeTruthy()
      expect(getByTestId('rating-section-minGoogleRating')).toBeTruthy()
      expect(queryByTestId('rating-section-minSkytraxRating')).toBeFalsy()
    })

    it('should render airline-specific filters when type is airlines', () => {
      const { getByTestId, queryByTestId } = render(
        <FilterModal {...mockedDefaultProps} ref={ref} type="airlines" />,
      )

      expect(getByTestId('filter-section-businessModel')).toBeTruthy()
      expect(getByTestId('rating-section-minSkytraxRating')).toBeTruthy()
      expect(queryByTestId('filter-section-airportType')).toBeFalsy()
      expect(queryByTestId('switch-filter-is24Hour')).toBeFalsy()
    })

    it('should render common filters for both types', () => {
      const { getByTestId } = render(<FilterModal {...mockedDefaultProps} ref={ref} />)

      expect(getByTestId('filter-section-region')).toBeTruthy()
      expect(getByTestId('filter-section-foundingYear')).toBeTruthy()
      expect(getByTestId('filter-section-passengerCapacity')).toBeTruthy()
      expect(getByTestId('filter-section-employeeCount')).toBeTruthy()
      expect(getByTestId('filter-section-destinationCount')).toBeTruthy()
    })
  })

  describe('Filter Interaction Tests', () => {
    it('should handle single select toggle correctly', () => {
      const { getByTestId } = render(<FilterModal {...mockedDefaultProps} ref={ref} />)

      const regionOption = getByTestId('filter-option-region-europe')
      fireEvent.press(regionOption)

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith(
        expect.objectContaining({ region: 'europe' }),
      )
    })

    it('should handle boolean toggle correctly for airports', () => {
      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} ref={ref} type="airports" />,
      )

      const switchButton = getByTestId('switch-is24Hour')
      fireEvent.press(switchButton)

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith(
        expect.objectContaining({ is24Hour: true }),
      )
    })

    it('should handle rating change correctly for airports', () => {
      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} ref={ref} type="airports" />,
      )

      const ratingButton = getByTestId('rating-minGoogleRating-4')
      fireEvent.press(ratingButton)

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith(
        expect.objectContaining({ minGoogleRating: 4 }),
      )
    })

    it('should handle rating change correctly for airlines', () => {
      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} ref={ref} type="airlines" />,
      )

      const ratingButton = getByTestId('rating-minSkytraxRating-3')
      fireEvent.press(ratingButton)

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith(
        expect.objectContaining({ minSkytraxRating: 3 }),
      )
    })

    it('should remove filter when same option is selected twice', () => {
      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} currentFilters={{ region: 'europe' }} ref={ref} />,
      )

      const regionOption = getByTestId('filter-option-region-europe')
      fireEvent.press(regionOption)

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith({})
    })
  })

  describe('Filter Management Tests', () => {
    it('should clear all filters when clear button is pressed', () => {
      const currentFilters = {
        region: 'europe',
        airportType: 'international',
        is24Hour: true,
        minGoogleRating: 4,
      }

      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} currentFilters={currentFilters} ref={ref} />,
      )

      const clearButton = getByTestId('filter-clear-button')
      fireEvent.press(clearButton)

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith({})
    })

    it('should apply filters and close modal when apply button is pressed', () => {
      const { getByTestId } = render(<FilterModal {...mockedDefaultProps} ref={ref} />)

      const regionOption = getByTestId('filter-option-region-asia')
      fireEvent.press(regionOption)

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith({ region: 'asia' })
      expect(mockedDefaultProps.onClose).toHaveBeenCalled()
    })

    it('should close modal when close button is pressed', () => {
      const { getByTestId } = render(<FilterModal {...mockedDefaultProps} ref={ref} />)

      const closeButton = getByTestId('filter-close-button')
      fireEvent.press(closeButton)

      expect(mockedDefaultProps.onClose).toHaveBeenCalled()
    })
  })

  describe('Multiple Filter Selection Tests', () => {
    it('should handle multiple filter selections correctly', () => {
      const { getByTestId } = render(<FilterModal {...mockedDefaultProps} ref={ref} />)

      fireEvent.press(getByTestId('filter-option-region-europe'))
      fireEvent.press(getByTestId('filter-option-foundingYear-1900-1950'))
      fireEvent.press(getByTestId('filter-option-passengerCapacity-1000000-10000000'))

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith({
        region: 'europe',
        foundingYear: '1900-1950',
        passengerCapacity: '1000000-10000000',
      })
    })

    it('should maintain existing filters when adding new ones', () => {
      const currentFilters = { region: 'europe', airportType: 'international' }
      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} currentFilters={currentFilters} ref={ref} />,
      )

      fireEvent.press(getByTestId('filter-option-foundingYear-1950-2000'))

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith({
        region: 'europe',
        airportType: 'international',
        foundingYear: '1950-2000',
      })
    })
  })

  describe('Props Update Tests', () => {
    it('should update local filters when currentFilters prop changes', () => {
      const initialFilters = { region: 'europe' }
      const { rerender, getByTestId } = render(
        <FilterModal {...mockedDefaultProps} currentFilters={initialFilters} ref={ref} />,
      )

      const newFilters = { region: 'asia', airportType: 'domestic' }
      rerender(<FilterModal {...mockedDefaultProps} currentFilters={newFilters} ref={ref} />)

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith(newFilters)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty currentFilters gracefully', () => {
      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} currentFilters={{}} ref={ref} />,
      )

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith({})
    })

    it('should handle undefined currentFilters', () => {
      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} currentFilters={{}} ref={ref} />,
      )

      expect(getByTestId('filter-section-region')).toBeTruthy()
    })

    it('should handle null filter values', () => {
      const currentFilters = { region: null }
      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} currentFilters={currentFilters} ref={ref} />,
      )

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalled()
    })
  })

  describe('Complex Filter Scenarios', () => {
    it('should handle mixed filter types correctly', () => {
      const { getByTestId } = render(
        <FilterModal {...mockedDefaultProps} ref={ref} type="airports" />,
      )

      fireEvent.press(getByTestId('filter-option-region-north_america'))

      fireEvent.press(getByTestId('switch-freeWifi'))

      fireEvent.press(getByTestId('rating-minGoogleRating-5'))

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith({
        region: 'north_america',
        freeWifi: true,
        minGoogleRating: 5,
      })
    })

    it('should toggle boolean filters correctly', () => {
      const currentFilters = { freeWifi: true, hasMetro: true }
      const { getByTestId } = render(
        <FilterModal
          {...mockedDefaultProps}
          currentFilters={currentFilters}
          ref={ref}
          type="airports"
        />,
      )

      fireEvent.press(getByTestId('switch-freeWifi'))

      const applyButton = getByTestId('filter-apply-button')
      fireEvent.press(applyButton)

      expect(mockedDefaultProps.onApply).toHaveBeenCalledWith({
        hasMetro: true,
      })
    })
  })
})

describe('FilterModal Snapshot', () => {
  it('should render the FilterModal successfully for airports', () => {
    const ref = createRef<any>()
    const { toJSON } = render(<FilterModal {...mockedDefaultProps} ref={ref} type="airports" />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render the FilterModal successfully for airlines', () => {
    const ref = createRef<any>()
    const { toJSON } = render(<FilterModal {...mockedDefaultProps} ref={ref} type="airlines" />)

    expect(toJSON()).toMatchSnapshot()
  })
})
