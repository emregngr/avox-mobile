import { render } from '@testing-library/react-native'

import WebViewModalLayout from '@/app/(web-view-modal)/_layout'

describe('WebViewModalLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<WebViewModalLayout />)
  })
})

describe('WebViewModalLayout Snapshot', () => {
  it('should render the WebViewModalLayout successfully', async () => {
    const { toJSON } = await render(<WebViewModalLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})
