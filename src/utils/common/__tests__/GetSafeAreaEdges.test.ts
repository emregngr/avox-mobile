import { getSafeAreaEdges } from '@/utils/common/getSafeAreaEdges'

describe('getSafeAreaEdges', () => {
  it('should return an array with "left" and "right" edges', () => {
    const expectedEdges = ['left', 'right']
    const result = getSafeAreaEdges()

    expect(result).toEqual(expectedEdges)

    expect(result.length).toBe(2)
  })
})
