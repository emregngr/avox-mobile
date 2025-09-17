import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { ActiveFilters } from '@/components/feature/ActiveFilters'
import { getLocale } from '@/locales/i18next'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

const mockedOnClearAll = jest.fn()
const onRemove = jest.fn()

const mockedFilters = {
  freeWifi: true,
  hasCarRental: true,
  hasChildrensPlayArea: true,
  hasDutyFree: true,
  hasHealthServices: true,
  hasHotels: true,
  hasLounges: true,
  hasMetro: true,
  hasPrayerRoom: true,
  hasRestaurants: true,
  is24Hour: true,
  minGoogleRating: 4,
  minSkytraxRating: 4,
}

beforeEach(() => {
  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      clear: 'Clear',
    }
    return translations[key] || key
  })
})

describe('ActiveFilters Component', () => {
  it('renders nothing when there are no filters', () => {
    const { toJSON } = render(
      <ActiveFilters filters={{}} onClearAll={mockedOnClearAll} onRemove={onRemove} />,
    )
    expect(toJSON()).toBeNull()
  })

  it('renders active filters with count', () => {
    const { getByText } = render(
      <ActiveFilters filters={mockedFilters} onClearAll={mockedOnClearAll} onRemove={onRemove} />,
    )

    expect(getByText(/clear/i).props.children.join('')).toContain('Clear (13)')
  })

  it('calls onClearAll when clear button pressed', () => {
    const { getByText } = render(
      <ActiveFilters filters={mockedFilters} onClearAll={mockedOnClearAll} onRemove={onRemove} />,
    )

    fireEvent.press(getByText(/clear/i))
    expect(mockedOnClearAll).toHaveBeenCalledTimes(1)
  })

  it('calls onClearAll when clear button pressed', () => {
    const { getByTestId } = render(
      <ActiveFilters filters={mockedFilters} onClearAll={mockedOnClearAll} onRemove={onRemove} />,
    )

    fireEvent.press(getByTestId('active-filters-clear-button'))
    expect(mockedOnClearAll).toHaveBeenCalledTimes(1)
  })

  it('calls onRemove when a filter close button pressed', () => {
    const { getByTestId } = render(
      <ActiveFilters filters={mockedFilters} onClearAll={mockedOnClearAll} onRemove={onRemove} />,
    )

    fireEvent.press(getByTestId('active-filters-remove-freeWifi'))
    expect(onRemove).toHaveBeenCalledWith('freeWifi')
  })
})

describe('ActiveFilters Component Snapshot', () => {
  it('should render the ActiveFilters Component successfully', () => {
    const { toJSON } = render(
      <ActiveFilters filters={{}} onClearAll={mockedOnClearAll} onRemove={onRemove} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
