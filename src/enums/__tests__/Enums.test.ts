import { ENUMS } from '@/enums'

describe('ENUMS Constants', () => {
  it('should have the correct and consistent values', () => {
    expect(ENUMS).toMatchSnapshot()
  })
})
