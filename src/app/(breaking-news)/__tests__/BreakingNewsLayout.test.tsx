import { render } from '@testing-library/react-native'

import BreakingNewsLayout from '@/app/(breaking-news)/_layout'

describe('BreakingNewsLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<BreakingNewsLayout />)
  })
})

describe('BreakingNewsLayout Snapshot', () => {
  it('should render the BreakingNewsLayout successfully', async () => {
    const { toJSON } = await render(<BreakingNewsLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})
