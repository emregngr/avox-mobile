import { render } from '@testing-library/react-native'
import React from 'react'

import { Alliance } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/Alliance'

const mockedAirlineSectionRow = jest.fn()

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/components/feature/Airline/AirlineDetail/AirlineSectionRow', () => {
  const { View } = require('react-native')
  return {
    AirlineSectionRow: (props: any) => {
      mockedAirlineSectionRow(props)
      return (
        <View testID="mocked-section-row" {...props}>
          {props.children}
        </View>
      )
    },
  }
})

const mockedDefaultProps = {
  alliance: 'Star Alliance',
  iconColor: '#0033A0',
  title: 'Global Alliance',
}

describe('Alliance Component', () => {
  it('should render the alliance name correctly', () => {
    const { getByText } = render(<Alliance {...mockedDefaultProps} />)

    expect(getByText(mockedDefaultProps.alliance)).toBeTruthy()
  })

  it('should pass the correct title to AirlineSectionRow', () => {
    const { getByTestId } = render(<Alliance {...mockedDefaultProps} />)

    const sectionRow = getByTestId('mocked-section-row')

    expect(sectionRow.props.title).toBe(mockedDefaultProps.title)
  })

  it('should pass the correct props to MaterialCommunityIcons', () => {
    const { getByTestId } = render(<Alliance {...mockedDefaultProps} />)

    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.name).toBe('shield')
    expect(icon.props.size).toBe(40)
    expect(icon.props.color).toBe(mockedDefaultProps.iconColor)
  })

  it('should pass the correct props to ThemedText', () => {
    const { getByText } = render(<Alliance {...mockedDefaultProps} />)

    const themedText = getByText(mockedDefaultProps.alliance)

    expect(themedText.props.color).toBe('text-90')
    expect(themedText.props.type).toBe('h4')
  })
})

describe('Alliance Component Snapshot', () => {
  it('should render the Alliance Component successfully', () => {
    const { toJSON } = render(<Alliance {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
