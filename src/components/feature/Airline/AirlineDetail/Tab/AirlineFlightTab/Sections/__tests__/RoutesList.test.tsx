import { render } from '@testing-library/react-native'
import React from 'react'

import { RoutesList } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/RoutesList'

const mockedAirlineSectionRow = jest.fn()
const mockedRouteRowCard = jest.fn()

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

jest.mock(
  '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Cards/RouteRowCard',
  () => {
    const { View } = require('react-native')
    return {
      RouteRowCard: (props: any) => {
        mockedRouteRowCard(props)
        return <View testID="mocked-route-card" />
      },
    }
  },
)

const mockedDefaultProps = {
  routes: [
    { origin: 'IST', destinationIata: 'ESB' },
    { origin: 'IST', destinationIata: 'ADB' },
  ],
  iconColor: '#8A2BE2',
  title: 'Active Routes',
}

describe('RoutesList Component', () => {
  it('should pass the correct title to AirlineSectionRow', () => {
    const { getByTestId } = render(<RoutesList {...mockedDefaultProps} />)

    const sectionRow = getByTestId('mocked-section-row')
    expect(sectionRow.props.title).toBe(mockedDefaultProps.title)
  })

  it('should render a RouteRowCard for each route', () => {
    const { getAllByTestId } = render(<RoutesList {...mockedDefaultProps} />)

    const routeCards = getAllByTestId('mocked-route-card')
    expect(routeCards.length).toBe(mockedDefaultProps.routes.length)
    expect(mockedRouteRowCard).toHaveBeenCalledTimes(mockedDefaultProps.routes.length)
  })

  it('should pass correct props to each RouteRowCard', () => {
    render(<RoutesList {...mockedDefaultProps} />)

    expect(mockedRouteRowCard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        origin: 'IST',
        destinationIata: 'ESB',
        iconColor: mockedDefaultProps.iconColor,
      }),
    )

    expect(mockedRouteRowCard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        origin: 'IST',
        destinationIata: 'ADB',
        iconColor: mockedDefaultProps.iconColor,
      }),
    )
  })

  it('should render nothing inside the list when routes array is empty', () => {
    const { queryAllByTestId } = render(<RoutesList {...mockedDefaultProps} routes={[]} />)
    const routeCards = queryAllByTestId('mocked-route-card')
    expect(routeCards.length).toBe(0)
    expect(mockedRouteRowCard).not.toHaveBeenCalled()
  })

  it('should handle undefined or null routes prop gracefully', () => {
    const { rerender, queryAllByTestId } = render(
      <RoutesList {...mockedDefaultProps} routes={undefined as any} />,
    )
    expect(queryAllByTestId('mocked-route-card').length).toBe(0)
    expect(mockedRouteRowCard).not.toHaveBeenCalled()

    rerender(<RoutesList {...mockedDefaultProps} routes={null as any} />)
    expect(queryAllByTestId('mocked-route-card').length).toBe(0)
    expect(mockedRouteRowCard).not.toHaveBeenCalled()
  })
})

describe('RoutesList Component Snapshot', () => {
  it('should render the RoutesList Component successfully', () => {
    const { toJSON } = render(<RoutesList {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
