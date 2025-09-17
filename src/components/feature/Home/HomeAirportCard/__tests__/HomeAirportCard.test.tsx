import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import React from 'react'

import { HomeAirportCard } from '@/components/feature/Home/HomeAirportCard'
import { useInterstitialAdHandler } from '@/hooks/advertisement/useInterstitialAdHandler'
import useLocaleStore from '@/store/locale'
import type { AirportType } from '@/types/feature/airport'
import { AnalyticsService } from '@/utils/common/analyticsService'

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/components/feature/FavoriteButton')

jest.mock('@/utils/feature/getAirportImage')

jest.mock('@/utils/feature/getBadge')

jest.mock('@/utils/common/analyticsService')

const mockedShowInterstitialAd = jest.fn()

jest.mock('@/hooks/advertisement/useInterstitialAdHandler')

const mockedUseInterstitialAdHandler = useInterstitialAdHandler as jest.MockedFunction<
  typeof useInterstitialAdHandler
>

const mockedAirport: AirportType = {
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
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedUseInterstitialAdHandler.mockReturnValue({ showInterstitialAd: mockedShowInterstitialAd })
})

describe('HomeAirportCard Component', () => {
  it('renders airport info correctly', () => {
    const { getByText } = render(<HomeAirportCard airport={mockedAirport} />)

    expect(getByText('IST')).toBeTruthy()
    expect(getByText('LTFM')).toBeTruthy()
    expect(getByText('İstanbul Airport')).toBeTruthy()
    expect(getByText('Arnavutköy, İstanbul, Turkey, EU')).toBeTruthy()
  })

  it('calls analytics, router and showInterstitialAd on press', () => {
    const { getByText } = render(<HomeAirportCard airport={mockedAirport} />)
    const card = getByText('IST').parent?.parent?.parent?.parent as any

    fireEvent.press(card)

    expect(AnalyticsService.sendEvent).toHaveBeenCalledWith('airport_card_press', {
      airline_id: '1',
      airline_name: 'İstanbul Airport',
      iata_code: 'IST',
      user_locale: 'en',
    })

    expect(router.navigate).toHaveBeenCalledWith({
      pathname: '/airport-detail',
      params: { airport: JSON.stringify(mockedAirport) },
    })

    expect(mockedShowInterstitialAd).toHaveBeenCalled()
  })

  it('renders images with correct props', () => {
    const { getAllByTestId } = render(<HomeAirportCard airport={mockedAirport} />)
    const images = getAllByTestId('mocked-image')

    expect(images).toHaveLength(2)
  })

  it('calls useInterstitialAdHandler with correct adUnitId', () => {
    render(<HomeAirportCard airport={mockedAirport} />)

    expect(mockedUseInterstitialAdHandler).toHaveBeenCalledWith({
      adUnitId: expect.any(String),
    })
  })

  it('handles missing airport data gracefully', () => {
    const incompleteAirport = {
      id: '2',
      name: 'Test Airport',
      iataCode: 'TST',
      icaoCode: 'TEST',
      operations: {
        airportType: 'regional',
        country: 'Test Country',
        region: 'Test Region',
        location: {
          city: 'Test City',
        },
      },
    }

    const { getByText } = render(<HomeAirportCard airport={incompleteAirport as any} />)

    expect(getByText('TST')).toBeTruthy()
    expect(getByText('TEST')).toBeTruthy()
    expect(getByText('Test Airport')).toBeTruthy()
    expect(getByText('Test City, Test Country, Test Region')).toBeTruthy()
  })
})

describe('HomeAirportCard Component Snapshot', () => {
  it('should render the HomeAirportCard Component successfully', () => {
    const { toJSON } = render(<HomeAirportCard airport={mockedAirport} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
