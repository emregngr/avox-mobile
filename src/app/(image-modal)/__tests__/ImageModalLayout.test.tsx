import { render } from '@testing-library/react-native'

import ImageModalLayout from '@/app/(image-modal)/_layout'

describe('ImageModalLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<ImageModalLayout />)
  })
})

describe('ImageModalLayout Snapshot', () => {
  it('should render the ImageModalLayout successfully', async () => {
    const { toJSON } = await render(<ImageModalLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})
