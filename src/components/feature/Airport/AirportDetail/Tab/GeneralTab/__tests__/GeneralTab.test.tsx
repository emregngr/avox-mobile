import { render } from '@testing-library/react-native'
import React from 'react'

import { GeneralTab } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab'

const mockedGeneral = jest.fn()
const mockedServices = jest.fn()
const mockedContact = jest.fn()
const mockedSocialMedia = jest.fn()
const mockedLocation = jest.fn()
const mockedMap = jest.fn()

jest.mock('@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/General', () => {
  const { Text } = require('react-native')
  return {
    General: (props: any) => {
      mockedGeneral(props)
      return <Text testID="general-section">General</Text>
    },
  }
})

jest.mock('@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Services', () => {
  const { Text } = require('react-native')
  return {
    Services: (props: any) => {
      mockedServices(props)
      return <Text testID="services-section">Services</Text>
    },
  }
})

jest.mock('@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Contact', () => {
  const { Text } = require('react-native')
  return {
    Contact: (props: any) => {
      mockedContact(props)
      return <Text testID="contact-section">Contact</Text>
    },
  }
})

jest.mock('@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/SocialMedia', () => {
  const { Text } = require('react-native')
  return {
    SocialMedia: (props: any) => {
      mockedSocialMedia(props)
      return <Text testID="social-media-section">SocialMedia</Text>
    },
  }
})

jest.mock('@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Location', () => {
  const { Text } = require('react-native')
  return {
    Location: (props: any) => {
      mockedLocation(props)
      return <Text testID="location-section">Location</Text>
    },
  }
})

jest.mock('@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Map', () => {
  const { Text } = require('react-native')
  return {
    Map: (props: any) => {
      mockedMap(props)
      return <Text testID="map-section">Map</Text>
    },
  }
})

const mockedAirportData: any = {
  airportInfo: {
    id: 'IST',
    name: 'Istanbul Airport',
    email: 'info@istairport.com',
  },
  facilities: {
    lounges: 12,
    terminals: 1,
    shops: 200,
  },
  operations: {
    airportType: 'mega_airport',
    is24Hour: true,
  },
  statistics: {
    passengerCount: 70000000,
  },
}

describe('GeneralTab Component', () => {
  it('should render all section components', () => {
    const { getByTestId } = render(<GeneralTab airportData={mockedAirportData} />)

    expect(getByTestId('general-section')).toBeTruthy()
    expect(getByTestId('services-section')).toBeTruthy()
    expect(getByTestId('contact-section')).toBeTruthy()
    expect(getByTestId('social-media-section')).toBeTruthy()
    expect(getByTestId('location-section')).toBeTruthy()
    expect(getByTestId('map-section')).toBeTruthy()
  })

  it('should pass correct props to General component', () => {
    render(<GeneralTab airportData={mockedAirportData} />)

    expect(mockedGeneral).toHaveBeenCalledWith({
      airportInfo: mockedAirportData.airportInfo,
      operations: mockedAirportData.operations,
    })
  })

  it('should pass correct props to Services component', () => {
    render(<GeneralTab airportData={mockedAirportData} />)

    expect(mockedServices).toHaveBeenCalledWith({
      facilities: mockedAirportData.facilities,
    })
  })

  it('should pass correct props to Contact component', () => {
    render(<GeneralTab airportData={mockedAirportData} />)

    expect(mockedContact).toHaveBeenCalledWith({
      airportInfo: mockedAirportData.airportInfo,
    })
  })

  it('should pass correct props to SocialMedia component', () => {
    render(<GeneralTab airportData={mockedAirportData} />)

    expect(mockedSocialMedia).toHaveBeenCalledWith({
      airportInfo: mockedAirportData.airportInfo,
    })
  })

  it('should pass correct props to Location component', () => {
    render(<GeneralTab airportData={mockedAirportData} />)

    expect(mockedLocation).toHaveBeenCalledWith({
      operations: mockedAirportData.operations,
    })
  })

  it('should pass correct props to Map component', () => {
    render(<GeneralTab airportData={mockedAirportData} />)

    expect(mockedMap).toHaveBeenCalledWith({
      airportData: mockedAirportData,
    })
  })

  it('should handle undefined airportData gracefully', () => {
    render(<GeneralTab airportData={undefined as any} />)

    expect(mockedGeneral).toHaveBeenCalledWith({
      airportInfo: undefined,
      operations: undefined,
    })
    expect(mockedServices).toHaveBeenCalledWith({ facilities: undefined })
    expect(mockedMap).toHaveBeenCalledWith({ airportData: undefined })
  })

  it('should handle partial airportData (missing facilities)', () => {
    const partialData: any = {
      airportInfo: mockedAirportData.airportInfo,
      operations: mockedAirportData.operations,
    }

    render(<GeneralTab airportData={partialData} />)

    expect(mockedGeneral).toHaveBeenCalledWith({
      airportInfo: partialData.airportInfo,
      operations: partialData.operations,
    })
    expect(mockedServices).toHaveBeenCalledWith({ facilities: undefined })
  })

  it('should handle partial airportData (missing airportInfo)', () => {
    const partialData: any = {
      facilities: mockedAirportData.facilities,
      operations: mockedAirportData.operations,
    }

    render(<GeneralTab airportData={partialData} />)

    expect(mockedGeneral).toHaveBeenCalledWith({
      airportInfo: undefined,
      operations: partialData.operations,
    })
    expect(mockedContact).toHaveBeenCalledWith({ airportInfo: undefined })
    expect(mockedSocialMedia).toHaveBeenCalledWith({ airportInfo: undefined })
  })

  it('should call all section components exactly once', () => {
    render(<GeneralTab airportData={mockedAirportData} />)

    expect(mockedGeneral).toHaveBeenCalledTimes(1)
    expect(mockedServices).toHaveBeenCalledTimes(1)
    expect(mockedContact).toHaveBeenCalledTimes(1)
    expect(mockedSocialMedia).toHaveBeenCalledTimes(1)
    expect(mockedLocation).toHaveBeenCalledTimes(1)
    expect(mockedMap).toHaveBeenCalledTimes(1)
  })
})

describe('GeneralTab Component Snapshot', () => {
  it('should render the GeneralTab Component successfully', () => {
    const { toJSON } = render(<GeneralTab airportData={mockedAirportData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
