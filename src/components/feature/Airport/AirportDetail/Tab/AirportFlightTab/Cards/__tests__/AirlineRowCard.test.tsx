import { render } from '@testing-library/react-native'
import React from 'react'

import { AirlineRowCard } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Cards/AirlineRowCard'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedDefaultProps = {
  airline: 'Turkish Airlines',
  iconColor: '#E63946',
}

describe('AirlineRowCard Component', () => {
  it('should render the airline name correctly', () => {
    const { getByText } = render(<AirlineRowCard {...mockedDefaultProps} />)

    const airlineText = getByText(mockedDefaultProps.airline)
    expect(airlineText).toBeTruthy()
  })

  it('should pass the correct props to MaterialCommunityIcons', () => {
    const { getByTestId } = render(<AirlineRowCard {...mockedDefaultProps} />)

    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.name).toBe('airplane')
    expect(icon.props.size).toBe(20)
    expect(icon.props.color).toBe(mockedDefaultProps.iconColor)
  })

  it('should pass the correct props to ThemedText', () => {
    const { getByText } = render(<AirlineRowCard {...mockedDefaultProps} />)

    const themedText = getByText(mockedDefaultProps.airline)

    expect(themedText.props.color).toBe('text-90')
    expect(themedText.props.type).toBe('body2')
  })
})

describe('AirlineRowCard Component Snapshot', () => {
  it('should render the AirlineRowCard Component successfully', () => {
    const { toJSON } = render(<AirlineRowCard {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
