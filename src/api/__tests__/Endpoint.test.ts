import { AUTH_ENDPOINTS } from '@/api/endpoints'

describe('AUTH_ENDPOINTS Constants', () => {
  it('should match the expected endpoint values', () => {
    expect(AUTH_ENDPOINTS).toMatchSnapshot()
  })
})
