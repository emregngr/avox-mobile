# 📱 Avox

All the details of aviation at your fingertips!

Avox Aviation introduces airlines and airports around the world and provides up-to-the-minute updates. A must-have for everyone — from travelers to aviation enthusiasts, industry professionals to frequent flyers!

Detailed introduction to airlines
Comprehensive information about airports
Real-time aviation updates
User-friendly, fast, and up-to-date

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
expo start
```

Run on iOS simulator:

```bash
expo run:ios
```

Run on Android emulator:

```bash
expo run:android
```

Run on web:

```bash
expo start --web
```

Build for development:

```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

Build for production:

```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

Submit to stores:

```bash
eas submit --profile production --platform android
eas submit --profile production --platform ios
```

Lint and format:

```bash
npm run lint
npm run lint:fix
npm run format
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
- **Testing**: Jest + React Test Renderer
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
