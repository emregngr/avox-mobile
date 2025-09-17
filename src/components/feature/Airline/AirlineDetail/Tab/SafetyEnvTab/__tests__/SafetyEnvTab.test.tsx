import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { SafetyEnvTab } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/themes', () => ({
  themeColors: {
    light: { onPrimary100: '#ffffff' },
    dark: { onPrimary100: '#000000' },
  },
}))

const mockedSafety = jest.fn()
const mockedEnvironmental = jest.fn()

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Sections/Safety', () => {
  const { View, Text } = require('react-native')
  return {
    Safety: (props: any) => {
      mockedSafety(props)
      return (
        <View testID="safety-component">
          <Text testID="safety-title">{props.title}</Text>
          <Text testID="certifications-title">{props.certificationsTitle}</Text>
          <Text testID="safety-record-title">{props.safetyRecordTitle}</Text>
        </View>
      )
    },
  }
})

jest.mock(
  '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Sections/Environmental',
  () => {
    const { View, Text } = require('react-native')
    return {
      Environmental: (props: any) => {
        mockedEnvironmental(props)
        return (
          <View testID="environmental-component">
            <Text testID="environmental-title">{props.title}</Text>
            <Text testID="environmental-subtitle">{props.subtitle}</Text>
          </View>
        )
      },
    }
  },
)

const mockedAirlineData: any = {
  id: '1',
  name: 'Turkish Airlines',
  safety: {
    certifications: ['IOSA', 'ISO 9001:2015'],
    safetyRecord: {
      accidentRate: 0.02,
      incidentRate: 0.08,
      lastAccident: '2019-05-15',
    },
  },
  environmental: {
    carbonOffset: true,
    fuelEfficiency: 78,
    sustainabilityRating: 'B+',
    initiatives: ['Carbon Neutral Growth', 'Fuel Efficiency Programs'],
  },
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      certifications: 'Certifications',
      environmentalPolicy: 'Environmental Policy',
      environmentalResponsibility: 'Environmental Responsibility',
      safetyInformation: 'Safety Information',
      safetyRecord: 'Safety Record',
    }
    return translations[key] || key
  })
})

describe('SafetyEnvTab Component', () => {
  it('renders SafetyEnvTab component successfully', async () => {
    const { getByTestId } = render(<SafetyEnvTab airlineData={mockedAirlineData} />)
    await waitFor(() => {
      expect(getByTestId('safety-component')).toBeTruthy()
      expect(getByTestId('environmental-component')).toBeTruthy()
    })
  })

  it('displays correct safety titles', async () => {
    const { getByTestId } = render(<SafetyEnvTab airlineData={mockedAirlineData} />)
    await waitFor(() => {
      expect(getByTestId('safety-title')).toHaveTextContent('Safety Information')
      expect(getByTestId('certifications-title')).toHaveTextContent('Certifications')
      expect(getByTestId('safety-record-title')).toHaveTextContent('Safety Record')
    })
  })

  it('displays correct environmental titles', async () => {
    const { getByTestId } = render(<SafetyEnvTab airlineData={mockedAirlineData} />)
    await waitFor(() => {
      expect(getByTestId('environmental-title')).toHaveTextContent('Environmental Policy')
      expect(getByTestId('environmental-subtitle')).toHaveTextContent(
        'Environmental Responsibility',
      )
    })
  })
})

describe('Prop Passing Checks', () => {
  beforeEach(() => {
    mockedGetLocale.mockImplementation((key: string) => key)
  })

  it('should pass correct props to child components', () => {
    render(<SafetyEnvTab airlineData={mockedAirlineData} />)

    expect(mockedSafety).toHaveBeenCalledWith({
      certifications: mockedAirlineData.safety.certifications,
      safetyRecord: mockedAirlineData.safety.safetyRecord,
      title: 'safetyInformation',
      certificationsTitle: 'certifications',
      safetyRecordTitle: 'safetyRecord',
      iconColor: '#ffffff',
    })

    expect(mockedEnvironmental).toHaveBeenCalledWith({
      content: mockedAirlineData.environmental,
      title: 'environmentalPolicy',
      subtitle: 'environmentalResponsibility',
      iconColor: '#ffffff',
    })
  })

  it('should call child components exactly once', () => {
    render(<SafetyEnvTab airlineData={mockedAirlineData} />)
    expect(mockedSafety).toHaveBeenCalledTimes(1)
    expect(mockedEnvironmental).toHaveBeenCalledTimes(1)
  })

  it('should pass undefined for missing data sections', () => {
    const incompleteData = {
      id: '1',
      name: 'Partial Airline',
    } as any
    render(<SafetyEnvTab airlineData={incompleteData} />)

    expect(mockedSafety).toHaveBeenCalledWith(
      expect.objectContaining({
        certifications: undefined,
        safetyRecord: undefined,
      }),
    )

    expect(mockedEnvironmental).toHaveBeenCalledWith(
      expect.objectContaining({
        content: undefined,
      }),
    )
  })
})

describe('SafetyEnvTab - Minimal Tests', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(<SafetyEnvTab airlineData={mockedAirlineData} />)
    }).not.toThrow()
  })

  it('handles null and undefined airline data', () => {
    const { rerender } = render(<SafetyEnvTab airlineData={null as any} />)
    expect(() => {
      rerender(<SafetyEnvTab airlineData={undefined as any} />)
    }).not.toThrow()
  })
})

describe('SafetyEnvTab Component Snapshot', () => {
  it('should render the SafetyEnvTab Component successfully', () => {
    const { toJSON } = render(<SafetyEnvTab airlineData={mockedAirlineData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
