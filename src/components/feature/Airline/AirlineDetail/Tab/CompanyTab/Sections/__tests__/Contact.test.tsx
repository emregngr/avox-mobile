import { fireEvent, render } from '@testing-library/react-native'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import React from 'react'

import { Contact } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Contact'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

const mockedCompanyInfo: any = {
  website: 'example.com',
  contactInfo: {
    email: 'test@example.com',
    phone: '+905551112233',
  },
}

describe('Contact Component', () => {
  it('renders website, phone and email rows correctly', () => {
    const { getByText } = render(<Contact companyInfo={mockedCompanyInfo} />)

    expect(getByText('website')).toBeTruthy()
    expect(getByText('example.com')).toBeTruthy()
    expect(getByText('phone')).toBeTruthy()
    expect(getByText('+905551112233')).toBeTruthy()
    expect(getByText('email')).toBeTruthy()
    expect(getByText('test@example.com')).toBeTruthy()
  })

  it('calls Linking.openURL with tel when phone is pressed', () => {
    const { getByText } = render(<Contact companyInfo={mockedCompanyInfo} />)

    fireEvent.press(getByText('+905551112233'))
    expect(Linking.openURL).toHaveBeenCalledWith('tel:+905551112233')
  })

  it('calls Linking.openURL with mailto when email is pressed', () => {
    const { getByText } = render(<Contact companyInfo={mockedCompanyInfo} />)

    fireEvent.press(getByText('test@example.com'))
    expect(Linking.openURL).toHaveBeenCalledWith('mailto:test@example.com')
  })

  it('navigates to web-view-modal when website is pressed', () => {
    const { getByText } = render(<Contact companyInfo={mockedCompanyInfo} />)

    fireEvent.press(getByText('example.com'))
    expect(router.navigate).toHaveBeenCalledWith({
      params: {
        title: 'example.com',
        webViewUrl: 'https://example.com',
      },
      pathname: '/web-view-modal',
    })
  })

  it('navigates correctly when website URL already includes http', () => {
    const companyInfoWithHttp: any = {
      ...mockedCompanyInfo,
      website: 'http://example.com',
    }
    const { getByText } = render(<Contact companyInfo={companyInfoWithHttp} />)

    fireEvent.press(getByText('http://example.com'))
    expect(router.navigate).toHaveBeenCalledWith({
      params: {
        title: 'http://example.com',
        webViewUrl: 'http://example.com',
      },
      pathname: '/web-view-modal',
    })
  })

  it('does not call Linking.openURL if phone is not provided', () => {
    const companyInfoWithoutPhone: any = {
      ...mockedCompanyInfo,
      contactInfo: { email: 'test@example.com', phone: undefined },
    }
    const { getByText } = render(<Contact companyInfo={companyInfoWithoutPhone} />)
    const phoneRow = getByText('phone')

    fireEvent.press(phoneRow)
    expect(Linking.openURL).not.toHaveBeenCalled()
  })

  it('does not call Linking.openURL if email is not provided', () => {
    const companyInfoWithoutEmail: any = {
      ...mockedCompanyInfo,
      contactInfo: { email: undefined, phone: '+905551112233' },
    }
    const { getByText } = render(<Contact companyInfo={companyInfoWithoutEmail} />)
    const emailRow = getByText('email')

    fireEvent.press(emailRow)
    expect(Linking.openURL).not.toHaveBeenCalled()
  })

  it('does not navigate if website is not provided', () => {
    const companyInfoWithoutWebsite: any = {
      ...mockedCompanyInfo,
      website: undefined,
    }
    const { getByText } = render(<Contact companyInfo={companyInfoWithoutWebsite} />)
    const websiteRow = getByText('website')

    fireEvent.press(websiteRow)
    expect(router.navigate).not.toHaveBeenCalled()
  })

  it('renders labels without crashing when companyInfo is null or undefined', () => {
    const { queryByText } = render(<Contact companyInfo={null as any} />)

    expect(queryByText('website')).not.toBeNull()
    expect(queryByText('phone')).not.toBeNull()
    expect(queryByText('email')).not.toBeNull()
  })

  it('renders without crashing when contactInfo is null or undefined', () => {
    const companyInfoWithoutContact: any = {
      ...mockedCompanyInfo,
      contactInfo: undefined,
    }
    const { getByText, queryByText } = render(<Contact companyInfo={companyInfoWithoutContact} />)

    expect(getByText('website')).toBeTruthy()
    expect(queryByText('phone')).not.toBeNull()
    expect(queryByText('email')).not.toBeNull()
  })
})

describe('Contact Component Snapshot', () => {
  it('should render the Contact Component successfully', () => {
    const { toJSON } = render(<Contact companyInfo={mockedCompanyInfo} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
