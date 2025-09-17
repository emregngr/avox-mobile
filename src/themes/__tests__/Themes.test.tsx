import { themeColors, themes } from '@/themes'

jest.mock('nativewind', () => ({
  vars: (obj: any) => obj,
}))

describe('Theme Definitions', () => {
  it('should match the snapshot for base colors', () => {
    expect(themeColors).toMatchSnapshot()
  })

  it('should match the snapshot for nativewind theme variables', () => {
    expect(themes).toMatchSnapshot()
  })
})
