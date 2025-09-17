import Constants from 'expo-constants'

interface Config {
  apiUrl: string
  environment: 'staging' | 'production'
  googleWebClientId: string,
  sentryDsn: string
}

const config: Config = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl ?? '',
  environment: Constants.expoConfig?.extra?.environment ?? 'staging',
  googleWebClientId: Constants.expoConfig?.extra?.googleWebClientId ?? '',
  sentryDsn: Constants.expoConfig?.extra?.sentryDsn ?? '',
}

export default config

export const isStaging = () => config.environment === 'staging'
export const isProduction = () => config.environment === 'production'
