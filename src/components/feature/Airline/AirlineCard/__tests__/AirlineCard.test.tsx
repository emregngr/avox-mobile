import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { router } from 'expo-router'
import React from 'react'

import { AirlineCard, AirlinesLoadMoreFooter } from '@/components/feature/Airline/AirlineCard'
import { useInterstitialAdHandler } from '@/hooks/advertisement/useInterstitialAdHandler'
import useLocaleStore from '@/store/locale'
import type { AirlineType } from '@/types/feature/airline'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/utils/common/analyticsService', () => ({
  AnalyticsService: {
    sendEvent: jest.fn().mockResolvedValue(undefined),
  },
}))

const mockedShowInterstitialAd = jest.fn()

jest.mock('@/hooks/advertisement/useInterstitialAdHandler')

const mockedUseInterstitialAdHandler = useInterstitialAdHandler as jest.MockedFunction<
  typeof useInterstitialAdHandler
>

jest.mock('@/components/feature/FavoriteButton', () => ({
  FavoriteButton: ({ id }: { id: string }) => <>{`FavoriteButton-${id}`}</>,
}))

jest.mock('@/components/common/FullScreenLoading', () => {
  const { View } = require('react-native')

  return {
    FullScreenLoading: (props: any) => <View {...props} testID="full-screen-loading" />,
  }
})

const mockedAirline: AirlineType = {
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
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedUseInterstitialAdHandler.mockReturnValue({ showInterstitialAd: mockedShowInterstitialAd })
})

describe('AirlineCard Component', () => {
  it('renders airline card with name and codes', () => {
    const { getByText } = render(<AirlineCard airline={mockedAirline} />)

    expect(getByText('Turkish Airlines')).toBeTruthy()
    expect(getByText('TK')).toBeTruthy()
    expect(getByText('THY')).toBeTruthy()
  })

  it('navigates on press and logs analytics', async () => {
    const { getByText } = render(<AirlineCard airline={mockedAirline} />)
    const card = getByText('Turkish Airlines')

    fireEvent.press(card)

    await waitFor(() => {
      expect(router.navigate).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/airline-detail',
          params: expect.any(Object),
        }),
      )
    })
  })

  it('renders popular destinations', () => {
    const { getByText } = render(<AirlineCard airline={mockedAirline} />)
    expect(getByText(/İstanbul, New York, London, Tokyo/)).toBeTruthy()
  })
})

describe('AirlinesLoadMoreFooter Component', () => {
  it('renders loading state when loading initially', () => {
    const { getByTestId } = render(
      <AirlinesLoadMoreFooter flatAirlinesData={[]} airlinesHasNext airlinesLoading />,
    )
    expect(getByTestId('full-screen-loading')).toBeTruthy()
  })

  it('renders no airline state', () => {
    const { getByText } = render(
      <AirlinesLoadMoreFooter
        airlinesHasNext={false}
        airlinesLoading={false}
        flatAirlinesData={[]}
      />,
    )
    expect(getByText('noAirline')).toBeTruthy()
  })

  it('renders all airlines shown state', () => {
    const { getByText } = render(
      <AirlinesLoadMoreFooter
        airlinesHasNext={false}
        airlinesLoading={false}
        flatAirlinesData={[{ id: '1' } as any]}
      />,
    )
    expect(getByText(/allAirlinesShown/)).toBeTruthy()
  })

  it('renders nothing if still loading with data', () => {
    const { toJSON } = render(
      <AirlinesLoadMoreFooter
        flatAirlinesData={[{ id: '1' } as any]}
        airlinesHasNext
        airlinesLoading
      />,
    )
    expect(toJSON()).toBeNull()
  })
})

describe('AirlineCard Component Snapshot', () => {
  it('should render the AirlineCard successfully', () => {
    const { toJSON } = render(<AirlineCard airline={mockedAirline} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

describe('AirlinesLoadMoreFooter Component Snapshot', () => {
  it('should render the AirlinesLoadMoreFooter Component successfully', () => {
    const { toJSON } = render(
      <AirlinesLoadMoreFooter
        flatAirlinesData={[{ id: '1' } as any]}
        airlinesHasNext
        airlinesLoading
      />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
