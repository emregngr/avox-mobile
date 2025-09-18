const IS_PRODUCTION = process.env.EXPO_PUBLIC_ENV === 'production'

const getEnvironmentConfig = () => {
  if (IS_PRODUCTION) {
    return {
      name: 'Avox',
      slug: 'avox',
      bundleIdentifier: 'com.avox',
      package: 'com.avox',
      scheme: ['avox'],
      environment: 'production',
      googleServicesFile: {
        ios: './firebase/production/GoogleService-Info.plist',
        android: './firebase/production/google-services.json',
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL_PRODUCTION,
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN_PRODUCTION,
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID_PRODUCTION,
    }
  }

  return {
    name: 'Avox Staging',
    slug: 'avox-staging',
    bundleIdentifier: 'com.avox.staging',
    package: 'com.avox.staging',
    scheme: ['avox-staging'],
    environment: 'staging',
    googleServicesFile: {
      ios: './firebase/staging/GoogleService-Info-Staging.plist',
      android: './firebase/staging/google-services-staging.json',
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL_STAGING,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN_STAGING,
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID_STAGING,
  }
}

const envConfig = getEnvironmentConfig()

const basePlugins = [
  '@react-native-firebase/app',
  '@react-native-firebase/auth',
  '@react-native-firebase/crashlytics',
  '@react-native-google-signin/google-signin',
  'expo-router',
  'expo-localization',
  [
    'expo-build-properties',
    {
      ios: {
        useFrameworks: 'static',
      },
      android: {
        extraProguardRules: '-keep class com.google.android.gms.internal.consent_sdk.** { *; }',
      },
    },
  ],
  [
    'expo-image-picker',
    {
      photosPermission: '',
      cameraPermission: '',
      microphonePermission: '',
      recordAudioAndroid: true,
    },
  ],
  [
    'expo-tracking-transparency',
    {
      userTrackingPermission: '',
    },
  ],
  [
    'expo-maps',
    {
      requestLocationPermission: 'true',
      locationPermission: '',
    },
  ],
  [
    'expo-font',
    {
      fonts: [
        './src/assets/fonts/Inter-Bold.ttf',
        './src/assets/fonts/Inter-Medium.ttf',
        './src/assets/fonts/Inter-Regular.ttf',
        './src/assets/fonts/Inter-SemiBold.ttf',
      ],
    },
  ],
  [
    'react-native-edge-to-edge',
    {
      android: {
        parentTheme: 'Default',
        enforceNavigationBarContrast: false,
        enforceStatusBarContrast: false,
      },
    },
  ],
  [
    '@sentry/react-native/expo',
    {
      organization: 'avox',
      project: envConfig.slug,
      url: 'https://sentry.io/',
    },
  ],
]

const plugins = IS_PRODUCTION
  ? [
      ...basePlugins,
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: 'ca-app-pub-4123130377375974~3826490908',
          iosAppId: 'ca-app-pub-4123130377375974~4146055101',
          skAdNetworkItems: [
            'cstr6suwn9.skadnetwork',
            '4fzdc2evr5.skadnetwork',
            '2fnua5tdw4.skadnetwork',
            'ydx93a7ass.skadnetwork',
            'p78axxw29g.skadnetwork',
            'v72qych5uu.skadnetwork',
            'ludvb6z3bs.skadnetwork',
            'cp8zw746q7.skadnetwork',
            '3sh42y64q3.skadnetwork',
            'c6k4g5qg8m.skadnetwork',
            's39g8k73mm.skadnetwork',
            '3qy4746246.skadnetwork',
            'f38h382jlk.skadnetwork',
            'hs6bdukanm.skadnetwork',
            'mlmmfzh3r3.skadnetwork',
            'v4nxqhlyqp.skadnetwork',
            'wzmmz9fp6w.skadnetwork',
            'su67r6k2v3.skadnetwork',
            'yclnxrl5pm.skadnetwork',
            't38b2kh725.skadnetwork',
            '7ug5zh24hu.skadnetwork',
            'gta9lk7p23.skadnetwork',
            'vutu7akeur.skadnetwork',
            'y5ghdn5j9k.skadnetwork',
            'v9wttpbfk9.skadnetwork',
            'n38lu8286q.skadnetwork',
            '47vhws6wlr.skadnetwork',
            'kbd757ywx3.skadnetwork',
            '9t245vhmpl.skadnetwork',
            'a2p9lx4jpn.skadnetwork',
            '22mmun2rn5.skadnetwork',
            '44jx6755aq.skadnetwork',
            'k674qkevps.skadnetwork',
            '4468km3ulz.skadnetwork',
            '2u9pt9hc89.skadnetwork',
            '8s468mfl3y.skadnetwork',
            'klf5c3l5u5.skadnetwork',
            'ppxm28t8ap.skadnetwork',
            'kbmxgpxpgc.skadnetwork',
            'uw77j35x4d.skadnetwork',
            '578prtvx9j.skadnetwork',
            '4dzt52r2t5.skadnetwork',
            'tl55sbb4fm.skadnetwork',
            'c3frkrj4fj.skadnetwork',
            'e5fvkxwrpn.skadnetwork',
            '8c4e2ghe7u.skadnetwork',
            '3rd42ekr43.skadnetwork',
            '97r2b46745.skadnetwork',
            '3qcr597p9d.skadnetwork',
          ],
        },
      ],
    ]
  : basePlugins

export default {
  expo: {
    name: envConfig.name,
    slug: envConfig.slug,
    version: '1.0.0',
    orientation: 'portrait',
    scheme: envConfig.scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    jsEngine: 'hermes',
    platforms: ['ios', 'android'],
    packagerOpts: {
      sourceExts: ['ts', 'tsx', 'js', 'jsx', 'json'],
    },
    updates: {
      enabled: true,
      fallbackToCacheTimeout: 0,
      checkAutomatically: 'ALWAYS',
      url: 'https://u.expo.dev/900feba3-8f4f-4a92-951f-a2ddb262e077',
    },
    runtimeVersion: '1.0.8',
    ios: {
      googleServicesFile: envConfig.googleServicesFile.ios,
      supportsTablet: true,
      bundleIdentifier: envConfig.bundleIdentifier,
      config: {
        usesNonExemptEncryption: false,
      },
      entitlements: {
        'aps-environment': 'production',
        'com.apple.developer.applesignin': 'Default',
        'com.apple.developer.associated-domains': 'applinks:avox',
      },
      infoPlist: {
        CFBundleAllowMixedLocalizations: true,
        GIDClientID: '396294037399-k8k5qpf3rgid0a1ujc5jjg9jbpve70vk.apps.googleusercontent.com',
      },
      icon: './src/assets/images/icon-ios.png',
      splash: {
        image: './src/assets/images/splash-ios.png',
        resizeMode: 'contain',
        backgroundColor: '#A2CAE5',
        imageWidth: 200,
      },
      associatedDomains: ['applinks:avox'],
    },
    android: {
      googleServicesFile: envConfig.googleServicesFile.android,
      package: envConfig.package,
      adaptiveIcon: {
        foregroundImage: './src/assets/images/icon-android.png',
        backgroundColor: '#A2CAE5',
      },
      splash: {
        image: './src/assets/images/splash-android.png',
        resizeMode: 'contain',
        backgroundColor: '#A2CAE5',
        imageWidth: 200,
      },
      edgeToEdgeEnabled: false,
      permissions: [
        'com.google.android.gms.permission.AD_ID',
        'android.permission.RECORD_AUDIO',
        'android.permission.READ_MEDIA_IMAGES',
        'android.permission.READ_MEDIA_VIDEO',
        'android.permission.READ_MEDIA_AUDIO',
        'android.permission.POST_NOTIFICATIONS',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.VIBRATE',
      ],
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              host: 'avox',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    locales: {
      en: './src/localization/en.json',
      tr: './src/localization/tr.json',
    },
    plugins: plugins,
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '900feba3-8f4f-4a92-951f-a2ddb262e077',
      },
      environment: envConfig.environment,
      apiUrl: envConfig.apiUrl,
      sentryDsn: envConfig.sentryDsn,
      googleWebClientId: envConfig.googleWebClientId,
    },
  },
}
