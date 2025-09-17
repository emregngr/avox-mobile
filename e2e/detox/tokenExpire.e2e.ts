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

describe('TokenExpire Flow', () => {
  it('should display tokenExpire screen elements correctly', async () => {
    await device.openURL({ url: 'avox://token-expire' })

    await waitForElement('token-expire-icon')
  })
})
