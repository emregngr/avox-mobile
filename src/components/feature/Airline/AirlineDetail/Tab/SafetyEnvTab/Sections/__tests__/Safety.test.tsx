import { render } from '@testing-library/react-native'
import React from 'react'

import { Safety } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Sections/Safety'

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

jest.mock(
  '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Cards/CertificationsList',
  () => {
    const { View, Text } = require('react-native')
    return {
      CertificationsList: ({
        title,
        certifications,
        iconColor,
      }: {
        title: string
        certifications: string[]
        iconColor: string
      }) => (
        <View
          data-cert-count={certifications.length}
          data-icon-color={iconColor}
          testID="mocked-certifications-list"
        >
          <Text>{title}</Text>
        </View>
      ),
    }
  },
)

const mockedDefaultProps = {
  title: 'Airline Safety Overview',
  safetyRecordTitle: 'Accident History',
  safetyRecord: 'This airline has maintained an impeccable safety record for over 15 years.',
  certificationsTitle: 'Global Certifications',
  certifications: ['IOSA Certified', 'EASA Approved'],
  iconColor: '#27ae60',
}

describe('Safety Component', () => {
  it('should pass the main title to the AirlineSectionRow component', () => {
    const { getByTestId } = render(<Safety {...mockedDefaultProps} />)

    const sectionRow = getByTestId('mocked-section-row')
    expect(sectionRow.props.title).toBe(mockedDefaultProps.title)
  })

  it('should render the safety record text', () => {
    const { getByText } = render(<Safety {...mockedDefaultProps} />)
    expect(getByText(mockedDefaultProps.safetyRecord)).toBeTruthy()
  })

  it('should pass the correct props to the SafetyHeader component', () => {
    const { getByTestId, getByText } = render(<Safety {...mockedDefaultProps} />)

    const header = getByTestId('mocked-safety-header')

    expect(getByText(mockedDefaultProps.safetyRecordTitle)).toBeTruthy()

    expect(header.props['data-icon-color']).toBe(mockedDefaultProps.iconColor)

    expect(header.props['data-icon-name']).toBe('shield-check')
  })

  it('should pass the correct props to the CertificationsList component', () => {
    const { getByTestId, getByText } = render(<Safety {...mockedDefaultProps} />)

    const list = getByTestId('mocked-certifications-list')

    expect(getByText(mockedDefaultProps.certificationsTitle)).toBeTruthy()

    expect(list.props['data-icon-color']).toBe(mockedDefaultProps.iconColor)
    expect(list.props['data-cert-count']).toBe(mockedDefaultProps.certifications.length)
  })
})

describe('Safety Component Snapshot', () => {
  it('should render the Safety Component successfully', () => {
    const { toJSON } = render(<Safety {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
