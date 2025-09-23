import { Share } from 'react-native'

import { getLocale } from '@/locales/i18next'
import type { AirlineType } from '@/types/feature/airline'
import type { AirportType } from '@/types/feature/airport'
import {
  createAirlineLink,
  createAirportLink,
  shareAirline,
  shareAirport,
} from '@/utils/common/linkingService'
import { Logger } from '@/utils/common/logger'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

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

const mockedAirport: AirportType = {
  id: '1',
  icaoCode: 'AGGH',
  iataCode: 'HIR',
  isoCountry: 'SB',
  isoRegion: 'SB-GU',
  name: 'Honiara International Airport',
  image:
    'https://res.cloudinary.com/dzkssh0tp/image/upload/c_auto,w_800,q_auto,f_auto/v1758392988/HIR_mnss2t.jpg',
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

const BASE_URL = 'https://avox-redirect.vercel.app/'

beforeEach(() => {
  mockedGetLocale.mockImplementation((key: string, options: any) => {
    const translations: Record<string, string> = {
      shareAirline: `Check out ${options?.airlineName} (${options?.iataCode}) here: ${options?.link}`,
      shareAirlineTitle: `Information about ${options?.airlineName}`,
      shareAirport: `Find details for ${options?.airportName} (${options?.iataCode}) at this link: ${options?.link}`,
      shareAirportTitle: `Airport Details: ${options?.airportName}`,
    }
    return translations[key] || key
  })
})

describe('Share Utilities', () => {
  describe('createAirlineLink', () => {
    it('should create a correctly formatted URL for an airline', () => {
      const link = createAirlineLink(mockedAirline)
      const params = new URLSearchParams({
        id: mockedAirline.id,
        name: mockedAirline.name,
      }).toString()
      const expectedLink = `${BASE_URL}?type=airline-detail&${params}`
      expect(link).toBe(expectedLink)
    })
  })

  describe('createAirportLink', () => {
    it('should create a correctly formatted URL for an airport', () => {
      const link = createAirportLink(mockedAirport)
      const params = new URLSearchParams({
        id: mockedAirport.id,
        name: mockedAirport.name,
      }).toString()
      const expectedLink = `${BASE_URL}?type=airport-detail&${params}`
      expect(link).toBe(expectedLink)
    })
  })

  describe('shareAirline', () => {
    it('should call Share.share with the correct message and title', async () => {
      const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' })
      mockedGetLocale('shareAirline', {
        airlineName: mockedAirline.name,
        iataCode: mockedAirline.iataCode,
        link: createAirlineLink(mockedAirline),
      })

      await shareAirline(mockedAirline)

      const link = createAirlineLink(mockedAirline)
      const expectedMessage = `Check out ABX Air (GB) here: ${link}`
      const expectedTitle = 'Information about ABX Air'

      expect(shareSpy).toHaveBeenCalledWith({
        message: expectedMessage,
        title: expectedTitle,
      })
      expect(shareSpy).toHaveBeenCalledTimes(1)

      shareSpy.mockRestore()
    })

    it('should log an error if Share.share throws an exception', async () => {
      const shareError = new Error('User cancelled the share action')

      const shareSpy = jest.spyOn(Share, 'share').mockRejectedValue(shareError)

      await shareAirline(mockedAirline)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('shareAirlineError', 'error', shareError)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)

      shareSpy.mockRestore()
    })
  })

  describe('shareAirport', () => {
    it('should call Share.share with the correct message and title', async () => {
      const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' })
      mockedGetLocale('shareAirport', {
        airportName: mockedAirport.name,
        iataCode: mockedAirport.iataCode,
        link: createAirportLink(mockedAirport),
      })

      await shareAirport(mockedAirport)

      const link = createAirportLink(mockedAirport)
      const expectedMessage = `Find details for Honiara International Airport (HIR) at this link: ${link}`
      const expectedTitle = 'Airport Details: Honiara International Airport'

      expect(shareSpy).toHaveBeenCalledWith({
        message: expectedMessage,
        title: expectedTitle,
      })
      expect(shareSpy).toHaveBeenCalledTimes(1)

      shareSpy.mockRestore()
    })

    it('should log an error if Share.share throws an exception', async () => {
      const shareError = new Error('Sharing not available')
      const shareSpy = jest.spyOn(Share, 'share').mockRejectedValue(shareError)

      await shareAirport(mockedAirport)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('shareAirportError', 'error', shareError)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)

      shareSpy.mockRestore()
    })
  })
})
