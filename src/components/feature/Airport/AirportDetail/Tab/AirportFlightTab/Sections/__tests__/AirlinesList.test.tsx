import { render } from '@testing-library/react-native'
import React from 'react'

import { AirlinesList } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Sections/AirlinesList'

const mockedAirportSectionRow = jest.fn()
const mockedAirlineRowCard = jest.fn()

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
  '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Cards/AirlineRowCard',
  () => {
    const { View } = require('react-native')
    return {
      AirlineRowCard: (props: any) => {
        mockedAirlineRowCard(props)
        return <View testID="mocked-airline-card" />
      },
    }
  },
)

const mockedDefaultProps = {
  airlines: ['Turkish Airlines', 'Pegasus Airlines', 'AnadoluJet'],
  iconColor: '#1A73E8',
  title: 'Operating Airlines',
}

describe('AirlinesList Component', () => {
  it('should pass the correct title to AirportSectionRow', () => {
    const { getByTestId } = render(<AirlinesList {...mockedDefaultProps} />)

    const sectionRow = getByTestId('mocked-section-row')
    expect(sectionRow.props.title).toBe(mockedDefaultProps.title)
  })

  it('should render an AirlineRowCard for each airline', () => {
    const { getAllByTestId } = render(<AirlinesList {...mockedDefaultProps} />)

    const airlineCards = getAllByTestId('mocked-airline-card')
    expect(airlineCards.length).toBe(mockedDefaultProps.airlines.length)
    expect(mockedAirlineRowCard).toHaveBeenCalledTimes(mockedDefaultProps.airlines.length)
  })

  it('should pass the correct props to each AirlineRowCard', () => {
    render(<AirlinesList {...mockedDefaultProps} />)

    expect(mockedAirlineRowCard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        airline: 'Turkish Airlines',
        iconColor: mockedDefaultProps.iconColor,
      }),
    )

    expect(mockedAirlineRowCard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        airline: 'Pegasus Airlines',
        iconColor: mockedDefaultProps.iconColor,
      }),
    )
  })

  it('should render nothing inside the list when airlines array is empty', () => {
    const { queryAllByTestId } = render(<AirlinesList {...mockedDefaultProps} airlines={[]} />)

    const airlineCards = queryAllByTestId('mocked-airline-card')
    expect(airlineCards.length).toBe(0)
    expect(mockedAirlineRowCard).not.toHaveBeenCalled()
  })

  it('should handle undefined or null airlines prop gracefully', () => {
    const { rerender, queryAllByTestId } = render(
      <AirlinesList {...mockedDefaultProps} airlines={undefined as any} />,
    )
    expect(queryAllByTestId('mocked-airline-card').length).toBe(0)
    expect(mockedAirlineRowCard).not.toHaveBeenCalled()

    rerender(<AirlinesList {...mockedDefaultProps} airlines={null as any} />)
    expect(queryAllByTestId('mocked-airline-card').length).toBe(0)
    expect(mockedAirlineRowCard).not.toHaveBeenCalled()
  })
})

describe('AirlinesList Component Snapshot', () => {
  it('should render the AirlinesList Component successfully', () => {
    const { toJSON } = render(<AirlinesList {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
