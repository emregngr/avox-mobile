const mockedInit = jest.fn().mockResolvedValue(undefined)
const mockedUse = jest.fn().mockReturnValue({ init: mockedInit })

export default {
  language: 'en',
  use: mockedUse,
  init: mockedInit,
}
