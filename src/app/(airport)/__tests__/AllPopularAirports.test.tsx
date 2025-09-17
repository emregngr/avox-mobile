import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AllPopularAirports from '@/app/(airport)/all-popular-airports'
import { useHome } from '@/hooks/services/useHome'
import type { AirportType } from '@/types/feature/airport'

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    Header: ({ title, backIconOnPress }: { title: string; backIconOnPress: () => void }) => (
      <>
        <Text testID="header-title">{title}</Text>
        <TouchableOpacity onPress={backIconOnPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
      </>
    ),

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),
  }
})

jest.mock('@/components/feature', () => {
  const { View } = require('react-native')

  return {
    PopularCardSkeleton: (props: any) => <View {...props} testID="skeleton" />,

    AirportCard: ({ airport }: { airport: AirportType }) => (
      <View testID={`airport-card-${airport.id}`} />
    ),
  }
})

jest.mock('@/hooks/services/useHome', () => ({
  useHome: jest.fn(),
}))

const mockedUseHome = useHome as jest.MockedFunction<typeof useHome>

const mockedAirports: AirportType[] = [
  {
    id: '1',
    icaoCode: 'LTFM',
    iataCode: 'IST',
    isoCountry: 'TR',
    isoRegion: 'TR-34',
    name: 'İstanbul Airport',
    image: 'https://res.cloudinary.com/dzkssh0tp/image/upload/v1758030477/IST_vy5oim.jpg',
    airportInfo: {
      foundingYear: '2018',
      employeeCount: 5000,
      website: 'www.istairport.com',
      contactInfo: {
        phone: '+90-212-891-1122',
        email: 'info@İstanbulairport.aero',
      },
      socialMedia: {
        x: 'https://x.com/İstanbul_airport',
        linkedin: 'https://www.linkedin.com/company/İstanbul-airport',
        instagram: 'https://www.instagram.com/İstanbul_airport',
        tiktok: 'https://www.tiktok.com/@İstanbul_airport',
      },
    },
    operations: {
      airportType: 'mega_airport',
      region: 'EU',
      country: 'Turkey',
      location: {
        city: 'Arnavutköy, İstanbul',
        address: 'Arnavutköy, İstanbul, Turkey',
        coordinates: {
          latitude: 41.261297,
          longitude: 28.741951,
        },
        elevationFt: 325,
      },
      scheduledService: true,
      is24Hour: true,
    },
    infrastructure: {
      passengerCapacity: 90,
      baggageCapacity: 10800,
      terminalAreaHectares: 140,
      airportAreaHectares: 7650,
      runways: {
        lengthM: 4100,
        surface: 'Asphalt',
        pcn: '80/F/A/X/T',
        ilsCategory: 'CAT III',
      },
      apronCount: 371,
      towerHeightM: 50,
      fireCategory: 'Cat 10',
      terminalCount: 1,
      runwayCount: 5,
    },
    facilities: {
      services: ['duty-free shops', 'restaurants', 'lounge', 'car rental'],
      loungeCount: 6,
      securityQueueTime: 25,
      checkinTimeAvg: 25,
      freeWifi: true,
      googleMapsRating: 4.4,
      parkingCapacityVehicles: 25000,
      hasMetro: true,
    },
    flightOperations: {
      destinationCount: 220,
      destinationCountries: 80,
      routes: [
        {
          destinationIata: 'JFK',
          frequency: '2x daily',
        },
        {
          destinationIata: 'LHR',
          frequency: '4x daily',
        },
        {
          destinationIata: 'DXB',
          frequency: '3x daily',
        },
      ],
      airlines: ['Turkish Airlines', 'Emirates', 'British Airways'],
      domesticConnections: 20,
      internationalConnections: 200,
    },
    cargo: {
      annualCargoTonnes: 1500000,
      terminalCapacityTonnes: 1000,
      coldStorage: true,
      dangerousGoods: true,
    },
    nearbyAttractions: [
      {
        attractionId: '1',
        attractionName: 'Hagia Sophia',
        attractionCoordinates: {
          attractionLatitude: 41.0086,
          attractionLongitude: 28.98,
        },
        description: 'A historic mosque and former cathedral with Byzantine mosaics.',
        distanceKm: 35,
      },
      {
        attractionId: '2',
        attractionName: 'Topkapı Palace',
        attractionCoordinates: {
          attractionLatitude: 41.0114,
          attractionLongitude: 28.9833,
        },
        description: 'A grand Ottoman palace with museums and courtyards.',
        distanceKm: 35,
      },
      {
        attractionId: '3',
        attractionName: 'Blue Mosque',
        attractionCoordinates: {
          attractionLatitude: 41.0053,
          attractionLongitude: 28.9758,
        },
        description: 'An iconic mosque with blue tiles and six minarets.',
        distanceKm: 35,
      },
      {
        attractionId: '4',
        attractionName: 'Grand Bazaar',
        attractionCoordinates: {
          attractionLatitude: 41.0108,
          attractionLongitude: 28.9681,
        },
        description: 'One of the world’s oldest and largest covered markets.',
        distanceKm: 35,
      },
      {
        attractionId: '5',
        attractionName: 'Süleymaniye Mosque',
        attractionCoordinates: {
          attractionLatitude: 41.0161,
          attractionLongitude: 28.9642,
        },
        description: 'A majestic Ottoman mosque with stunning views.',
        distanceKm: 35,
      },
      {
        attractionId: '6',
        attractionName: 'Basilica Cistern',
        attractionCoordinates: {
          attractionLatitude: 41.0083,
          attractionLongitude: 28.9778,
        },
        description: 'An underground Byzantine water reservoir with columns.',
        distanceKm: 35,
      },
      {
        attractionId: '7',
        attractionName: 'Dolmabahçe Palace',
        attractionCoordinates: {
          attractionLatitude: 41.0392,
          attractionLongitude: 29.0003,
        },
        description: 'A lavish 19th-century palace on the Bosphorus.',
        distanceKm: 40,
      },
      {
        attractionId: '8',
        attractionName: 'Galata Tower',
        attractionCoordinates: {
          attractionLatitude: 41.0256,
          attractionLongitude: 28.9741,
        },
        description: 'A medieval tower with panoramic city views.',
        distanceKm: 35,
      },
      {
        attractionId: '9',
        attractionName: 'Spice Bazaar',
        attractionCoordinates: {
          attractionLatitude: 41.0167,
          attractionLongitude: 28.9708,
        },
        description: 'A vibrant market with spices, sweets, and souvenirs.',
        distanceKm: 35,
      },
      {
        attractionId: '10',
        attractionName: 'Bosphorus Cruise',
        attractionCoordinates: {
          attractionLatitude: 41.0369,
          attractionLongitude: 29.0139,
        },
        description: 'A scenic boat tour along the Bosphorus Strait.',
        distanceKm: 40,
      },
    ],
    safety: {
      certifications: ['ICAO Annex 17'],
    },
  },
  {
    id: '2',
    icaoCode: 'LTFJ',
    iataCode: 'SAW',
    isoCountry: 'TR',
    isoRegion: 'TR-34',
    name: 'İstanbul Sabiha Gökçen International Airport',
    image: '',
    airportInfo: {
      foundingYear: '2001',
      employeeCount: 2500,
      website: 'www.sabihagokcen.aero',
      contactInfo: {
        phone: '+90-216-588-8888',
        email: 'info@sabihagokcen.aero',
      },
      socialMedia: {
        x: 'https://x.com/sabiha_airport',
        linkedin: 'https://www.linkedin.com/company/sabiha-gokcen-airport',
        instagram: 'https://www.instagram.com/sabiha_airport',
        tiktok: '',
      },
    },
    operations: {
      airportType: 'large_airport',
      region: 'AS',
      country: 'Turkey',
      location: {
        city: 'Pendik, İstanbul',
        address: 'Pendik, İstanbul, Turkey',
        coordinates: {
          latitude: 40.898602,
          longitude: 29.3092,
        },
        elevationFt: 312,
      },
      scheduledService: true,
      is24Hour: true,
    },
    infrastructure: {
      passengerCapacity: 41,
      baggageCapacity: 1000,
      terminalAreaHectares: 20,
      airportAreaHectares: 2550,
      runways: {
        lengthM: 3000,
        surface: 'Asphalt',
        pcn: '70/F/A/X/T',
        ilsCategory: 'CAT II',
      },
      apronCount: 20,
      towerHeightM: 40,
      fireCategory: 'Cat 8',
      terminalCount: 2,
      runwayCount: 2,
    },
    facilities: {
      services: ['duty-free shops', 'restaurants', 'lounge', 'car rental'],
      loungeCount: 3,
      securityQueueTime: 18,
      checkinTimeAvg: 20,
      freeWifi: true,
      googleMapsRating: 4.3,
      parkingCapacityVehicles: 10000,
      hasMetro: true,
    },
    flightOperations: {
      destinationCount: 80,
      destinationCountries: 40,
      routes: [
        {
          destinationIata: 'ESB',
          frequency: '4x daily',
        },
        {
          destinationIata: 'LHR',
          frequency: 'daily',
        },
        {
          destinationIata: 'DXB',
          frequency: 'daily',
        },
      ],
      airlines: ['Pegasus Airlines', 'Turkish Airlines', 'Flydubai'],
      domesticConnections: 20,
      internationalConnections: 60,
    },
    cargo: {
      annualCargoTonnes: 200000,
      terminalCapacityTonnes: 500,
      coldStorage: true,
      dangerousGoods: true,
    },
    nearbyAttractions: [
      {
        attractionId: '1',
        attractionName: 'Hagia Sophia',
        attractionCoordinates: {
          attractionLatitude: 41.0086,
          attractionLongitude: 28.98,
        },
        description: 'A historic mosque and former cathedral with Byzantine mosaics.',
        distanceKm: 45,
      },
      {
        attractionId: '2',
        attractionName: 'Topkapı Palace',
        attractionCoordinates: {
          attractionLatitude: 41.0114,
          attractionLongitude: 28.9833,
        },
        description: 'A grand Ottoman palace with museums and courtyards.',
        distanceKm: 45,
      },
      {
        attractionId: '3',
        attractionName: 'Blue Mosque',
        attractionCoordinates: {
          attractionLatitude: 41.0053,
          attractionLongitude: 28.9758,
        },
        description: 'An iconic mosque with blue tiles and six minarets.',
        distanceKm: 45,
      },
      {
        attractionId: '4',
        attractionName: 'Grand Bazaar',
        attractionCoordinates: {
          attractionLatitude: 41.0108,
          attractionLongitude: 28.9681,
        },
        description: 'One of the world’s oldest and largest covered markets.',
        distanceKm: 45,
      },
      {
        attractionId: '5',
        attractionName: 'Süleymaniye Mosque',
        attractionCoordinates: {
          attractionLatitude: 41.0161,
          attractionLongitude: 28.9642,
        },
        description: 'A majestic Ottoman mosque with stunning views.',
        distanceKm: 45,
      },
      {
        attractionId: '6',
        attractionName: 'Basilica Cistern',
        attractionCoordinates: {
          attractionLatitude: 41.0083,
          attractionLongitude: 28.9778,
        },
        description: 'An underground Byzantine water reservoir with columns.',
        distanceKm: 45,
      },
      {
        attractionId: '7',
        attractionName: 'Dolmabahçe Palace',
        attractionCoordinates: {
          attractionLatitude: 41.0392,
          attractionLongitude: 29.0003,
        },
        description: 'A lavish 19th-century palace on the Bosphorus.',
        distanceKm: 50,
      },
      {
        attractionId: '8',
        attractionName: 'Galata Tower',
        attractionCoordinates: {
          attractionLatitude: 41.0256,
          attractionLongitude: 28.9741,
        },
        description: 'A medieval tower with panoramic city views.',
        distanceKm: 45,
      },
      {
        attractionId: '9',
        attractionName: 'Spice Bazaar',
        attractionCoordinates: {
          attractionLatitude: 41.0167,
          attractionLongitude: 28.9708,
        },
        description: 'A vibrant market with spices, sweets, and souvenirs.',
        distanceKm: 45,
      },
      {
        attractionId: '10',
        attractionName: 'Bosphorus Cruise',
        attractionCoordinates: {
          attractionLatitude: 41.0369,
          attractionLongitude: 29.0139,
        },
        description: 'A scenic boat tour along the Bosphorus Strait.',
        distanceKm: 50,
      },
    ],
    safety: {
      certifications: ['ICAO Annex 17'],
    },
  },
]

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

describe('AllPopularAirports Screen', () => {
  it('should display skeleton loader while loading', () => {
    mockedUseHome.mockReturnValue({ isLoading: true, homeData: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<AllPopularAirports />)
    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('should display the list of airports when data is loaded', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { popularAirports: mockedAirports },
    } as any)
    const { getByTestId, queryByTestId } = renderWithSafeAreaProvider(<AllPopularAirports />)
    expect(getByTestId('airport-card-1')).toBeTruthy()
    expect(getByTestId('airport-card-2')).toBeTruthy()
    expect(queryByTestId('skeleton')).toBeNull()
  })

  it('should navigate back when the back button is pressed', () => {
    mockedUseHome.mockReturnValue({ isLoading: false, homeData: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<AllPopularAirports />)
    fireEvent.press(getByTestId('back-button'))
    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should render an empty list without crashing if no airport data is available', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { popularAirports: [] },
    } as any)
    const { queryByTestId } = renderWithSafeAreaProvider(<AllPopularAirports />)
    expect(queryByTestId('airport-card-1')).toBeNull()
    expect(queryByTestId('skeleton')).toBeNull()
  })
})

describe('AllPopularAirports Screen Snapshot', () => {
  it('should render the AllPopularAirports Screen successfully', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { popularAirports: mockedAirports },
    } as any)

    const { toJSON } = renderWithSafeAreaProvider(<AllPopularAirports />)

    expect(toJSON()).toMatchSnapshot()
  })
})
