import { render } from '@testing-library/react-native'
import React from 'react'

import { Hub } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Hub'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

const mockedOperations: any = {
  country: 'Türkiye',
  hub: {
    city: 'İstanbul',
  },
}

describe('Hub Component', () => {
  it('renders hub information section', () => {
    const { getByText } = render(<Hub operations={mockedOperations} />)

    expect(getByText('hubInformation')).toBeTruthy()

    expect(getByText('city')).toBeTruthy()
    expect(getByText('country')).toBeTruthy()

    expect(getByText('İstanbul')).toBeTruthy()
    expect(getByText('Türkiye')).toBeTruthy()
  })

  it('renders without values if operations is empty', () => {
    const { queryByText } = render(<Hub operations={{} as any} />)

    expect(queryByText('İstanbul')).toBeNull()
    expect(queryByText('Türkiye')).toBeNull()
  })
})

describe('Hub Component Snapshot', () => {
  it('should render the Hub Component successfully', () => {
    const { toJSON } = render(<Hub operations={mockedOperations} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
