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

describe('Maintenance Flow', () => {
  it('should display maintenance screen elements correctly', async () => {
    await device.openURL({ url: 'avox://maintenance' })

    await waitForElement('maintenance-screen')

    await waitForElement('maintenance-icon')

    await waitForElement('app-title')

    await waitForElement('maintenance-text')
  })
})
