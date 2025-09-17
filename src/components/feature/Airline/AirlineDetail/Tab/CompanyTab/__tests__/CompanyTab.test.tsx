import { render } from '@testing-library/react-native'
import React from 'react'

import { CompanyTab } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab'

const mockedCompany = jest.fn()
const mockedContact = jest.fn()
const mockedSocialMedia = jest.fn()
const mockedHub = jest.fn()
const mockedMap = jest.fn()

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Company', () => {
  const { Text } = require('react-native')
  return {
    Company: (props: any) => {
      mockedCompany(props)
      return <Text testID="company-section">Company Section - {props.airlineData?.name}</Text>
    },
  }
})

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Contact', () => {
  const { Text } = require('react-native')
  return {
    Contact: (props: any) => {
      mockedContact(props)
      return <Text testID="contact-section">Contact Section - {props.companyInfo?.email}</Text>
    },
  }
})

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/SocialMedia', () => {
  const { Text } = require('react-native')
  return {
    SocialMedia: (props: any) => {
      mockedSocialMedia(props)
      return <Text testID="social-media-section">Social Media Section</Text>
    },
  }
})

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Hub', () => {
  const { Text } = require('react-native')
  return {
    Hub: (props: any) => {
      mockedHub(props)
      return <Text testID="hub-section">Hub Section - {props.operations?.hubCount}</Text>
    },
  }
})

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Map', () => {
  const { Text } = require('react-native')
  return {
    Map: (props: any) => {
      mockedMap(props)
      return <Text testID="map-section">Map Section - {props.airlineData?.icao}</Text>
    },
  }
})

const mockedAirlineData: any = {
  id: '1',
  name: 'Turkish Airlines',
  icao: 'THY',
  iata: 'TK',
  companyInfo: {
    email: 'info@turkishairlines.com',
    phone: '+90 212 444 0 849',
    website: 'https://www.turkishairlines.com',
    address: 'Istanbul, Turkey',
    socialMedia: {
      facebook: 'turkishairlines',
      twitter: 'turkishairlines',
      instagram: 'turkishairlines',
    },
  },
  operations: {
    hubCount: 2,
    destinations: 340,
    fleet: {
      total: 380,
      types: ['A320', 'B737', 'A350', 'B777'],
    },
  },
}

describe('CompanyTab Component', () => {
  it('should render all section components', () => {
    const { getByTestId } = render(<CompanyTab airlineData={mockedAirlineData} />)

    expect(getByTestId('company-section')).toBeTruthy()
    expect(getByTestId('contact-section')).toBeTruthy()
    expect(getByTestId('social-media-section')).toBeTruthy()
    expect(getByTestId('hub-section')).toBeTruthy()
    expect(getByTestId('map-section')).toBeTruthy()
  })

  it('should pass airlineData to Company component', () => {
    render(<CompanyTab airlineData={mockedAirlineData} />)

    expect(mockedCompany).toHaveBeenCalledWith(
      expect.objectContaining({
        airlineData: mockedAirlineData,
      }),
    )
  })

  it('should pass companyInfo to Contact component', () => {
    render(<CompanyTab airlineData={mockedAirlineData} />)

    expect(mockedContact).toHaveBeenCalledWith(
      expect.objectContaining({
        companyInfo: mockedAirlineData.companyInfo,
      }),
    )
  })

  it('should pass companyInfo to SocialMedia component', () => {
    render(<CompanyTab airlineData={mockedAirlineData} />)

    expect(mockedSocialMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        companyInfo: mockedAirlineData.companyInfo,
      }),
    )
  })

  it('should pass operations to Hub component', () => {
    render(<CompanyTab airlineData={mockedAirlineData} />)

    expect(mockedHub).toHaveBeenCalledWith(
      expect.objectContaining({
        operations: mockedAirlineData.operations,
      }),
    )
  })

  it('should pass airlineData to Map component', () => {
    render(<CompanyTab airlineData={mockedAirlineData} />)

    expect(mockedMap).toHaveBeenCalledWith(
      expect.objectContaining({
        airlineData: mockedAirlineData,
      }),
    )
  })

  it('should handle undefined airlineData gracefully', () => {
    render(<CompanyTab airlineData={undefined as any} />)

    expect(mockedContact).toHaveBeenCalledWith(
      expect.objectContaining({
        companyInfo: undefined,
      }),
    )

    expect(mockedHub).toHaveBeenCalledWith(
      expect.objectContaining({
        operations: undefined,
      }),
    )
  })

  it('should handle partial airlineData (missing companyInfo)', () => {
    const partialData = {
      id: '1',
      name: 'Test Airline',
      operations: mockedAirlineData.operations,
    } as any

    render(<CompanyTab airlineData={partialData} />)

    expect(mockedContact).toHaveBeenCalledWith(
      expect.objectContaining({
        companyInfo: undefined,
      }),
    )

    expect(mockedHub).toHaveBeenCalledWith(
      expect.objectContaining({
        operations: partialData.operations,
      }),
    )
  })

  it('should handle partial airlineData (missing operations)', () => {
    const partialData = {
      id: '1',
      name: 'Test Airline',
      companyInfo: mockedAirlineData.companyInfo,
    } as any

    render(<CompanyTab airlineData={partialData} />)

    expect(mockedContact).toHaveBeenCalledWith(
      expect.objectContaining({
        companyInfo: partialData.companyInfo,
      }),
    )

    expect(mockedHub).toHaveBeenCalledWith(
      expect.objectContaining({
        operations: undefined,
      }),
    )
  })

  it('should render with correct container styling', () => {
    const { getByTestId } = render(<CompanyTab airlineData={mockedAirlineData} />)

    const companySection = getByTestId('company-section')
    expect(companySection).toBeTruthy()
  })

  it('should call all section components exactly once', () => {
    render(<CompanyTab airlineData={mockedAirlineData} />)

    expect(mockedCompany).toHaveBeenCalledTimes(1)
    expect(mockedContact).toHaveBeenCalledTimes(1)
    expect(mockedSocialMedia).toHaveBeenCalledTimes(1)
    expect(mockedHub).toHaveBeenCalledTimes(1)
    expect(mockedMap).toHaveBeenCalledTimes(1)
  })
})

describe('CompanyTab Component Snapshot', () => {
  it('should render the CompanyTab Component successfully', () => {
    const { toJSON } = render(<CompanyTab airlineData={mockedAirlineData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
