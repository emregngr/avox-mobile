import { waitForElement } from './setup'

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
      locale: 'en_Us',
    },
  })
})

describe('ForceUpdate Flow', () => {
  it('should display forceUpdate screen elements correctly', async () => {
    await device.openURL({ url: 'avox://force-update' })

    await waitForElement('forceUpdate-screen')

    await waitForElement('forceUpdate-icon')

    await waitForElement('app-title')

    await waitForElement('forceUpdate-text')

    await waitForElement('forceUpdate-button')
  })
})
