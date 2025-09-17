export const RESULTS = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  LIMITED: 'limited',
  GRANTED: 'granted',
  BLOCKED: 'blocked',
}

export const checkNotifications = jest.fn(() =>
  Promise.resolve({ status: RESULTS.GRANTED, settings: {} }),
)

export const requestNotifications = jest.fn(() =>
  Promise.resolve({ status: RESULTS.GRANTED, settings: {} }),
)

export const openSettings = jest.fn(() => Promise.resolve())
