import { render } from '@testing-library/react-native'
import React from 'react'

import { RouteRowCard } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Cards/RouteRowCard'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedOrigin = 'IST'
const mockedDestination = 'ESB'
const mockedIconColor = '#1E90FF'

describe('RouteRowCard Component', () => {
  it('should render the origin and destination IATA codes correctly', () => {
    const { getByText } = render(
      <RouteRowCard
        destinationIata={mockedDestination}
        iconColor={mockedIconColor}
        origin={mockedOrigin}
      />,
    )

    expect(getByText(mockedOrigin)).toBeTruthy()
    expect(getByText(mockedDestination)).toBeTruthy()
  })

  it('should render three icons', () => {
    const { getAllByTestId } = render(
      <RouteRowCard
        destinationIata={mockedDestination}
        iconColor={mockedIconColor}
        origin={mockedOrigin}
      />,
    )

    const icons = getAllByTestId('mocked-material-community-icon')
    expect(icons.length).toBe(3)
  })

  it('should pass the correct props to all MaterialCommunityIcons', () => {
    const { getAllByTestId } = render(
      <RouteRowCard
        destinationIata={mockedDestination}
        iconColor={mockedIconColor}
        origin={mockedOrigin}
      />,
    )

    const icons = getAllByTestId('mocked-material-community-icon')

    icons.forEach(icon => {
      expect(icon.props.color).toBe(mockedIconColor)
    })

    const locationIcons = icons.filter(icon => icon.props.name === 'map-marker-outline')
    const airplaneIcon = icons.find(icon => icon.props.name === 'airplane')

    expect(locationIcons.length).toBe(2)
    locationIcons.forEach(icon => expect(icon.props.size).toBe(16))

    expect(airplaneIcon).toBeDefined()
    expect(airplaneIcon?.props.size).toBe(20)
  })

  it('should pass the correct props to both ThemedText components', () => {
    const { getByText } = render(
      <RouteRowCard
        destinationIata={mockedDestination}
        iconColor={mockedIconColor}
        origin={mockedOrigin}
      />,
    )

    const originText = getByText(mockedOrigin)
    const destinationText = getByText(mockedDestination)

    expect(originText.props.color).toBe('text-90')
    expect(originText.props.type).toBe('body1')
    expect(destinationText.props.color).toBe('text-90')
    expect(destinationText.props.type).toBe('body1')
  })
})

describe('RouteRowCard Component Snapshot', () => {
  it('should render the RouteRowCard Component successfully', () => {
    const { toJSON } = render(
      <RouteRowCard
        destinationIata={mockedDestination}
        iconColor={mockedIconColor}
        origin={mockedOrigin}
      />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
