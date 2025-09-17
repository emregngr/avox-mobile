import { fireEvent, render } from '@testing-library/react-native'
import * as Linking from 'expo-linking'
import React from 'react'

import { SocialMedia } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/SocialMedia'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedAirportSectionRow = jest.fn()

jest.mock('@/components/feature/Airport/AirportDetail/AirportSectionRow', () => {
  const { View } = require('react-native')
  return {
    AirportSectionRow: (props: any) => {
      mockedAirportSectionRow(props)
      return <View testID="airport-section-row">{props.children}</View>
    },
  }
})

jest.mock('@/assets/icons/instagram.svg', () => {
  const { View } = require('react-native')
  return (props: any) => <View {...props} />
})

jest.mock('@/assets/icons/linkedin.svg', () => {
  const { View } = require('react-native')
  return (props: any) => <View {...props} />
})

jest.mock('@/assets/icons/tiktok.svg', () => {
  const { View } = require('react-native')
  return (props: any) => <View {...props} />
})

jest.mock('@/assets/icons/x.svg', () => {
  const { View } = require('react-native')
  return (props: any) => <View {...props} />
})

jest.spyOn(Linking, 'openURL').mockResolvedValue(true)

const mockedAirportInfo: any = {
  socialMedia: {
    instagram: 'https://instagram.com/test',
    linkedin: 'https://linkedin.com/test',
    tiktok: 'https://tiktok.com/@test',
    x: 'https://x.com/test',
  },
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({
    selectedLocale: 'en',
  })

  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('SocialMedia Component', () => {
  it('renders all social media icons when all URLs are provided', () => {
    const { getByTestId } = render(<SocialMedia airportInfo={mockedAirportInfo} />)

    expect(getByTestId('Instagram')).toBeTruthy()
    expect(getByTestId('Linkedin')).toBeTruthy()
    expect(getByTestId('Tiktok')).toBeTruthy()
    expect(getByTestId('X')).toBeTruthy()
  })

  it('opens correct URL when an icon is pressed', () => {
    const { getByTestId } = render(<SocialMedia airportInfo={mockedAirportInfo} />)

    fireEvent.press(getByTestId('Instagram'))
    expect(Linking.openURL).toHaveBeenCalledWith('https://instagram.com/test')

    fireEvent.press(getByTestId('Linkedin'))
    expect(Linking.openURL).toHaveBeenCalledWith('https://linkedin.com/test')

    fireEvent.press(getByTestId('Tiktok'))
    expect(Linking.openURL).toHaveBeenCalledWith('https://tiktok.com/@test')

    fireEvent.press(getByTestId('X'))
    expect(Linking.openURL).toHaveBeenCalledWith('https://x.com/test')
  })

  it('renders nothing when no social media is provided', () => {
    const { queryByTestId } = render(<SocialMedia airportInfo={{ socialMedia: {} } as any} />)

    expect(queryByTestId('Instagram')).toBeNull()
    expect(queryByTestId('Linkedin')).toBeNull()
    expect(queryByTestId('Tiktok')).toBeNull()
    expect(queryByTestId('X')).toBeNull()
  })

  it('only renders icons for provided social media URLs', () => {
    const partialAirportInfo: any = {
      socialMedia: {
        instagram: 'https://instagram.com/test',
        x: 'https://x.com/test',
      },
    }

    const { getByTestId, queryByTestId } = render(<SocialMedia airportInfo={partialAirportInfo} />)

    expect(getByTestId('Instagram')).toBeTruthy()
    expect(getByTestId('X')).toBeTruthy()
    expect(queryByTestId('Linkedin')).toBeNull()
    expect(queryByTestId('Tiktok')).toBeNull()
  })

  it('handles undefined airportInfo gracefully', () => {
    const { queryByTestId } = render(<SocialMedia airportInfo={undefined as any} />)

    expect(queryByTestId('Instagram')).toBeNull()
    expect(queryByTestId('Linkedin')).toBeNull()
    expect(queryByTestId('Tiktok')).toBeNull()
    expect(queryByTestId('X')).toBeNull()
  })
})

describe('SocialMedia Component Snapshot', () => {
  it('should render the SocialMedia Component successfully', () => {
    const { toJSON } = render(<SocialMedia airportInfo={mockedAirportInfo} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
