import { render } from '@testing-library/react-native'
import React from 'react'

import { FleetHeader } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetHeader'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

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

const mockedFleetDetailText = 'Aircraft Details'

const darkColors = themeColors.dark

const lightColors = themeColors.light

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })
})

describe('FleetHeader Component', () => {
  it('should render the fleet detail text correctly', () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })

    const { getByText } = render(<FleetHeader fleetDetailText={mockedFleetDetailText} />)

    expect(getByText(mockedFleetDetailText)).toBeTruthy()
  })

  it('should render the icon with correct fixed props', () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })
    const { getByTestId } = render(<FleetHeader fleetDetailText={mockedFleetDetailText} />)

    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.name).toBe('airplane')
    expect(icon.props.size).toBe(20)
  })

  it('should apply the correct icon color for the dark theme', () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })
    const { getByTestId } = render(<FleetHeader fleetDetailText={mockedFleetDetailText} />)

    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.color).toBe(darkColors.onPrimary100)
  })

  it('should apply the correct icon color for the light theme', () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
    const { getByTestId } = render(<FleetHeader fleetDetailText={mockedFleetDetailText} />)

    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.color).toBe(lightColors.onPrimary100)
  })
})

describe('FleetHeader Component Snapshot', () => {
  it('should render the FleetHeader Component successfully', () => {
    const { toJSON } = render(<FleetHeader fleetDetailText={mockedFleetDetailText} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
