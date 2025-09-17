import { Dimensions } from 'react-native'

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
  },
}))

const mockedDimensionsGet = Dimensions.get as jest.Mock

describe('responsive', () => {
  it('should export the correct device height and width from Dimensions', () => {
    const mockScreenDimensions = { width: 375, height: 812 }
    mockedDimensionsGet.mockReturnValue(mockScreenDimensions)

    const { responsive } = require('@/utils/common/responsive')

    expect(responsive.deviceWidth).toBe(mockScreenDimensions.width)
    expect(responsive.deviceHeight).toBe(mockScreenDimensions.height)

    expect(mockedDimensionsGet).toHaveBeenCalledWith('screen')
    expect(mockedDimensionsGet).toHaveBeenCalledTimes(1)
  })
})
