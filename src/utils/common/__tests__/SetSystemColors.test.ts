import * as SystemUI from 'expo-system-ui'

import { Logger } from '@/utils/common/logger'
import { setSystemColors } from '@/utils/common/setSystemColors'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

const mockedSetBackgroundColorAsync = SystemUI.setBackgroundColorAsync as jest.MockedFunction<
  typeof SystemUI.setBackgroundColorAsync
>

describe('setSystemColors', () => {
  it('should call SystemUI.setBackgroundColorAsync with the correct color', async () => {
    const testColor = '#FFFFFF'

    mockedSetBackgroundColorAsync.mockResolvedValue(undefined)

    await setSystemColors(testColor)

    expect(mockedSetBackgroundColorAsync).toHaveBeenCalledTimes(1)

    expect(mockedSetBackgroundColorAsync).toHaveBeenCalledWith(testColor)

    expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
  })

  it('should call Logger.breadcrumb when an error occurs', async () => {
    const testColor = '#000000'
    const mockError = new Error('Failed to set color')

    mockedSetBackgroundColorAsync.mockRejectedValue(mockError)

    await setSystemColors(testColor)

    expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)

    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('setSystemColorsError', 'error', mockError)
  })
})
