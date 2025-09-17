import { render } from '@testing-library/react-native'
import React from 'react'

import { Company } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Company'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import { formatNumber } from '@/utils/feature/formatNumber'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/utils/feature/formatNumber')

const mockedFormatNumber = formatNumber as jest.MockedFunction<typeof formatNumber>

const mockedAirlineSectionRow = jest.fn()
const mockedAirlineRowItem = jest.fn()

jest.mock('@/components/feature/Airline/AirlineDetail/AirlineSectionRow', () => {
  const { View } = require('react-native')
  return {
    AirlineSectionRow: (props: any) => {
      mockedAirlineSectionRow(props)
      return (
        <View testID="mocked-section-row" {...props}>
          {props.children}
        </View>
      )
    },
  }
})

jest.mock('@/components/feature/Airline/AirlineDetail/AirlineRowItem', () => {
  const { Text } = require('react-native')
  return {
    AirlineRowItem: (props: any) => {
      mockedAirlineRowItem(props)
      return (
        <Text testID={`row-item-${props.icon}`}>
          {props.label}: {props.value}
        </Text>
      )
    },
  }
})

const mockedAirlineData: any = {
  id: '1',
  name: 'Turkish Airlines',
  icao: 'THY',
  iata: 'TK',
  isoCountry: 'TR',
  isoRegion: 'EU',
  companyInfo: {
    employeeCount: 45000,
    foundingYear: '1933',
    parentCompany: 'Turkish Airlines Group',
    passengerCapacity: 80.2,
  },
  operations: {
    businessModel: 'passenger',
    businessType: 'major_international',
    skytraxRating: 4.2,
    slogan: 'Widen Your World',
  },
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      airlineInfo: 'Airline Information',
      businessModel: 'Business Model',
      businessType: 'Business Type',
      isoCountryCode: 'ISO Country Code',
      isoRegionCode: 'ISO Region Code',
      millionPerYear: 'million/year',
      numberOfEmployees: 'Number of Employees',
      numberOfPassengers: 'Number of Passengers',
      parentCompany: 'Parent Company',
      skytraxRating: 'Skytrax Rating',
      slogan: 'Slogan',
      year: 'years',
      yearOfEstablishment: 'Year of Establishment',
      cargo: 'Cargo',
      passenger: 'Passenger',
      lowCost: 'Low Cost',
      regional: 'Regional',
      majorInternational: 'Major International',
      charterAirline: 'charter airline',
    }
    return translations[key] || key
  })

  mockedFormatNumber.mockImplementation(num => num?.toLocaleString() || '0')
})

describe('Company Component', () => {
  it('should render AirlineSectionRow with correct title', () => {
    render(<Company airlineData={mockedAirlineData} />)

    expect(mockedAirlineSectionRow).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Airline Information',
      }),
    )
  })

  it('should render all AirlineRowItem components with correct props', () => {
    render(<Company airlineData={mockedAirlineData} />)

    expect(mockedAirlineRowItem).toHaveBeenCalledTimes(10)

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'calendar-month-outline',
        label: 'Year of Establishment',
        value: `1933 (${new Date().getFullYear() - 1933} years)`,
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'domain',
        label: 'Parent Company',
        value: 'Turkish Airlines Group',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'account-group-outline',
        label: 'Number of Passengers',
        value: '80.2 million/year',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'account-group-outline',
        label: 'Number of Employees',
        value: '45,000',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'briefcase-outline',
        label: 'Business Model',
        value: 'Passenger',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'airplane',
        label: 'Business Type',
        value: 'Major International',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'flag-outline',
        label: 'ISO Country Code',
        value: 'TR',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'map-marker-outline',
        label: 'ISO Region Code',
        value: 'EU',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'star-outline',
        label: 'Skytrax Rating',
        value: '4.2 / 5',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'chat-outline',
        label: 'Slogan',
        value: 'Widen Your World',
      }),
    )
  })

  it('should handle cargo business model correctly', () => {
    const cargoAirlineData = {
      ...mockedAirlineData,
      operations: {
        ...mockedAirlineData.operations,
        businessModel: 'cargo',
      },
    }

    render(<Company airlineData={cargoAirlineData} />)

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'briefcase-outline',
        label: 'Business Model',
        value: 'Cargo',
      }),
    )
  })

  it('should handle low_cost business type correctly', () => {
    const lowCostAirlineData = {
      ...mockedAirlineData,
      operations: {
        ...mockedAirlineData.operations,
        businessType: 'low_cost',
      },
    }

    render(<Company airlineData={lowCostAirlineData} />)

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'airplane',
        label: 'Business Type',
        value: 'Low Cost',
      }),
    )
  })

  it('should handle regional business type correctly', () => {
    const regionalAirlineData = {
      ...mockedAirlineData,
      operations: {
        ...mockedAirlineData.operations,
        businessType: 'regional',
      },
    }

    render(<Company airlineData={regionalAirlineData} />)

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'airplane',
        label: 'Business Type',
        value: 'Regional',
      }),
    )
  })

  it('should handle unknown business model by replacing underscores', () => {
    const unknownBusinessModelData = {
      ...mockedAirlineData,
      operations: {
        ...mockedAirlineData.operations,
        businessModel: 'mixed_cargo passenger',
      },
    }

    render(<Company airlineData={unknownBusinessModelData} />)

    const businessModelCalls = mockedAirlineRowItem.mock.calls.filter(
      call => call[0].icon === 'briefcase-outline' && call[0].label === 'Business Model',
    )

    expect(businessModelCalls).toHaveLength(1)
    expect(businessModelCalls[0][0]).toEqual(
      expect.objectContaining({
        icon: 'briefcase-outline',
        label: 'Business Model',
        value: 'mixed cargo passenger',
      }),
    )
  })

  it('should handle unknown business type by replacing underscores', () => {
    const unknownBusinessTypeData = {
      ...mockedAirlineData,
      operations: {
        ...mockedAirlineData.operations,
        businessType: 'charter_airline',
      },
    }

    render(<Company airlineData={unknownBusinessTypeData} />)

    const businessTypeCalls = mockedAirlineRowItem.mock.calls.filter(
      call => call[0].icon === 'airplane' && call[0].label === 'Business Type',
    )

    expect(businessTypeCalls).toHaveLength(1)
    expect(businessTypeCalls[0][0]).toEqual(
      expect.objectContaining({
        icon: 'airplane',
        label: 'Business Type',
        value: 'charter airline',
      }),
    )
  })

  it('should handle undefined airlineData gracefully', () => {
    render(<Company airlineData={undefined as any} />)

    expect(mockedAirlineSectionRow).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Airline Information',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledTimes(10)
  })

  it('should handle partial companyInfo data', () => {
    const partialData: any = {
      ...mockedAirlineData,
      companyInfo: {
        foundingYear: '1950',
      },
    }

    render(<Company airlineData={partialData} />)

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'calendar-month-outline',
        label: 'Year of Establishment',
        value: `1950 (${new Date().getFullYear() - 1950} years)`,
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'domain',
        label: 'Parent Company',
        value: undefined,
      }),
    )
  })

  it('should handle partial operations data', () => {
    const partialData: any = {
      ...mockedAirlineData,
      operations: {
        skytraxRating: 3.8,
      },
    }

    render(<Company airlineData={partialData} />)

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'star-outline',
        label: 'Skytrax Rating',
        value: '3.8 / 5',
      }),
    )

    expect(mockedAirlineRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'chat-outline',
        label: 'Slogan',
        value: undefined,
      }),
    )
  })

  it('should call formatNumber for employee count', () => {
    render(<Company airlineData={mockedAirlineData} />)

    expect(mockedFormatNumber).toHaveBeenCalledWith(45000)
  })

  it('should call getLocale for all required translations', () => {
    render(<Company airlineData={mockedAirlineData} />)

    const calledKeys = mockedGetLocale.mock.calls.map(call => call[0])
    const uniqueCalledKeys = [...new Set(calledKeys)]

    const requiredKeys = [
      'airlineInfo',
      'businessModel',
      'businessType',
      'isoCountryCode',
      'isoRegionCode',
      'numberOfEmployees',
      'numberOfPassengers',
      'parentCompany',
      'skytraxRating',
      'slogan',
      'yearOfEstablishment',
      'passenger',
      'majorInternational',
    ]

    requiredKeys.forEach(key => {
      expect(uniqueCalledKeys).toContain(key)
    })

    expect(uniqueCalledKeys.includes('year') || uniqueCalledKeys.includes('years')).toBe(true)
  })

  it('should memoize locale strings based on selectedLocale', () => {
    const { rerender } = render(<Company airlineData={mockedAirlineData} />)

    const initialCallCount = mockedGetLocale.mock.calls.length

    rerender(<Company airlineData={mockedAirlineData} />)

    expect(mockedGetLocale.mock.calls.length).toBe(initialCallCount)
  })

  it('should handle zero skytrax rating', () => {
    const zeroRatingData = {
      ...mockedAirlineData,
      operations: {
        ...mockedAirlineData.operations,
        skytraxRating: 0,
      },
    }

    render(<Company airlineData={zeroRatingData} />)

    const skytraxRatingCalls = mockedAirlineRowItem.mock.calls.filter(
      call => call[0].icon === 'star-outline' && call[0].label === 'Skytrax Rating',
    )

    expect(skytraxRatingCalls).toHaveLength(1)
    expect(skytraxRatingCalls[0][0]).toEqual(
      expect.objectContaining({
        icon: 'star-outline',
        label: 'Skytrax Rating',
        value: '0.0 / 5',
      }),
    )
  })
})

describe('Company Component Snapshot', () => {
  it('should render the Company Component successfully', () => {
    const { toJSON } = render(<Company airlineData={mockedAirlineData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
