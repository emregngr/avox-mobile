import { Dimensions } from 'react-native'

describe('responsive', () => {
  it('should export the correct device height and width from Dimensions', () => {
    const mockedScreenDimensions = { width: 375, height: 812, scale: 2, fontScale: 1 }
    const mockedGetSpy = jest.spyOn(Dimensions, 'get').mockReturnValue(mockedScreenDimensions)

    const { responsive } = require('@/utils/common/responsive')

    expect(responsive.deviceWidth).toBe(mockedScreenDimensions.width)
    expect(responsive.deviceHeight).toBe(mockedScreenDimensions.height)

    expect(mockedGetSpy).toHaveBeenCalledWith('screen')
    expect(mockedGetSpy).toHaveBeenCalledTimes(1)
  })
})
