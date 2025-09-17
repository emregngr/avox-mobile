import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { FleetList } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetList'

const mockAirplaneRowCardSpy = jest.fn()

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Card/AirplaneRowCard', () => {
  const { Pressable, View, Text } = require('react-native')
  return {
    AirplaneRowCard: (props: { airplane: any; onImagePress: any }) => {
      mockAirplaneRowCardSpy(props)
      const { airplane, onImagePress } = props
      return (
        <View testID={`airplane-row-${airplane.type}`}>
          <Pressable
            onPress={() => onImagePress(airplane.type, 'some-image-key')}
            testID={`airplane-image-${airplane.type}`}
          >
            <Text>{airplane.type}</Text>
          </Pressable>
        </View>
      )
    },
  }
})

const mockedAirplanes: any = [
  { id: '1', type: 'B737-800', registration: 'TC-JHM' },
  { id: '2', type: 'A320-200', registration: 'TC-JPT' },
  { id: '3', type: 'B777-300ER', registration: 'TC-LJA' },
]

const mockedOnImagePress = jest.fn()

const mockedDefaultProps: any = {
  airplanes: mockedAirplanes,
  onImagePress: mockedOnImagePress,
  region: 'EU',
  totalAirplane: mockedAirplanes.length,
}

describe('FleetList Component', () => {
  it('should render the correct number of airplane cards', () => {
    const { getAllByTestId } = render(<FleetList {...mockedDefaultProps} />)
    const airplaneCards = getAllByTestId(/airplane-row-/)
    expect(airplaneCards).toHaveLength(mockedAirplanes.length)
  })

  it('should render nothing when the airplanes array is empty', () => {
    const { queryAllByTestId } = render(<FleetList {...mockedDefaultProps} airplanes={[]} />)
    const airplaneCards = queryAllByTestId(/airplane-row-/)
    expect(airplaneCards).toHaveLength(0)
  })

  it('should pass the correct props down to each AirplaneRowCard', () => {
    render(<FleetList {...mockedDefaultProps} />)
    expect(mockAirplaneRowCardSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        airplane: mockedAirplanes[0],
        region: 'EU',
        totalAirplane: mockedAirplanes.length,
      }),
    )
  })

  it('should call onImagePress with correct arguments when a card is pressed', () => {
    const { getByTestId } = render(<FleetList {...mockedDefaultProps} />)
    const firstAirplaneImage = getByTestId(`airplane-image-${mockedAirplanes[0].type}`)
    fireEvent.press(firstAirplaneImage)
    expect(mockedOnImagePress).toHaveBeenCalledTimes(1)
    expect(mockedOnImagePress).toHaveBeenCalledWith(mockedAirplanes[0].type, 'some-image-key')
  })

  it('should have correct performance props set on FlatList', () => {
    const { getByTestId } = render(<FleetList {...mockedDefaultProps} />)
    const flatList = getByTestId('fleet-list')
    expect(flatList.props.initialNumToRender).toBe(4)
    expect(flatList.props.maxToRenderPerBatch).toBe(3)
    expect(flatList.props.windowSize).toBe(7)
    expect(flatList.props.updateCellsBatchingPeriod).toBe(150)
    expect(flatList.props.removeClippedSubviews).toBe(true)
  })
})

describe('FleetList Component Snapshot', () => {
  it('should render the FleetList Component successfully', () => {
    const { toJSON } = render(<FleetList {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
