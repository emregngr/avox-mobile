import { render } from '@testing-library/react-native'
import React from 'react'

import { DestinationRowCard } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Cards/DestinationRowCard'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedDestination = 'Ankara'
const mockedIconColor = '#FFA500'

describe('DestinationRowCard Component', () => {
  it('should render the destination text correctly', () => {
    const { getByText } = render(
      <DestinationRowCard destination={mockedDestination} iconColor={mockedIconColor} />,
    )

    const destinationText = getByText(mockedDestination)
    expect(destinationText).toBeTruthy()
  })

  it('should pass the correct props to MaterialCommunityIcons', () => {
    const { getByTestId } = render(
      <DestinationRowCard destination={mockedDestination} iconColor={mockedIconColor} />,
    )

    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.name).toBe('airplane')
    expect(icon.props.size).toBe(20)
    expect(icon.props.color).toBe(mockedIconColor)
  })

  it('should pass the correct props to ThemedText', () => {
    const { getByText } = render(
      <DestinationRowCard destination={mockedDestination} iconColor={mockedIconColor} />,
    )

    const themedText = getByText(mockedDestination)

    expect(themedText.props.color).toBe('text-90')
    expect(themedText.props.type).toBe('body2')
  })

  it('should render correctly with different props', () => {
    const newDestination = 'İzmir'
    const newColor = '#0000FF'

    const { getByText, getByTestId } = render(
      <DestinationRowCard destination={newDestination} iconColor={newColor} />,
    )

    expect(getByText(newDestination)).toBeTruthy()
    const icon = getByTestId('mocked-material-community-icon')
    expect(icon.props.color).toBe(newColor)
  })
})

describe('DestinationRowCard Component Snapshot', () => {
  it('should render the DestinationRowCard Component successfully', () => {
    const { toJSON } = render(
      <DestinationRowCard destination={mockedDestination} iconColor={mockedIconColor} />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
