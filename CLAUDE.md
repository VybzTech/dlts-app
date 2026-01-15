# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DLTS-APP (Delivery Letter Tracking System) is a React Native mobile application for courier delivery tracking. It uses Expo SDK 54 with file-based routing, TypeScript, Zustand for state management, and targets both iOS and Android from a single codebase.

**Target Users:** Courier riders/delivery personnel

## Development Commands

```bash
npm start               # Start Expo development server
npm run android         # Run on Android emulator/device
npm run ios             # Run on iOS simulator/device
npm run web             # Run web version
npm run lint            # Run ESLint
```

## Architecture

### Directory Structure

```
app/                    # Expo Router file-based routing
├── (auth)/            # Auth screens (login)
├── (tabs)/            # Main tab navigation
│   ├── index.tsx      # Dashboard - delivery list
│   ├── history.tsx    # Completed deliveries
│   └── profile.tsx    # User profile & stats
└── delivery/
    └── [id]/          # Dynamic delivery routes
        ├── index.tsx  # Delivery detail
        ├── navigate.tsx # Navigation/map screen
        └── pod.tsx    # Proof of delivery capture

src/                   # Core application code
├── types/             # TypeScript interfaces
├── store/             # Zustand state stores
│   ├── authStore.ts   # Authentication state
│   └── deliveryStore.ts # Delivery management
├── services/          # API and business logic
│   └── api.ts         # Mock API with sample data
├── components/        # Reusable components
│   ├── common/        # StatusBadge, EmptyState, LoadingSpinner
│   └── delivery/      # DeliveryCard, etc.
└── theme/
    └── colors.ts      # Color palette and constants
```

### Key Patterns

- **File-Based Routing**: Navigation defined by file structure in `app/`. Dynamic routes use `[param]` syntax.
- **Auth Protection**: Root layout checks auth state and redirects accordingly
- **State Management**: Zustand stores with AsyncStorage persistence for auth
- **Mock API**: All API calls are mocked in `src/services/api.ts` - replace with real endpoints when backend is ready

### Implemented Features

1. **Authentication** - Login screen with mock validation
2. **Dashboard** - Delivery list with stats, filtering, pull-to-refresh
3. **Delivery Detail** - Full info display, status timeline, action buttons
4. **Navigation** - Map placeholder with Google Maps deep linking, distance calculation
5. **POD Capture** - Signature pad (react-native-signature-canvas), camera/gallery photo capture
6. **History** - Completed deliveries with filtering
7. **Profile** - User info, performance stats, logout

### Data Flow

1. User logs in → `authStore.login()` saves user & persists to AsyncStorage
2. Dashboard loads → `api.getDeliveries()` fetches mock data → `deliveryStore.setDeliveries()`
3. User taps delivery → Navigate to `/delivery/[id]`
4. Status updates → `api.updateDeliveryStatus()` → `deliveryStore.updateDeliveryStatus()`
5. POD submission → `api.submitPOD()` → `deliveryStore.addPODToDelivery()`

## Key Dependencies

- `zustand` - State management with persistence
- `expo-location` - GPS/location services
- `expo-camera` / `expo-image-picker` - Photo capture
- `react-native-signature-canvas` - Digital signature capture
- `date-fns` - Date formatting

## Status Colors

```typescript
// Priority: MINIMAL (gray), MEDIUM (blue), HIGH (orange), URGENT (red)
// Status: assigned (gray), picked_up (blue), en_route (orange),
//         arrived (purple), delivered (green), returned (red)
```

## Extending the App

### Adding Real API

Replace mock calls in `src/services/api.ts` with actual HTTP requests:

```typescript
// Example: Replace this mock...
getDeliveries: async () => {
  await delay(800);
  return [...mockDeliveries];
}

// ...with real API call
getDeliveries: async () => {
  const response = await axios.get('/courier/deliveries');
  return response.data;
}
```

### Phase 2 Features (Not Implemented)

- Push notifications (Firebase)
- Background location tracking
- Offline queue/sync
- Barcode scanning
- Route optimization
