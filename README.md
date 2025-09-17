# 📱 Avox

All the details of aviation at your fingertips!

Avox Aviation introduces airlines and airports around the world and provides up-to-the-minute updates. A must-have for everyone — from travelers to aviation enthusiasts, industry professionals to frequent flyers!

- Detailed introduction to airlines
- Comprehensive information about airports
- Real-time aviation updates
- User-friendly, fast, and up-to-date

Everything related to the sky and aviation is on Avox Aviation! Plan your journey and stay informed about the aviation world.

---

## 🚀 Download

- **iOS**: [Download on the App Store](https://apps.apple.com/ca/app/avox/6747673276)
- **Android**: [Get it on Google Play](https://play.google.com/store/apps/details?id=com.avox)

---

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Development](#-development)
- [Testing](#-testing)
- [Technologies](#-technologies)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

- 🚀 Modern and user-friendly interface
- 📱 iOS and Android support
- ✈️ Comprehensive airline information
- 🏢 Detailed airport data
- 🔄 Real-time aviation updates
- 🌙 Dark/Light theme support
- 🔐 Secure authentication
- 📊 Detailed analytics and reporting
- 🌐 Multi-language support

---

## 📸 Screenshots

https://github.com/user-attachments/assets/ff886a50-a7dc-41a7-81dc-fd5e57c25292

---

## 🛠 Development

### 📁 Project Structure

```
├── src/
│   ├── api/           # API endpoints and configurations
│   ├── app/           # App screens (Expo Router)
│   ├── assets/        # Images, fonts, icons
│   ├── components/    # Reusable UI components
│   ├── config/        # App configuration files
│   ├── constants/     # Static values and constants
│   ├── enums/         # TypeScript enums
│   ├── hooks/         # Custom React hooks
│   ├── locales/       # Internationalization files
│   ├── services/      # Business logic and API services
│   ├── store/         # Zustand store configuration
│   ├── themes/        # Theme configurations
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Helper utilities
│   └── global.css     # Global styles
├── __mocks__/         # Third-party library mocks for Jest
├── e2e/               # End-to-end testing (Detox & Maestro)
├── jest/              # Jest setup files (matchers, globals, utils)
├── app.json           # Expo configuration
└── package.json       # Project dependencies
```

### 📜 Available Scripts

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run start
```

Start development server (staging):

```bash
npm run start:staging
```

Start development server (production):

```bash
npm run start:production
```

Run on iOS simulator:

```bash
npm run ios:staging
npm run ios:production
```

Run on Android emulator:

```bash
npm run android:staging
npm run android:production
```

Build for staging:

```bash
npm run build:staging
npm run build:staging:android
npm run build:staging:ios
```

Build for production:

```bash
npm run build:production
npm run build:production:android
npm run build:production:ios
```

Submit apps to stores:

```bash
npm run submit:staging:android
npm run submit:staging:ios
npm run submit:production:android
npm run submit:production:ios
```

OTA Updates:

```bash
npm run update:staging
npm run update:production
```

Lint and format:

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:lint
```

---

## 🧪 Testing

The project supports both **unit/integration testing** and **end-to-end testing**.

### 1. Unit & Integration Tests (Jest)

- All unit and integration tests are written with **Jest**.
- The `jest/` folder includes utilities like:
  - `custom-matchers.ts` → Project-specific matchers
  - `globals.ts` → Global Jest setup
  - `utils.ts` → Helper functions
- The `__mocks__/` folder contains custom mocks for **third-party libraries**.
- Current test coverage: **~85%**
- Uses **React Native Testing Library** and **React Test Renderer** for component rendering and snapshot testing.

Run tests:

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Update snapshots
npm run test:update-snapshots
```

### 2. End-to-End Tests

The project includes two different E2E setups:

#### Detox

- Located under `e2e/detox/`
- Runs on real iOS/Android devices or emulators

Build and run:

```bash
# iOS
npm run e2e:build:ios
npm run e2e:test:ios

# Android
npm run e2e:build:android
npm run e2e:test:android
```

#### Maestro

- Located under `e2e/maestro/`
- Focused on **user flows** and **scenario-based testing**

Run tests:

```bash
npm run e2e:maestro
```

---

## 🔧 Technologies

- **Framework**: React Native + Expo Router
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Navigation**: Expo Router

### UI Components

- @gorhom/bottom-sheet
- react-native-reanimated
- react-native-gesture-handler

### Backend & Services

- Firebase (Auth, Firestore, Analytics, Messaging, Crashlytics)
- Google Sign-In
- Apple Authentication

### Others

- **Maps**: Expo Maps
- **Image Handling**: Expo Image + Image Picker
- **i18n**: i18next + react-i18next
- **Notifications**: React Native Notifications
- **Error Tracking**: Sentry
- **Testing**: Jest + React Native Testing Library + React Test Renderer + Detox + Maestro
- **Code Quality**: ESLint + Prettier + TypeScript

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Contact

**Developer**: Emre Güngör<br>
📎 [LinkedIn](https://www.linkedin.com/in/emregungor-rn/)

---

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- All contributors

---

⭐ Don’t forget to star the repo if you like the app!<br>
❤️ Made with love
