import { swipeScreen, tapElement, waitForElement } from './setup'

beforeEach(async () => {
  await device.launchApp({
    newInstance: true,
    delete: true,
    permissions: {
      notifications: 'YES',
      camera: 'YES',
      photos: 'YES',
      medialibrary: 'YES',
      location: 'always',
      userTracking: 'YES',
    },
    languageAndLocale: {
      language: 'en',
      locale: 'en_US',
    },
  })

  await tapElement('onboarding-skip-button')
})

describe('BreakingNews Flow', () => {
  it('should display the breakingNews screen', async () => {
    await tapElement('breaking-news-card-1')

    await waitForElement('breaking-news-detail-screen')

    await swipeScreen('breaking-news-detail-screen', 'up', 'slow', 0.8)
  })
})
