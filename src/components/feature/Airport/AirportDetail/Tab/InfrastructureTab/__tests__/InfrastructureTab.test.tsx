import { render } from '@testing-library/react-native'
import React from 'react'

import { InfrastructureTab } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab'

const mockedTerminal = jest.fn()
const mockedRunway = jest.fn()
const mockedFacilities = jest.fn()
const mockedCargo = jest.fn()
const mockedCertifications = jest.fn()

jest.mock(
  '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Terminal',
  () => {
    const { Text } = require('react-native')
    return {
      Terminal: (props: any) => {
        mockedTerminal(props)
        return <Text testID="terminal-section">Terminal</Text>
      },
    }
  },
)

jest.mock(
  '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Runway',
  () => {
    const { Text } = require('react-native')
    return {
      Runway: (props: any) => {
        mockedRunway(props)
        return <Text testID="runway-section">Runway</Text>
      },
    }
  },
)

jest.mock(
  '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Facilities',
  () => {
    const { Text } = require('react-native')
    return {
      Facilities: (props: any) => {
        mockedFacilities(props)
        return <Text testID="facilities-section">Facilities</Text>
      },
    }
  },
)

jest.mock('@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Cargo', () => {
  const { Text } = require('react-native')
  return {
    Cargo: (props: any) => {
      mockedCargo(props)
      return <Text testID="cargo-section">Cargo</Text>
    },
  }
})

jest.mock(
  '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Certifications',
  () => {
    const { Text } = require('react-native')
    return {
      Certifications: (props: any) => {
        mockedCertifications(props)
        return <Text testID="certifications-section">Certifications</Text>
      },
    }
  },
)

const mockedAirportData: any = {
  cargo: {
    capacity: 5_500_000,
    area: 1_400_000,
  },
  facilities: {
    lounges: 12,
    terminals: 1,
  },
  infrastructure: {
    runways: [{ id: '1', length: 4100 }],
    terminals: [{ id: 'T1', area: 1_440_000 }],
  },
  safety: {
    certifications: ['ISO 9001', 'ISO 14001'],
    fireFightingCategory: 'CAT 10',
  },
}

describe('InfrastructureTab Component', () => {
  it('should render all section components', () => {
    const { getByTestId } = render(<InfrastructureTab airportData={mockedAirportData} />)

    expect(getByTestId('terminal-section')).toBeTruthy()
    expect(getByTestId('runway-section')).toBeTruthy()
    expect(getByTestId('facilities-section')).toBeTruthy()
    expect(getByTestId('cargo-section')).toBeTruthy()
    expect(getByTestId('certifications-section')).toBeTruthy()
  })

  it('should pass correct props to Terminal component', () => {
    render(<InfrastructureTab airportData={mockedAirportData} />)

    expect(mockedTerminal).toHaveBeenCalledWith({
      infrastructure: mockedAirportData.infrastructure,
    })
  })

  it('should pass correct props to Runway component', () => {
    render(<InfrastructureTab airportData={mockedAirportData} />)

    expect(mockedRunway).toHaveBeenCalledWith({
      infrastructure: mockedAirportData.infrastructure,
    })
  })

  it('should pass correct props to Facilities component', () => {
    render(<InfrastructureTab airportData={mockedAirportData} />)

    expect(mockedFacilities).toHaveBeenCalledWith({
      facilities: mockedAirportData.facilities,
      infrastructure: mockedAirportData.infrastructure,
    })
  })

  it('should pass correct props to Cargo component', () => {
    render(<InfrastructureTab airportData={mockedAirportData} />)

    expect(mockedCargo).toHaveBeenCalledWith({
      cargo: mockedAirportData.cargo,
    })
  })

  it('should pass correct props to Certifications component', () => {
    render(<InfrastructureTab airportData={mockedAirportData} />)

    expect(mockedCertifications).toHaveBeenCalledWith({
      safety: mockedAirportData.safety,
    })
  })

  it('should handle undefined airportData gracefully', () => {
    render(<InfrastructureTab airportData={undefined as any} />)

    expect(mockedTerminal).toHaveBeenCalledWith({ infrastructure: undefined })
    expect(mockedFacilities).toHaveBeenCalledWith({
      facilities: undefined,
      infrastructure: undefined,
    })
    expect(mockedCargo).toHaveBeenCalledWith({ cargo: undefined })
    expect(mockedCertifications).toHaveBeenCalledWith({ safety: undefined })
  })

  it('should handle partial airportData (missing infrastructure)', () => {
    const partialData: any = {
      cargo: mockedAirportData.cargo,
      safety: mockedAirportData.safety,
    }

    render(<InfrastructureTab airportData={partialData} />)

    expect(mockedTerminal).toHaveBeenCalledWith({ infrastructure: undefined })
    expect(mockedRunway).toHaveBeenCalledWith({ infrastructure: undefined })
    expect(mockedCargo).toHaveBeenCalledWith({ cargo: partialData.cargo })
  })

  it('should handle partial airportData (missing safety and cargo)', () => {
    const partialData: any = {
      facilities: mockedAirportData.facilities,
      infrastructure: mockedAirportData.infrastructure,
    }

    render(<InfrastructureTab airportData={partialData} />)

    expect(mockedFacilities).toHaveBeenCalledWith({
      facilities: partialData.facilities,
      infrastructure: partialData.infrastructure,
    })
    expect(mockedCargo).toHaveBeenCalledWith({ cargo: undefined })
    expect(mockedCertifications).toHaveBeenCalledWith({ safety: undefined })
  })

  it('should call all section components exactly once', () => {
    render(<InfrastructureTab airportData={mockedAirportData} />)

    expect(mockedTerminal).toHaveBeenCalledTimes(1)
    expect(mockedRunway).toHaveBeenCalledTimes(1)
    expect(mockedFacilities).toHaveBeenCalledTimes(1)
    expect(mockedCargo).toHaveBeenCalledTimes(1)
    expect(mockedCertifications).toHaveBeenCalledTimes(1)
  })
})

describe('InfrastructureTab Component Snapshot', () => {
  it('should render the InfrastructureTab Component successfully', () => {
    const { toJSON } = render(<InfrastructureTab airportData={mockedAirportData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
