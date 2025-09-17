import { render } from '@testing-library/react-native'
import React from 'react'

import { RouteRowCard } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Cards/RouteRowCard'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedDefaultProps = {
  destinationIata: 'JFK',
  frequency: 'Daily',
  iconColor: '#4A90E2',
}

describe('RouteRowCard Component', () => {
  it('should render the destination and frequency correctly', () => {
    const { getByText } = render(<RouteRowCard {...mockedDefaultProps} />)

    expect(getByText(mockedDefaultProps.destinationIata)).toBeTruthy()
    expect(getByText(mockedDefaultProps.frequency)).toBeTruthy()
  })

  it('should pass the correct props to MaterialCommunityIcons', () => {
    const { getByTestId } = render(<RouteRowCard {...mockedDefaultProps} />)

    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.name).toBe('airplane')
    expect(icon.props.size).toBe(20)
    expect(icon.props.color).toBe(mockedDefaultProps.iconColor)
  })

  it('should pass the correct props to both ThemedText components', () => {
    const { getByText } = render(<RouteRowCard {...mockedDefaultProps} />)

    const destinationText = getByText(mockedDefaultProps.destinationIata)
    const frequencyText = getByText(mockedDefaultProps.frequency)

    expect(destinationText.props.color).toBe('text-90')
    expect(destinationText.props.type).toBe('body2')

    expect(frequencyText.props.color).toBe('text-90')
    expect(frequencyText.props.type).toBe('body3')
  })

  it('should handle a number type for the frequency prop', () => {
    const propsWithNumberFrequency = {
      ...mockedDefaultProps,
      frequency: 7,
    }
    const { getByText } = render(<RouteRowCard {...propsWithNumberFrequency} />)

    const frequencyText = getByText(String(propsWithNumberFrequency.frequency))
    expect(frequencyText).toBeTruthy()
  })
})

describe('RouteRowCard Component Snapshot', () => {
  it('should render the RouteRowCard Component successfully', () => {
    const { toJSON } = render(<RouteRowCard {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
