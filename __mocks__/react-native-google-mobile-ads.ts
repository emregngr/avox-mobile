export const mockedInterstitialAdInstance = {
  load: jest.fn(),
  show: jest.fn(),
  addAdEventListener: jest.fn(() => jest.fn()),
}

export const mockedRewardedAdInstance = {
  load: jest.fn(),
  show: jest.fn(),
  addAdEventListener: jest.fn(() => jest.fn()),
}

export const mockedAppOpenAdInstance = {
  load: jest.fn(),
  show: jest.fn(),
  addAdEventListener: jest.fn(() => jest.fn()),
}

export const InterstitialAd = {
  createForAdRequest: jest.fn(() => mockedInterstitialAdInstance),
}

export const RewardedAd = {
  createForAdRequest: jest.fn(() => mockedRewardedAdInstance),
}

export const AppOpenAd = {
  createForAdRequest: jest.fn(() => mockedAppOpenAdInstance),
}

export const BannerAd = jest.fn(() => null)

export const BannerAdSize = {
  BANNER: 'BANNER',
  FULL_BANNER: 'FULL_BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
}

export const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
}

export const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
  CLICKED: 'clicked',
}

export const mockedMobileAdsInstance = {
  initialize: jest.fn(),
}

const mobileAds = jest.fn(() => mockedMobileAdsInstance)

export default mobileAds
