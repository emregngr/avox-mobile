import { render } from '@testing-library/react-native'
import React from 'react'

import { DestinationList } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/DestinationList'

const mockedAirlineSectionRow = jest.fn()
const mockedDestinationRowCard = jest.fn()

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
  '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Cards/DestinationRowCard',
  () => {
    const { View } = require('react-native')
    return {
      DestinationRowCard: (props: any) => {
        mockedDestinationRowCard(props)
        return <View testID="mocked-destination-card" />
      },
    }
  },
)

const mockedDefaultProps = {
  destinations: ['Ankara', 'İzmir', 'Antalya'],
  iconColor: '#FF0000',
  title: 'Popular Destinations',
}

describe('DestinationList Component', () => {
  it('should pass the correct title to AirlineSectionRow', () => {
    const { getByTestId } = render(<DestinationList {...mockedDefaultProps} />)

    const sectionRow = getByTestId('mocked-section-row')
    expect(sectionRow.props.title).toBe(mockedDefaultProps.title)
  })

  it('should render a DestinationRowCard for each destination', () => {
    const { getAllByTestId } = render(<DestinationList {...mockedDefaultProps} />)

    const destinationCards = getAllByTestId('mocked-destination-card')
    expect(destinationCards.length).toBe(mockedDefaultProps.destinations.length)
    expect(mockedDestinationRowCard).toHaveBeenCalledTimes(mockedDefaultProps.destinations.length)
  })

  it('should pass correct props to each DestinationRowCard', () => {
    render(<DestinationList {...mockedDefaultProps} />)

    expect(mockedDestinationRowCard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        destination: 'Ankara',
        iconColor: mockedDefaultProps.iconColor,
      }),
    )

    expect(mockedDestinationRowCard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        destination: 'İzmir',
        iconColor: mockedDefaultProps.iconColor,
      }),
    )

    expect(mockedDestinationRowCard).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        destination: 'Antalya',
        iconColor: mockedDefaultProps.iconColor,
      }),
    )
  })

  it('should render nothing inside the list when destinations array is empty', () => {
    const { queryAllByTestId } = render(
      <DestinationList {...mockedDefaultProps} destinations={[]} />,
    )
    const destinationCards = queryAllByTestId('mocked-destination-card')
    expect(destinationCards.length).toBe(0)
    expect(mockedDestinationRowCard).not.toHaveBeenCalled()
  })

  it('should handle undefined or null destinations prop gracefully', () => {
    const { rerender, queryAllByTestId } = render(
      <DestinationList {...mockedDefaultProps} destinations={undefined as any} />,
    )
    expect(queryAllByTestId('mocked-destination-card').length).toBe(0)
    expect(mockedDestinationRowCard).not.toHaveBeenCalled()

    rerender(<DestinationList {...mockedDefaultProps} destinations={null as any} />)
    expect(queryAllByTestId('mocked-destination-card').length).toBe(0)
    expect(mockedDestinationRowCard).not.toHaveBeenCalled()
  })
})

describe('DestinationList Component Snapshot', () => {
  it('should render the DestinationList Component successfully', () => {
    const { toJSON } = render(<DestinationList {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
