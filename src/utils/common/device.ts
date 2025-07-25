import messaging from '@react-native-firebase/messaging'
import { getCalendars } from 'expo-localization'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import type { DeviceParams } from '@/types/common/device'
import { Logger } from '@/utils/common/logger'

const Device = {
  getBrand(): string {
    try {
      return DeviceInfo.getBrand() || 'unknown'
    } catch (error: any) {
      Logger.log('getBrand', error)
      return 'unknown'
    }
  },
  async getBuildId(): Promise<string> {
    try {
      return await DeviceInfo.getBuildId()
    } catch (error: any) {
      Logger.log('getBuildId', error)
      return 'unknown'
    }
  },
  async getBuildNumber(): Promise<string> {
    try {
      return await DeviceInfo.getBuildNumber()
    } catch (error: any) {
      Logger.log('getBuildNumber', error)
      return 'unknown'
    }
  },
  async getCarrier(): Promise<string> {
    try {
      return await DeviceInfo.getCarrier()
    } catch (error: any) {
      Logger.log('getCarrier', error)
      return 'unknown'
    }
  },
  async getFcmToken(): Promise<string | null> {
    try {
      const authStatus = await messaging().hasPermission()
      if (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        return await messaging().getToken()
      }
      return null
    } catch (error: any) {
      Logger.log('getFcmToken', error)
      return null
    }
  },
  async getHost(): Promise<string> {
    try {
      return await DeviceInfo.getHost()
    } catch (error: any) {
      Logger.log('getHost', error)
      return 'unknown'
    }
  },
  async getIpAddress(): Promise<string> {
    try {
      return await DeviceInfo.getIpAddress()
    } catch (error: any) {
      Logger.log('getIpAddress', error)
      return 'unknown'
    }
  },
  getModel(): string {
    try {
      return DeviceInfo.getModel() || 'unknown'
    } catch (error: any) {
      Logger.log('getModel', error)
      return 'unknown'
    }
  },
  getSystemVersion(): string {
    try {
      return DeviceInfo.getSystemVersion() || 'unknown'
    } catch (error: any) {
      Logger.log('getSystemVersion', error)
      return 'unknown'
    }
  },
  async getUniqueId(): Promise<string> {
    try {
      return await DeviceInfo.getUniqueId()
    } catch (error: any) {
      Logger.log('getUniqueId', error)
      return 'unknown'
    }
  },
  async getUserAgent(): Promise<string> {
    try {
      return await DeviceInfo.getUserAgent()
    } catch (error: any) {
      Logger.log('getUserAgent', error)
      return 'unknown'
    }
  },
  getVersion(): string {
    try {
      return DeviceInfo.getVersion() || 'unknown'
    } catch (error: any) {
      Logger.log('getVersion', error)
      return 'unknown'
    }
  },
  async registerDevice(): Promise<DeviceParams> {
    try {
      const [unique_id, messagingToken, carrier, build_id, host, ip, user_agent] =
        await Promise.all([
          this.getUniqueId(),
          this.getFcmToken(),
          this.getCarrier(),
          this.getBuildId(),
          this.getHost(),
          this.getIpAddress(),
          this.getUserAgent(),
        ])
      const brand = this.getBrand()
      const model = this.getModel()
      const system_version = this.getSystemVersion()
      const calendars = getCalendars()
      const timezone = calendars[0]?.timeZone ?? null

      return {
        base_os: Platform.OS,
        brand,
        build_id,
        carrier,
        device_token: messagingToken || null,
        host,
        ip,
        model,
        system_version,
        timezone,
        unique_id,
        user_agent,
      }
    } catch (error: any) {
      Logger.log('registerDevice', error)
      return {
        base_os: Platform.OS,
        brand: 'unknown',
        build_id: 'unknown',
        carrier: 'unknown',
        device_token: null,
        host: 'unknown',
        ip: 'unknown',
        model: 'unknown',
        system_version: 'unknown',
        timezone: null,
        unique_id: 'unknown',
        user_agent: 'unknown',
      }
    }
  },
}

export default Device
