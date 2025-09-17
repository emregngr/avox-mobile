import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { NearbyPlacesTab } from '@/components/feature/Airport/AirportDetail/Tab/NearbyPlacesTab'
import { useMapNavigation } from '@/hooks/maps/useMapNavigation'
import useLocaleStore from '@/store/locale'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

const mockedAttractionCard = jest.fn()
const mockOpenMapNavigation = jest.fn()

jest.mock('@/hooks/maps/useMapNavigation')

const mockedUseMapNavigation = useMapNavigation as jest.MockedFunction<typeof useMapNavigation>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock(
  '@/components/feature/Airport/AirportDetail/Tab/NearbyPlacesTab/Cards/AttractionCard',
  () => {
    const { View, Text, TouchableOpacity } = require('react-native')
    return {
      AttractionCard: (props: {
        attractionName: string
        formattedDistance: string
        getDirectionText: string
        handleDirectionPress: () => void
      }) => {
        mockedAttractionCard(props)
        return (
          <View testID="mocked-attraction-card">
            <Text>{props.attractionName}</Text>
            <Text>{props.formattedDistance}</Text>
            <TouchableOpacity
              onPress={props.handleDirectionPress}
              testID={`button-${props.attractionName}`}
            >
              <Text>{props.getDirectionText}</Text>
            </TouchableOpacity>
          </View>
        )
      },
    }
  },
)

const mockedAirportData: any = {
  airportId: 'IST',
  nearbyAttractions: [
    {
      attractionId: '1',
      attractionName: 'Sultanahmet Camii',
      description: "İstanbul, Türkiye'de tarihi bir cami.",
      distanceKm: 45.2,
      attractionCoordinates: {
        attractionLatitude: 41.0055,
        attractionLongitude: 28.9768,
      },
    },
    {
      attractionId: '2',
      attractionName: 'Ayasofya',
      description: 'Önemli bir kültürel ve tarihi mekan.',
      distanceKm: 45.5,
      attractionCoordinates: {
        attractionLatitude: 41.0086,
        attractionLongitude: 28.9802,
      },
    },
  ],
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedUseMapNavigation.mockReturnValue({ openMapNavigation: mockOpenMapNavigation })
})

describe('NearbyPlacesTab Component', () => {
  it('should render a list of attraction cards based on airport data', () => {
    const { getByText } = render(<NearbyPlacesTab airportData={mockedAirportData} />)

    expect(getByText('Sultanahmet Camii')).toBeTruthy()
    expect(getByText('Ayasofya')).toBeTruthy()
    expect(getByText('45.2 km')).toBeTruthy()
    expect(getByText('45.5 km')).toBeTruthy()
  })

  it('should render an AttractionCard for each item in the array', () => {
    render(<NearbyPlacesTab airportData={mockedAirportData} />)
    expect(mockedAttractionCard).toHaveBeenCalledTimes(2)
  })

  it('should pass correct props to the first AttractionCard', () => {
    render(<NearbyPlacesTab airportData={mockedAirportData} />)
    const firstAttraction = mockedAirportData.nearbyAttractions[0]

    expect(mockedAttractionCard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        attractionName: firstAttraction.attractionName,
        formattedDistance: `${firstAttraction.distanceKm} km`,
        getDirectionText: 'getDirection',
        handleDirectionPress: expect.any(Function),
      }),
    )
  })

  it('should call openMapNavigation with correct coordinates when a direction button is pressed', () => {
    const { getByTestId } = render(<NearbyPlacesTab airportData={mockedAirportData} />)

    const sultanahmetButton = getByTestId('button-Sultanahmet Camii')
    fireEvent.press(sultanahmetButton)

    expect(mockOpenMapNavigation).toHaveBeenCalledTimes(1)
    const firstAttraction = mockedAirportData.nearbyAttractions[0]
    expect(mockOpenMapNavigation).toHaveBeenCalledWith(
      firstAttraction.attractionCoordinates.attractionLatitude,
      firstAttraction.attractionCoordinates.attractionLongitude,
      firstAttraction.attractionName,
    )
  })

  it('should render nothing when there are no nearby attractions', () => {
    const emptyAirportData = { ...mockedAirportData, nearbyAttractions: [] }
    const { queryByTestId } = render(<NearbyPlacesTab airportData={emptyAirportData} />)

    expect(queryByTestId('mocked-attraction-card')).toBeNull()

    expect(mockedAttractionCard).not.toHaveBeenCalled()
  })

  it('should handle undefined or null airportData and attractions gracefully', () => {
    const { rerender, queryByTestId } = render(<NearbyPlacesTab airportData={undefined as any} />)
    expect(queryByTestId('mocked-attraction-card')).toBeNull()
    expect(mockedAttractionCard).not.toHaveBeenCalled()

    rerender(<NearbyPlacesTab airportData={{ ...mockedAirportData, nearbyAttractions: null }} />)
    expect(queryByTestId('mocked-attraction-card')).toBeNull()
    expect(mockedAttractionCard).not.toHaveBeenCalled()
  })
})

describe('NearbyPlacesTab Component Snapshot', () => {
  it('should render the NearbyPlacesTab Component successfully', () => {
    const { toJSON } = render(<NearbyPlacesTab airportData={mockedAirportData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
