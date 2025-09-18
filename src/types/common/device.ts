export type DeviceParamsType = {
  base_os: 'ios' | 'android' | 'windows' | 'macos' | 'web'
  brand: string
  build_id: string
  carrier: string
  device_token: string | null
  host: string
  ip: string
  model: string
  system_version: string
  timezone: string | null
  unique_id: string
  user_agent: string
}
