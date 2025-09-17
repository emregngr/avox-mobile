import { render } from '@testing-library/react-native'
import React from 'react'

import { Environmental } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Sections/Environmental'

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

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Cards/SafetyHeader', () => {
  const { View, Text } = require('react-native')
  return {
    SafetyHeader: ({
      title,
      iconName,
      iconColor,
    }: {
      title: string
      iconName: string
      iconColor: string
    }) => (
      <View data-icon-color={iconColor} data-icon-name={iconName} testID="mocked-safety-header">
        <Text>{title}</Text>
      </View>
    ),
  }
})

const mockedDefaultProps = {
  title: 'Environmental Impact',
  subtitle: 'Our Green Commitment',
  content:
    'We are dedicated to reducing emissions through fleet modernization and sustainable aviation fuels.',
  iconColor: '#16a085',
}

describe('Environmental Component', () => {
  it('should pass the main title to the AirlineSectionRow component', () => {
    const { getByTestId } = render(<Environmental {...mockedDefaultProps} />)

    const sectionRow = getByTestId('mocked-section-row')
    expect(sectionRow.props.title).toBe(mockedDefaultProps.title)
  })

  it('should pass the correct props to the SafetyHeader component', () => {
    const { getByText, getByTestId } = render(<Environmental {...mockedDefaultProps} />)

    const header = getByTestId('mocked-safety-header')

    expect(getByText(mockedDefaultProps.subtitle)).toBeTruthy()

    expect(header.props['data-icon-color']).toBe(mockedDefaultProps.iconColor)

    expect(header.props['data-icon-name']).toBe('leaf')
  })

  it('should render the main content text correctly', () => {
    const { getByText } = render(<Environmental {...mockedDefaultProps} />)

    expect(getByText(mockedDefaultProps.content)).toBeTruthy()
  })
})

describe('Environmental Component Snapshot', () => {
  it('should render the Environmental Component successfully', () => {
    const { toJSON } = render(<Environmental {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
