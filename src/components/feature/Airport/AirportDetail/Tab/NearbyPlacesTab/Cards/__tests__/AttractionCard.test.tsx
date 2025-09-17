import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import type { AttractionCardProps } from '@/components/feature/Airport/AirportDetail/Tab/NearbyPlacesTab/Cards/AttractionCard'
import { AttractionCard } from '@/components/feature/Airport/AirportDetail/Tab/NearbyPlacesTab/Cards/AttractionCard'
import useThemeStore from '@/store/theme'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedDefaultProps: AttractionCardProps = {
  attractionName: 'Sultanahmet Square',
  description: 'A historic square in Istanbul with many famous landmarks.',
  formattedDistance: '2.5 km',
  getDirectionText: 'Get Directions',
  handleDirectionPress: jest.fn(),
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('AttractionCard Component', () => {
  it('should render all the provided information', () => {
    const { getByText } = render(<AttractionCard {...mockedDefaultProps} />)

    expect(getByText(mockedDefaultProps.attractionName)).toBeTruthy()
    expect(getByText(mockedDefaultProps.description)).toBeTruthy()
    expect(getByText(mockedDefaultProps.formattedDistance)).toBeTruthy()
    expect(getByText(mockedDefaultProps.getDirectionText)).toBeTruthy()
  })

  it('should call handleDirectionPress when the directions button is pressed', () => {
    const { getByText } = render(<AttractionCard {...mockedDefaultProps} />)

    const directionsButton = getByText(mockedDefaultProps.getDirectionText)

    fireEvent.press(directionsButton)

    expect(mockedDefaultProps.handleDirectionPress).toHaveBeenCalledTimes(1)
  })

  it('should apply truncation props to the text components', () => {
    const longTextProps = {
      ...mockedDefaultProps,
      attractionName: 'This is a very long attraction name that should be truncated',
      description:
        'This is a very long description that should also be truncated after five lines to avoid overflowing the card layout.',
    }
    const { getByText } = render(<AttractionCard {...longTextProps} />)

    const attractionNameText = getByText(longTextProps.attractionName)
    const descriptionText = getByText(longTextProps.description)

    expect(attractionNameText.props.numberOfLines).toBe(1)
    expect(attractionNameText.props.ellipsizeMode).toBe('tail')

    expect(descriptionText.props.numberOfLines).toBe(5)
    expect(descriptionText.props.ellipsizeMode).toBe('tail')
  })
})

describe('AttractionCard Component Snapshot', () => {
  it('should render the AttractionCard Component successfully', () => {
    const { toJSON } = render(<AttractionCard {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
