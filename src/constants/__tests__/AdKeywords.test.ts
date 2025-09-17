import { AD_KEYWORDS } from '@/constants/adKeywords'

describe('AD_KEYWORDS', () => {
  it('should match the expected list of keywords', () => {
    expect(AD_KEYWORDS).toMatchSnapshot()
  })

  it('should not contain any duplicate keywords', () => {
    const uniqueKeywords = new Set(AD_KEYWORDS)
    expect(uniqueKeywords.size).toBe(AD_KEYWORDS.length)
  })
})
