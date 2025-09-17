import { render } from '@testing-library/react-native'
import React from 'react'

import { AirplaneCard } from '@/components/feature/Home/AirplaneCard'
import type { TotalAirplaneType } from '@/types/feature/home'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedAirplane: TotalAirplaneType = {
  model: 'Boeing 737',
  count: 5,
  id: '1',
}

describe('AirplaneCard Component', () => {
  it('renders airplane model and count correctly', () => {
    const { getByText } = render(<AirplaneCard airplane={mockedAirplane} />)

    expect(getByText('Boeing 737')).toBeTruthy()
    expect(getByText('5')).toBeTruthy()
  })
})

describe('AirplaneCard Component Snapshot', () => {
  it('should render the AirplaneCard Component successfully', () => {
    const { toJSON } = render(<AirplaneCard airplane={mockedAirplane} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
