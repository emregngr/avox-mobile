import { act, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import React from 'react'

import { FleetTab } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

const mockedFleetStats = jest.fn()
const mockedFleetHeader = jest.fn()
const mockedFleetList = jest.fn()

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetStats', () => {
  const { View } = require('react-native')
  return {
    FleetStats: (props: any) => {
      mockedFleetStats(props)
      return <View testID="mocked-fleet-stats" {...props} />
    },
  }
})

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetHeader', () => {
  const { View } = require('react-native')
  return {
    FleetHeader: (props: any) => {
      mockedFleetHeader(props)
      return <View testID="mocked-fleet-header" {...props} />
    },
  }
})

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetList', () => {
  const { View } = require('react-native')
  return {
    FleetList: (props: any) => {
      mockedFleetList(props)
      return <View testID="mocked-fleet-list" {...props} />
    },
  }
})

const mockedAirlineData: any = {
  fleet: {
    airplanes: [
      { airplaneType: 'Airbus A320', count: 15, imageKeys: [] },
      { airplaneType: 'Boeing 777', count: 25, imageKeys: [] },
      { airplaneType: 'Boeing 737', count: 20, imageKeys: [] },
    ],
    airplaneTypeCount: 3,
    averageAgeYears: 12.5,
    totalAirplane: 60,
  },
  operations: {
    region: 'North America',
  },
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockReturnValue('Mocked Fleet Details')
})

describe('FleetTab Component', () => {
  it('should render all child components', () => {
    const { getByTestId } = render(<FleetTab airlineData={mockedAirlineData} />)

    expect(getByTestId('mocked-fleet-stats')).toBeTruthy()
    expect(getByTestId('mocked-fleet-header')).toBeTruthy()
    expect(getByTestId('mocked-fleet-list')).toBeTruthy()
  })

  describe('Prop Passing and Component Calls', () => {
    it('should pass correct props to FleetStats', () => {
      render(<FleetTab airlineData={mockedAirlineData} />)

      expect(mockedFleetStats).toHaveBeenCalledWith(
        expect.objectContaining({
          airplaneTypeCount: mockedAirlineData.fleet.airplaneTypeCount,
          averageAgeYears: mockedAirlineData.fleet.averageAgeYears,
          totalAirplane: mockedAirlineData.fleet.totalAirplane,
        }),
      )
    })

    it('should pass correct props to FleetHeader', () => {
      render(<FleetTab airlineData={mockedAirlineData} />)

      expect(mockedGetLocale).toHaveBeenCalledWith('fleetDetail')
      expect(mockedFleetHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          fleetDetailText: 'Mocked Fleet Details',
        }),
      )
    })

    it('should sort airplanes and pass correct props to FleetList', () => {
      render(<FleetTab airlineData={mockedAirlineData} />)

      const sortedAirplanes = [
        { airplaneType: 'Boeing 777', count: 25, imageKeys: [] },
        { airplaneType: 'Boeing 737', count: 20, imageKeys: [] },
        { airplaneType: 'Airbus A320', count: 15, imageKeys: [] },
      ]
      expect(mockedFleetList).toHaveBeenCalledWith(
        expect.objectContaining({
          airplanes: sortedAirplanes,
          region: mockedAirlineData.operations.region,
          totalAirplane: mockedAirlineData.fleet.totalAirplane,
          onImagePress: expect.any(Function),
        }),
      )
    })

    it('should call all components exactly once', () => {
      render(<FleetTab airlineData={mockedAirlineData} />)

      expect(mockedFleetStats).toHaveBeenCalledTimes(1)
      expect(mockedFleetHeader).toHaveBeenCalledTimes(1)
      expect(mockedFleetList).toHaveBeenCalledTimes(1)
    })
  })

  describe('Functionality and Edge Cases', () => {
    it('should call router.navigate with correct parameters when onImagePress is triggered', () => {
      render(<FleetTab airlineData={mockedAirlineData} />)

      const onImagePressCallback = mockedFleetList.mock.calls[0][0].onImagePress
      const testAirplaneType = 'Test Plane'
      const testImageKey = 'test-image-123'
      act(() => {
        onImagePressCallback(testAirplaneType, testImageKey)
      })
      expect(router.navigate).toHaveBeenCalledTimes(1)
      expect(router.navigate).toHaveBeenCalledWith({
        pathname: '/image-modal',
        params: {
          title: testAirplaneType,
          selectedImageKey: testImageKey,
        },
      })
    })

    it('should handle partially incomplete data gracefully', () => {
      const incompleteData: any = {
        operations: {
          region: 'Asia',
        },
      }
      render(<FleetTab airlineData={incompleteData} />)

      expect(mockedFleetStats).toHaveBeenCalledWith(
        expect.objectContaining({
          airplaneTypeCount: undefined,
          averageAgeYears: undefined,
          totalAirplane: undefined,
        }),
      )
      expect(mockedFleetList).toHaveBeenCalledWith(
        expect.objectContaining({
          airplanes: undefined,
          region: 'Asia',
          totalAirplane: undefined,
        }),
      )
    })

    it('should handle completely empty data without crashing', () => {
      const { getByTestId } = render(<FleetTab airlineData={{} as any} />)

      expect(getByTestId('mocked-fleet-stats')).toBeTruthy()
      expect(getByTestId('mocked-fleet-header')).toBeTruthy()
      expect(getByTestId('mocked-fleet-list')).toBeTruthy()
      expect(mockedFleetList).toHaveBeenCalledWith(
        expect.objectContaining({
          airplanes: undefined,
          region: undefined,
        }),
      )
    })
  })
})

describe('FleetTab Component Snapshot', () => {
  it('should render the FleetTab Component successfully', () => {
    const { toJSON } = render(<FleetTab airlineData={mockedAirlineData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
