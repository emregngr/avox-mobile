import { render } from '@testing-library/react-native'

import { RoutesList } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Sections/RoutesList'

const mockedAirportSectionRow = jest.fn()
const mockedRouteRowCard = jest.fn()

jest.mock('@/components/feature/Airport/AirportDetail/AirportSectionRow', () => {
  const { View } = require('react-native')
  return {
    AirportSectionRow: (props: any) => {
      mockedAirportSectionRow(props)
      return <View testID="mocked-section-row" {...props} />
    },
  }
})

jest.mock(
  '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Cards/RouteRowCard',
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

const mockedDefaultProps: any = {
  routes: [
    { destinationIata: 'ESB', frequency: 'Daily' },
    { destinationIata: 'ADB', frequency: 12 },
  ],
  iconColor: '#BF5700',
  title: 'Popular Routes',
}

describe('RoutesList Component', () => {
  it('should pass the correct title to AirportSectionRow', async () => {
    const { getByTestId } = await render(<RoutesList {...mockedDefaultProps} />)

    const sectionRow = getByTestId('mocked-section-row')
    expect(sectionRow.props.title).toBe(mockedDefaultProps.title)
  })

  it('should render a RouteRowCard for each route', async () => {
    const { getAllByTestId } = await render(<RoutesList {...mockedDefaultProps} />)

    const routeCards = getAllByTestId('mocked-route-card')

    expect(routeCards.length).toBe(mockedDefaultProps.routes.length)
    expect(mockedRouteRowCard).toHaveBeenCalledTimes(mockedDefaultProps.routes.length)
  })

  it('should pass the correct props to each RouteRowCard', async () => {
    await render(<RoutesList {...mockedDefaultProps} />)

    expect(mockedRouteRowCard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        destinationIata: 'ESB',
        frequency: 'Daily',
        iconColor: mockedDefaultProps.iconColor,
      }),
    )

    expect(mockedRouteRowCard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        destinationIata: 'ADB',
        frequency: 12,
        iconColor: mockedDefaultProps.iconColor,
      }),
    )
  })

  it('should render nothing inside the list when routes array is empty', async () => {
    const { queryAllByTestId } = await render(<RoutesList {...mockedDefaultProps} routes={[]} />)

    const routeCards = queryAllByTestId('mocked-route-card')
    expect(routeCards.length).toBe(0)
    expect(mockedRouteRowCard).not.toHaveBeenCalled()
  })

  it('should handle undefined or null routes prop gracefully', async () => {
    const { rerender, queryAllByTestId } = await render(
      <RoutesList {...mockedDefaultProps} routes={undefined as any} />,
    )

    expect(queryAllByTestId('mocked-route-card').length).toBe(0)
    expect(mockedRouteRowCard).not.toHaveBeenCalled()

    await rerender(<RoutesList {...mockedDefaultProps} routes={null as any} />)
    expect(queryAllByTestId('mocked-route-card').length).toBe(0)
    expect(mockedRouteRowCard).not.toHaveBeenCalled()
  })
})

describe('RoutesList Component Snapshot', () => {
  it('should render the RoutesList Component successfully', async () => {
    const { toJSON } = await render(<RoutesList {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
