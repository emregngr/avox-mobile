import { render } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Maintenance from '@/app/(maintenance)/maintenance'
import { getLocale } from '@/locales/i18next'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const renderWithSafeAreaProvider = (component: ReactNode) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
        frame: { x: 0, y: 0, width: 0, height: 0 },
      }}
    >
      {component}
    </SafeAreaProvider>,
  )

describe('Maintenance Screen', () => {
  it('should render the icon, title, and maintenance text correctly', () => {
    const mockedTitle = 'Application Title'
    const mockedMaintenanceText =
      'The application is currently under maintenance. Please try again later.'

    mockedGetLocale.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        avox: mockedTitle,
        maintenanceText: mockedMaintenanceText,
      }
      return translations[key] || key
    })

    const { getByText, getByTestId } = renderWithSafeAreaProvider(<Maintenance />)

    expect(getByText(mockedTitle)).toBeTruthy()
    expect(getByText(mockedMaintenanceText)).toBeTruthy()

    expect(mockedGetLocale).toHaveBeenCalledWith('avox')
    expect(mockedGetLocale).toHaveBeenCalledWith('maintenanceText')

    const icon = getByTestId('maintenance-icon')
    const expectedIconSource = require('@/assets/images/icon-ios.png')
    expect(icon.props.source).toBe(expectedIconSource)
  })
})

describe('Maintenance Screen Snapshot', () => {
  it('should render the Maintenance Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Maintenance />)

    expect(toJSON()).toMatchSnapshot()
  })
})
