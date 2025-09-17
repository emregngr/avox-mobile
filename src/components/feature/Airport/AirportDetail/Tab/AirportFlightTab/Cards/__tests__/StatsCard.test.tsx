import { render } from '@testing-library/react-native'
import React from 'react'

import { StatsCard } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Cards/StatsCard'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedDefaultProps = {
  iconColor: '#4CAF50',
  iconName: 'airplane-takeoff' as const,
  label: 'Total Destinations',
  value: 150,
}

describe('StatsCard Component', () => {
  it('should render the value and label text correctly', () => {
    const { getByText } = render(<StatsCard {...mockedDefaultProps} />)

    expect(getByText(String(mockedDefaultProps.value))).toBeTruthy()
    expect(getByText(mockedDefaultProps.label)).toBeTruthy()
  })

  it('should pass the correct props to MaterialCommunityIcons', () => {
    const { getByTestId } = render(<StatsCard {...mockedDefaultProps} />)

    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.name).toBe(mockedDefaultProps.iconName)
    expect(icon.props.size).toBe(28)
    expect(icon.props.color).toBe(mockedDefaultProps.iconColor)
  })

  it('should pass the correct props to both ThemedText components', () => {
    const { getByText } = render(<StatsCard {...mockedDefaultProps} />)

    const valueText = getByText(String(mockedDefaultProps.value))
    const labelText = getByText(mockedDefaultProps.label)

    expect(valueText.props.color).toBe('text-100')
    expect(valueText.props.type).toBe('h1')

    expect(labelText.props.color).toBe('text-90')
    expect(labelText.props.type).toBe('body3')
    expect(labelText.props.center).toBe(true)
    expect(labelText.props.lineBreakMode).toBe('tail')
    expect(labelText.props.numberOfLines).toBe(2)
  })

  it('should handle a string type for the value prop', () => {
    const propsWithStringValue = {
      ...mockedDefaultProps,
      value: '1.2k',
    }
    const { getByText } = render(<StatsCard {...propsWithStringValue} />)

    const valueText = getByText(propsWithStringValue.value)
    expect(valueText).toBeTruthy()
  })
})

describe('StatsCard Component Snapshot', () => {
  it('should render the StatsCard Component successfully', () => {
    const { toJSON } = render(<StatsCard {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
