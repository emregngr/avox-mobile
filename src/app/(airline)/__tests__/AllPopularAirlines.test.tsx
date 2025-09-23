import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AllPopularAirlines from '@/app/(airline)/all-popular-airlines'
import { useHome } from '@/hooks/services/useHome'
import type { AirlineType } from '@/types/feature/airline'

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

    AirlineCard: ({ airline }: { airline: AirlineType }) => (
      <View testID={`airline-card-${airline.id}`} />
    ),
  }
})

jest.mock('@/hooks/services/useHome', () => ({
  useHome: jest.fn(),
}))

const mockedUseHome = useHome as jest.MockedFunction<typeof useHome>

const mockedAirlineData: AirlineType[] = [
  {
    id: '1',
    name: 'Turkish Airlines',
    iataCode: 'TK',
    icaoCode: 'THY',
    logo: 'https://res.cloudinary.com/dzkssh0tp/image/upload/c_auto,w_800,q_auto,f_auto/v1758382974/TK_pog2zq.png',
    companyInfo: {
      foundingYear: '1933',
      parentCompany: 'Turkish Airlines Inc.',
      employeeCount: 64570,
      passengerCapacity: 80,
      website: 'www.turkishairlines.com',
      contactInfo: {
        phone: '+90-850-333-0849',
        email: 'customer@thy.com',
      },
      socialMedia: {
        x: 'https://x.com/turkishairlines',
        linkedin: 'https://www.linkedin.com/company/turkish-airlines',
        instagram: 'https://www.instagram.com/turkishairlines',
        tiktok: 'https://www.tiktok.com/@turkishairlines',
      },
    },
    operations: {
      businessModel: 'passenger',
      businessType: 'major_international',
      region: 'EU',
      country: 'Turkey',
      hub: {
        name: 'İstanbul Airport',
        city: 'İstanbul',
        address: 'İstanbul, Turkey',
        coordinates: {
          latitude: 41.2753,
          longitude: 28.7519,
        },
      },
      slogan: 'Widen your world',
      alliance: 'Star Alliance',
      skytraxRating: 4.9,
    },
    fleet: {
      totalAirplane: 400,
      averageAgeYears: 7.5,
      airplanes: [
        {
          type: 'Boeing 737-800',
          count: 100,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 5700,
          capacitySeats: 159,
        },
        {
          type: 'Airbus A321-200',
          count: 80,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 6100,
          capacitySeats: 180,
        },
        {
          type: 'Boeing 777-300ER',
          count: 50,
          bodyType: 'wide_body',
          speedKmh: 905,
          rangeKm: 14600,
          capacitySeats: 349,
        },
        {
          type: 'Airbus A330-300',
          count: 70,
          bodyType: 'wide_body',
          speedKmh: 905,
          rangeKm: 11700,
          capacitySeats: 289,
        },
        {
          type: 'Boeing 787-9',
          count: 50,
          bodyType: 'wide_body',
          speedKmh: 913,
          rangeKm: 14140,
          capacitySeats: 300,
        },
        {
          type: 'Airbus A350-900',
          count: 50,
          bodyType: 'wide_body',
          speedKmh: 913,
          rangeKm: 15000,
          capacitySeats: 329,
        },
      ],
      airplaneTypeCount: 6,
    },
    network: {
      destinations: ['İstanbul', 'New York', 'London', 'Tokyo'],
      routes: [
        {
          origin: 'JFK',
          destinationIata: 'LAX',
        },
        {
          origin: 'JFK',
          destinationIata: 'MIA',
        },
      ],
      destinationCount: 350,
      destinationCountries: 80,
      domesticConnections: 50,
      internationalConnections: 300,
    },
    safety: {
      safetyRecord: 'One fatal accident (2009). Passenger-focused, no EU ban.',
      certifications: ['DGCA Turkey AOC', 'IATA IOSA'],
    },
    environmental: 'Operates fuel-efficient airplane, participates in carbon offset programs.',
    isoCountry: 'TR',
    isoRegion: 'TR-34',
  },
  {
    id: '2',
    name: 'Pegasus Airlines',
    iataCode: 'PC',
    icaoCode: 'PGT',
    logo: 'https://res.cloudinary.com/dzkssh0tp/image/upload/c_auto,w_800,q_auto,f_auto/v1758382933/PC_i3bpgq.png',
    companyInfo: {
      foundingYear: '1990',
      parentCompany: 'ESAS Holding',
      employeeCount: 200,
      passengerCapacity: 30,
      website: 'www.flypgs.com',
      contactInfo: {
        phone: '+90-850-250-6777',
        email: 'info@flypgs.com',
      },
      socialMedia: {
        x: 'https://x.com/flypgs',
        linkedin: 'https://www.linkedin.com/company/pegasus-airlines',
        instagram: 'https://www.instagram.com/pegasusairlines',
        tiktok: 'https://www.tiktok.com/@pegasusairlines',
      },
    },
    operations: {
      businessModel: 'passenger',
      businessType: 'low_cost',
      region: 'EU',
      country: 'Turkey',
      hub: {
        name: 'Sabiha Gökçen International Airport',
        city: 'İstanbul',
        address: 'İstanbul, Turkey',
        coordinates: {
          latitude: 40.8986,
          longitude: 29.3092,
        },
      },
      slogan: 'We Make You Fly',
      alliance: 'none',
      skytraxRating: 4.5,
    },
    fleet: {
      totalAirplane: 100,
      averageAgeYears: 7,
      airplanes: [
        {
          type: 'Airbus A320-200',
          count: 40,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 6100,
          capacitySeats: 180,
        },
        {
          type: 'Airbus A320neo',
          count: 30,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 6500,
          capacitySeats: 186,
        },
        {
          type: 'Boeing 737-800',
          count: 20,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 5700,
          capacitySeats: 189,
        },
        {
          type: 'Airbus A321neo',
          count: 10,
          bodyType: 'narrow_body',
          speedKmh: 871,
          rangeKm: 7400,
          capacitySeats: 239,
        },
      ],
      airplaneTypeCount: 4,
    },
    network: {
      destinations: ['İstanbul', 'Antalya', 'London', 'Moscow'],
      routes: [
        {
          origin: 'JFK',
          destinationIata: 'LAX',
        },
        {
          origin: 'JFK',
          destinationIata: 'MIA',
        },
      ],
      destinationCount: 120,
      destinationCountries: 40,
      domesticConnections: 20,
      internationalConnections: 100,
    },
    safety: {
      safetyRecord: 'No fatal accidents. Low-cost passenger-focused, no EU ban.',
      certifications: ['DGCA Turkey AOC', 'IATA IOSA'],
    },
    environmental: 'Operates fuel-efficient airplane, participates in carbon offset programs.',
    isoCountry: 'TR',
    isoRegion: 'TR-34',
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

describe('AllPopularAirlines Screen', () => {
  it('should display skeleton loader while loading', () => {
    mockedUseHome.mockReturnValue({ isLoading: true, homeData: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<AllPopularAirlines />)
    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('should display the list of airlines when data is loaded', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: {
        popularAirlines: mockedAirlineData,
      },
    } as any)
    const { getByTestId, queryByTestId } = renderWithSafeAreaProvider(<AllPopularAirlines />)
    expect(getByTestId('airline-card-1')).toBeTruthy()
    expect(getByTestId('airline-card-2')).toBeTruthy()
    expect(queryByTestId('skeleton')).toBeNull()
  })

  it('should navigate back when the back button is pressed', () => {
    mockedUseHome.mockReturnValue({ isLoading: false, homeData: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<AllPopularAirlines />)
    fireEvent.press(getByTestId('back-button'))
    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should render an empty list without crashing if no airline data is available', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: {
        popularAirlines: [],
      },
    } as any)
    const { queryByTestId } = renderWithSafeAreaProvider(<AllPopularAirlines />)
    expect(queryByTestId('airline-card-1')).toBeNull()
    expect(queryByTestId('skeleton')).toBeNull()
  })
})

describe('AllPopularAirlines Screen Snapshot', () => {
  it('should render the AllPopularAirlines Screen successfully', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: {
        popularAirlines: mockedAirlineData,
      },
    } as any)

    const { toJSON } = renderWithSafeAreaProvider(<AllPopularAirlines />)

    expect(toJSON()).toMatchSnapshot()
  })
})
