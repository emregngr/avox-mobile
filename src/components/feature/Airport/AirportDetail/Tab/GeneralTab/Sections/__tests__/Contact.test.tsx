import { fireEvent, render } from '@testing-library/react-native'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'

import { Contact } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Contact'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

const mockedAirportInfo: any = {
  website: 'example.com',
  contactInfo: {
    email: 'test@example.com',
    phone: '+905551112233',
  },
}

describe('Contact Component', () => {
  it('renders website, phone and email rows correctly', async () => {
    const { getByText } = await render(<Contact airportInfo={mockedAirportInfo} />)

    expect(getByText('website')).toBeTruthy()
    expect(getByText('example.com')).toBeTruthy()
    expect(getByText('phone')).toBeTruthy()
    expect(getByText('+905551112233')).toBeTruthy()
    expect(getByText('email')).toBeTruthy()
    expect(getByText('test@example.com')).toBeTruthy()
  })

  it('calls Linking.openURL with tel when phone is pressed', async () => {
    const { getByText } = await render(<Contact airportInfo={mockedAirportInfo} />)

    await fireEvent.press(getByText('+905551112233'))
    expect(Linking.openURL).toHaveBeenCalledWith('tel:+905551112233')
  })

  it('calls Linking.openURL with mailto when email is pressed', async () => {
    const { getByText } = await render(<Contact airportInfo={mockedAirportInfo} />)

    await fireEvent.press(getByText('test@example.com'))
    expect(Linking.openURL).toHaveBeenCalledWith('mailto:test@example.com')
  })

  it('navigates to web-view-modal when website is pressed', async () => {
    const { getByText } = await render(<Contact airportInfo={mockedAirportInfo} />)

    await fireEvent.press(getByText('example.com'))
    expect(router.navigate).toHaveBeenCalledWith({
      params: {
        title: 'example.com',
        webViewUrl: 'https://example.com',
      },
      pathname: '/web-view-modal',
    })
  })

  it('navigates correctly when website URL already includes http', async () => {
    const airportInfoWithHttp: any = {
      ...mockedAirportInfo,
      website: 'http://example.com',
    }
    const { getByText } = await render(<Contact airportInfo={airportInfoWithHttp} />)

    await fireEvent.press(getByText('http://example.com'))
    expect(router.navigate).toHaveBeenCalledWith({
      params: {
        title: 'http://example.com',
        webViewUrl: 'http://example.com',
      },
      pathname: '/web-view-modal',
    })
  })

  it('does not call Linking.openURL if phone is not provided', async () => {
    const airportInfoWithoutPhone: any = {
      ...mockedAirportInfo,
      contactInfo: { email: 'test@example.com', phone: undefined },
    }
    const { getByText } = await render(<Contact airportInfo={airportInfoWithoutPhone} />)
    const phoneRow = getByText('phone')

    await fireEvent.press(phoneRow)
    expect(Linking.openURL).not.toHaveBeenCalled()
  })

  it('does not call Linking.openURL if email is not provided', async () => {
    const airportInfoWithoutEmail: any = {
      ...mockedAirportInfo,
      contactInfo: { email: undefined, phone: '+905551112233' },
    }
    const { getByText } = await render(<Contact airportInfo={airportInfoWithoutEmail} />)
    const emailRow = getByText('email')

    await fireEvent.press(emailRow)
    expect(Linking.openURL).not.toHaveBeenCalled()
  })

  it('does not navigate if website is not provided', async () => {
    const airportInfoWithoutWebsite: any = {
      ...mockedAirportInfo,
      website: undefined,
    }
    const { getByText } = await render(<Contact airportInfo={airportInfoWithoutWebsite} />)
    const websiteRow = getByText('website')

    await fireEvent.press(websiteRow)
    expect(router.navigate).not.toHaveBeenCalled()
  })

  it('renders labels without crashing when airportInfo is null or undefined', async () => {
    const { queryByText } = await render(<Contact airportInfo={null as any} />)

    expect(queryByText('website')).not.toBeNull()
    expect(queryByText('phone')).not.toBeNull()
    expect(queryByText('email')).not.toBeNull()
  })

  it('renders without crashing when contactInfo is null or undefined', async () => {
    const airportInfoWithoutContact: any = {
      ...mockedAirportInfo,
      contactInfo: undefined,
    }
    const { getByText, queryByText } = await render(
      <Contact airportInfo={airportInfoWithoutContact} />,
    )

    expect(getByText('website')).toBeTruthy()
    expect(queryByText('phone')).not.toBeNull()
    expect(queryByText('email')).not.toBeNull()
  })
})

describe('Contact Component Snapshot', () => {
  it('should render the Contact Component successfully', async () => {
    const { toJSON } = await render(<Contact airportInfo={mockedAirportInfo} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
