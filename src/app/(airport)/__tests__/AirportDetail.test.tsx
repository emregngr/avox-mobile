import { fireEvent, render } from '@testing-library/react-native'
import { router, useLocalSearchParams } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AirportDetail from '@/app/(airport)/airport-detail'
import { useAirportById } from '@/hooks/services/useAirport'
import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import type { AirportType } from '@/types/feature/airport'
import { shareAirport } from '@/utils/common/linkingService'

jest.mock('@/hooks/services/useAirport')

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
    AirportHeader: (props: any) => <View {...props} testID="airport-header" />,
    GeneralTab: () => null,
    InfrastructureTab: () => null,
    AirportFlightTab: () => null,
    NearbyPlacesTab: () => null,
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

const mockedUseAirportById = useAirportById as jest.MockedFunction<typeof useAirportById>
const mockedUseFavoriteToggle = useFavoriteToggle as jest.MockedFunction<typeof useFavoriteToggle>

const mockedAirport: AirportType = {
  id: '1',
  icaoCode: 'AGGH',
  iataCode: 'HIR',
  isoCountry: 'SB',
  isoRegion: 'SB-GU',
  name: 'Honiara International Airport',
  image: '',
  airportInfo: {
    foundingYear: '1942',
    employeeCount: 250,
    website: 'www.honiara-international-airport.com',
    contactInfo: {
      phone: '+677-123-4567',
      email: 'info@honiara-international-airport.com',
    },
    socialMedia: {
      x: 'https://x.com/honiaraairport',
      linkedin: 'https://www.linkedin.com/company/honiara-international-airport',
      instagram: '',
      tiktok: '',
    },
  },
  operations: {
    airportType: 'small_airport',
    region: 'OC',
    country: 'Solomon Islands',
    location: {
      city: 'Honiara',
      address: 'Honiara, Solomon Islands',
      coordinates: {
        latitude: -9.428,
        longitude: 160.054993,
      },
      elevationFt: 28,
    },
    scheduledService: true,
    is24Hour: true,
  },
  infrastructure: {
    passengerCapacity: 0.5,
    baggageCapacity: 80,
    terminalAreaHectares: 0.5,
    airportAreaHectares: 280,
    runways: {
      lengthM: 2200,
      surface: 'Asphalt',
      pcn: '25/F/B/X/T',
      ilsCategory: 'CAT I',
    },
    apronCount: 3,
    towerHeightM: 20,
    fireCategory: 'Cat 5',
    terminalCount: 1,
    runwayCount: 1,
  },
  facilities: {
    services: [
      'check-in counters',
      'small duty-free shop',
      'basic dining options',
      'lost and found',
    ],
    loungeCount: 1,
    securityQueueTime: 5,
    checkinTimeAvg: 20,
    freeWifi: false,
    googleMapsRating: 3.8,
    parkingCapacityVehicles: 200,
    hasMetro: false,
  },
  flightOperations: {
    destinationCount: 4,
    destinationCountries: 4,
    routes: [
      {
        destinationIata: 'HND',
        frequency: '2x daily',
      },
      {
        destinationIata: 'CTS',
        frequency: 'daily',
      },
      {
        destinationIata: 'ITM',
        frequency: '3x weekly',
      },
    ],
    airlines: ['All Nippon Airways', 'Japan Airlines', 'Jetstar Japan'],
    domesticConnections: 1,
    internationalConnections: 3,
  },
  cargo: {
    annualCargoTonnes: 25000,
    terminalCapacityTonnes: 300,
    coldStorage: true,
    dangerousGoods: true,
  },
  nearbyAttractions: [
    {
      attractionId: '1',
      attractionName: 'Honiara Central Market',
      attractionCoordinates: {
        attractionLatitude: -9.4353,
        attractionLongitude: 159.9556,
      },
      description:
        "A vibrant market offering fresh produce, crafts, and local delicacies, perfect for experiencing Solomon Islands' culture.",
      distanceKm: 10,
    },
    {
      attractionId: '2',
      attractionName: 'Bonegi Beach',
      attractionCoordinates: {
        attractionLatitude: -9.3889,
        attractionLongitude: 159.8667,
      },
      description:
        'Famous for WWII shipwrecks, this beach is a hotspot for diving and history enthusiasts.',
      distanceKm: 20,
    },
    {
      attractionId: '3',
      attractionName: 'National Museum of Solomon Islands',
      attractionCoordinates: {
        attractionLatitude: -9.4333,
        attractionLongitude: 159.9578,
      },
      description:
        'Showcases the history and culture of the Solomon Islands with artifacts and traditional art displays.',
      distanceKm: 10,
    },
    {
      attractionId: '4',
      attractionName: 'Point Cruz',
      attractionCoordinates: {
        attractionLatitude: -9.4333,
        attractionLongitude: 159.9544,
      },
      description:
        'A central hub in Honiara with a yacht harbor and nearby cafes, ideal for a relaxing stroll.',
      distanceKm: 11,
    },
    {
      attractionId: '5',
      attractionName: 'Tenaru Falls',
      attractionCoordinates: {
        attractionLatitude: -9.4167,
        attractionLongitude: 160.0667,
      },
      description:
        'A serene waterfall offering hiking and swimming opportunities in a peaceful natural setting.',
      distanceKm: 2,
    },
    {
      attractionId: '6',
      attractionName: 'Botanical Gardens',
      attractionCoordinates: {
        attractionLatitude: -9.4333,
        attractionLongitude: 159.9589,
      },
      description:
        'A tranquil oasis with tropical plants and walking paths, perfect for nature lovers.',
      distanceKm: 10,
    },
    {
      attractionId: '7',
      attractionName: 'Mataniko Falls',
      attractionCoordinates: {
        attractionLatitude: -9.4167,
        attractionLongitude: 159.9667,
      },
      description:
        'A stunning waterfall ideal for hiking and photography, surrounded by lush greenery.',
      distanceKm: 9,
    },
    {
      attractionId: '8',
      attractionName: 'Honiara War Memorial',
      attractionCoordinates: {
        attractionLatitude: -9.4344,
        attractionLongitude: 159.9578,
      },
      description:
        "A tribute to WWII history, offering a reflective space with views of Honiara's coastline.",
      distanceKm: 10,
    },
    {
      attractionId: '9',
      attractionName: 'Holy Cross Cathedral',
      attractionCoordinates: {
        attractionLatitude: -9.435,
        attractionLongitude: 159.957,
      },
      description:
        'A prominent landmark in Honiara, known for its striking architecture and spiritual significance.',
      distanceKm: 10,
    },
    {
      attractionId: '10',
      attractionName: 'Tulagi Island',
      attractionCoordinates: {
        attractionLatitude: -9.1,
        attractionLongitude: 160.15,
      },
      description:
        'A historic island with WWII relics and diving spots, accessible by boat from Honiara.',
      distanceKm: 37,
    },
  ],
  safety: {
    certifications: ['ICAO Annex 17'],
  },
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

  mockedUseAirportById.mockReturnValue({ data: null } as any)

  mockedUseFavoriteToggle.mockReturnValue({
    handleFavoritePress: jest.fn(),
    isFavorite: false,
    isPending: false,
  })
})

describe('AirportDetail Screen', () => {
  it('should display loading screen while data is loading', () => {
    mockedUseLocalSearchParams.mockReturnValue({ airportId: '1' })
    mockedUseAirportById.mockReturnValue({ data: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<AirportDetail />)
    expect(getByTestId('full-screen-loading')).toBeTruthy()
  })

  it('should display airport details when data is loaded', () => {
    mockedUseLocalSearchParams.mockReturnValue({ airportId: '1' })
    mockedUseAirportById.mockReturnValue({ data: mockedAirport } as any)
    const { getByTestId, queryByTestId } = renderWithSafeAreaProvider(<AirportDetail />)
    expect(getByTestId('airport-header')).toBeTruthy()
    expect(queryByTestId('full-screen-loading')).toBeNull()
  })

  it('should navigate back when the back button is pressed', () => {
    mockedUseLocalSearchParams.mockReturnValue({ airport: JSON.stringify(mockedAirport) })
    const { getByTestId } = renderWithSafeAreaProvider(<AirportDetail />)
    const backButton = getByTestId('back-button')
    fireEvent.press(backButton)
    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should call the favorite function when the favorite button is pressed', () => {
    const handleFavoritePress = jest.fn()
    mockedUseFavoriteToggle.mockReturnValue({
      handleFavoritePress,
      isFavorite: false,
      isPending: false,
    })
    mockedUseLocalSearchParams.mockReturnValue({ airport: JSON.stringify(mockedAirport) })
    const { getByTestId } = renderWithSafeAreaProvider(<AirportDetail />)
    fireEvent.press(getByTestId('favorite-button'))
    expect(handleFavoritePress).toHaveBeenCalledTimes(1)
  })

  it('should call the share function when the share button is pressed', async () => {
    mockedUseLocalSearchParams.mockReturnValue({ airport: JSON.stringify(mockedAirport) })
    const { getByTestId } = renderWithSafeAreaProvider(<AirportDetail />)
    fireEvent.press(getByTestId('share-button'))
    expect(shareAirport).toHaveBeenCalledWith(mockedAirport)
  })
})

describe('AirportDetail Screen Snapshot', () => {
  it('should render the AirportDetail Screen successfully', () => {
    mockedUseLocalSearchParams.mockReturnValue({ airport: JSON.stringify(mockedAirport) })

    const { toJSON } = render(<AirportDetail />)

    expect(toJSON()).toMatchSnapshot()
  })
})
