import crashlytics from '@react-native-firebase/crashlytics'

export type LogCategory = 'info' | 'error' | 'warning' | 'debug'

export type LogData = Record<string, unknown> | Error | null

export const Logger = {
  breadcrumb: (message: string, category: LogCategory, data: LogData = null) => {
    const row = {
      category,
      data: data ?? {},
      message,
    }

    if (!__DEV__) {
      if (data instanceof Error) {
        crashlytics().recordError(data)
      } else {
        crashlytics().log(JSON.stringify(row))
      }
    }
    console.log(message, category, data)
  },

  log: (message: string, data: LogData = null) => {
    const row = {
      category: 'info' as LogCategory,
      data: data ?? {},
      message,
    }

    if (!__DEV__) {
      if (data instanceof Error) {
        crashlytics().recordError(data)
      } else {
        crashlytics().log(JSON.stringify(row))
      }
    }
    console.log(message, data)
  },
}
