import { fireEvent, render } from '@testing-library/react-native'
import { router, useLocalSearchParams } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AirlineDetail from '@/app/(airline)/airline-detail'
import { useAirlineById } from '@/hooks/services/useAirline'
import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import type { AirlineType } from '@/types/feature/airline'
import { shareAirline } from '@/utils/common/linkingService'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/hooks/services/useAirline')

jest.mock('@/hooks/services/useFavoriteToggle')

jest.mock('@/utils/common/linkingService')

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    FullScreenLoading: (props: any) => <View {...props} testID="full-screen-loading" />,

    Header: ({
      title,
      backIconOnPress,
      shareIconOnPress,
      rightIconOnPress,
    }: {
      title: string
      backIconOnPress: () => void
      shareIconOnPress: () => void
      rightIconOnPress: () => void
    }) => (
      <>
        <Text testID="header-title">{title}</Text>
        <TouchableOpacity onPress={backIconOnPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={shareIconOnPress} testID="share-button">
          <Text>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={rightIconOnPress} testID="favorite-button">
          <Text>Favorite</Text>
        </TouchableOpacity>
      </>
    ),

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    RenderDetailTabBar: (props: any) => <View {...props} testID="tab-bar" />,
  }
})

jest.mock('@/components/feature', () => {
  const { View } = require('react-native')

  return {
    AdBanner: () => null,
    AirlineHeader: (props: any) => <View {...props} testID="airline-header" />,
    CompanyTab: () => null,
    FleetTab: () => null,
    AirlineFlightTab: () => null,
    SafetyEnvTab: () => null,
  }
})

jest.mock('react-native-collapsible-tab-view', () => ({
  Tabs: {
    Container: ({
      children,
      renderHeader,
    }: {
      children: ReactNode
      renderHeader: () => ReactNode
    }) => (
      <>
        {renderHeader()}
        {children}
      </>
    ),

    Tab: ({ children }: { children: ReactNode }) => <>{children}</>,

    ScrollView: ({ children }: { children: ReactNode }) => <>{children}</>,
  },
}))

const mockedUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>

const mockedUseAirlineById = useAirlineById as jest.MockedFunction<typeof useAirlineById>
const mockedUseFavoriteToggle = useFavoriteToggle as jest.MockedFunction<typeof useFavoriteToggle>

const mockedAirline: AirlineType = {
  id: '1',
  name: 'ABX Air',
  iataCode: 'GB',
  icaoCode: 'ABX',
  logo: 'https://res.cloudinary.com/dzkssh0tp/image/upload/c_auto,w_800,q_auto,f_auto/v1758451911/GB_izo8ug.png',
  companyInfo: {
    foundingYear: '1980',
    parentCompany: 'Air Transport Services Group',
    employeeCount: 500,
    website: 'www.abxair.com',
    contactInfo: {
      phone: '+1-937-382-5591',
      email: 'info@abxair.com',
    },
    socialMedia: {
      x: 'https://x.com/abxair',
      linkedin: 'https://www.linkedin.com/company/abx-air-inc',
      instagram: '',
      tiktok: '',
    },
  },
  operations: {
    businessModel: 'cargo',
    businessType: 'regional',
    region: 'NA',
    country: 'United States',
    hub: {
      name: 'Wilmington Air Park',
      city: 'Wilmington, Ohio',
      address: 'Wilmington, Ohio, USA',
      coordinates: {
        latitude: 39.4283,
        longitude: -83.7921,
      },
    },
    slogan: '',
    alliance: 'none',
    skytraxRating: 4.1,
  },
  fleet: {
    totalAirplane: 27,
    averageAgeYears: 25.5,
    airplanes: [
      {
        type: 'Boeing 767-200F',
        count: 9,
        bodyType: 'wide_body',
        speedKmh: 956,
        rangeKm: 12000,
        capacityTons: 40,
      },
      {
        type: 'Boeing 767-300F',
        count: 18,
        bodyType: 'wide_body',
        speedKmh: 956,
        rangeKm: 11000,
        capacityTons: 52,
      },
    ],
    airplaneTypeCount: 2,
  },
  network: {
    destinations: ['Cincinnati', 'Miami', 'Los Angeles', 'Chicago'],
    routes: [
      {
        origin: 'CVG',
        destinationIata: 'MIA',
      },
      {
        origin: 'CVG',
        destinationIata: 'LAX',
      },
    ],
    destinationCount: 25,
    destinationCountries: 5,
    domesticConnections: 10,
    internationalConnections: 15,
  },
  safety: {
    safetyRecord: 'No fatal accidents. Cargo-focused, no EU ban.',
    certifications: ['FAA AOC'],
  },
  environmental: 'Uses fuel-efficient freighter airplane, participates in carbon offset programs.',
  isoCountry: 'US',
  isoRegion: 'US-OH',
}

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

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedUseAirlineById.mockReturnValue({ data: null } as any)

  mockedUseFavoriteToggle.mockReturnValue({
    handleFavoritePress: jest.fn(),
    isFavorite: false,
    isPending: false,
  })
})

describe('AirlineDetail Screen', () => {
  it('should display loading screen while data is loading', () => {
    mockedUseLocalSearchParams.mockReturnValue({ airlineId: '1' })
    mockedUseAirlineById.mockReturnValue({ data: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<AirlineDetail />)
    expect(getByTestId('full-screen-loading')).toBeTruthy()
  })

  it('should display airline details when data is loaded', () => {
    mockedUseLocalSearchParams.mockReturnValue({ airlineId: '1' })
    mockedUseAirlineById.mockReturnValue({ data: mockedAirline } as any)
    const { getByTestId, queryByTestId } = renderWithSafeAreaProvider(<AirlineDetail />)
    expect(getByTestId('airline-header')).toBeTruthy()
    expect(queryByTestId('full-screen-loading')).toBeNull()
  })

  it('should navigate back when the back button is pressed', () => {
    mockedUseLocalSearchParams.mockReturnValue({ airline: JSON.stringify(mockedAirline) })
    const { getByTestId } = renderWithSafeAreaProvider(<AirlineDetail />)
    fireEvent.press(getByTestId('back-button'))
    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should call the favorite function when the favorite button is pressed', () => {
    const handleFavoritePress = jest.fn()
    mockedUseFavoriteToggle.mockReturnValue({
      handleFavoritePress,
      isFavorite: false,
      isPending: false,
    })
    mockedUseLocalSearchParams.mockReturnValue({ airline: JSON.stringify(mockedAirline) })
    const { getByTestId } = renderWithSafeAreaProvider(<AirlineDetail />)
    fireEvent.press(getByTestId('favorite-button'))
    expect(handleFavoritePress).toHaveBeenCalledTimes(1)
  })

  it('should call the share function when the share button is pressed', async () => {
    mockedUseLocalSearchParams.mockReturnValue({ airline: JSON.stringify(mockedAirline) })
    const { getByTestId } = renderWithSafeAreaProvider(<AirlineDetail />)
    fireEvent.press(getByTestId('share-button'))
    expect(shareAirline).toHaveBeenCalledWith(mockedAirline)
  })
})

describe('AirlineDetail Screen Snapshot', () => {
  it('should render the AirlineDetail Screen successfully', () => {
    mockedUseLocalSearchParams.mockReturnValue({ airline: JSON.stringify(mockedAirline) })

    const { toJSON } = render(<AirlineDetail />)

    expect(toJSON()).toMatchSnapshot()
  })
})
