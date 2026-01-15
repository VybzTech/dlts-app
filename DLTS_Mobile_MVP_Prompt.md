# DLTS Mobile App - React Native (Expo) MVP Build Prompt

## Project Context

Build a **React Native mobile app using Expo** for courier personnel to manage letter deliveries. The web admin dashboard already exists - this mobile app is specifically for **riders/couriers** in the field.

**Tech Stack:**
- Expo SDK 54+ with Expo Router (file-based routing)
- TypeScript
- Zustand for state management
- React Native Paper or NativeWind for UI
- expo-location for GPS
- expo-camera for photos
- react-native-signature-canvas for signatures
- Mock API calls (backend APIs being built separately)

---

## Letter Lifecycle (Understanding the Flow)

```
1. ORIGIN UNIT → Creates schedule with letter details (liability year, company, address, LGA)
2. ADMIN UNIT → Verifies schedule (count matches, all fields complete)
   - If valid before 10am: confirmed for same-day pickup
   - If valid after 10am: scheduled for next day
   - If invalid: returned to origin unit
3. SORTING → Backend sorts letters by route/area (admin can edit)
4. COURIER PICKUP → Courier collects sorted letters for delivery (Phone life cycle starts)
5. DELIVERY → Courier delivers and captures POD (signature + recipient info)
6. POD RETURN → Courier returns with POD slips
7. ADMIN VERIFICATION → Admin cross-checks POD with schedule
8. COMPLETION → Status updated to "Delivered" or "Returned"
9. ORIGIN NOTIFIED → Origin unit sees final status, picks up any returned letters
```

**The mobile app handles steps 4-6 (Courier's perspective).**

---

## MVP Features (Minimal Scope)

### 1. Authentication
- Simple login screen (username/password)
- Mock auth - store user in Zustand + AsyncStorage
- Auto-login if session exists

### 2. Dashboard (Home)
- List of assigned deliveries for the day
- Each card shows: Company Name, Address, LGA, Priority badge
- Pull-to-refresh
- Filter by status: All | Pending | In Progress | Completed

### 3. Delivery Detail
- Full delivery information display
- Action buttons: "Start Navigation" | "Mark Arrived" | "Unable to Deliver"
- Status timeline showing progress

### 4. Navigation/Maps
- Show delivery location on map
- "Open in Google Maps" button (deep link to Google Maps app)
- Display distance and estimated time
- Track courier location (foreground only for MVP)

### 5. POD Capture (Proof of Delivery)
- Recipient name input (required)
- Recipient phone input (optional)
- Digital signature pad
- Camera to take 1-3 photos of delivered item
- Notes field
- Submit POD button

### 6. Delivery History
- List of completed deliveries
- Filter: Delivered | Returned/Failed
- View POD details for each

### 7. Status Updates
- Update delivery status: "Picked Up" → "En Route" → "Arrived" → "Delivered/Returned"
- For failed deliveries: select reason (Wrong address, Refused, Closed, etc.)

---

## Screens Structure (Expo Router)

```
app/
├── _layout.tsx              # Root layout with auth check
├── (auth)/
│   ├── _layout.tsx
│   └── login.tsx            # Login screen
├── (tabs)/
│   ├── _layout.tsx          # Bottom tab navigator
│   ├── index.tsx            # Dashboard - delivery list
│   ├── history.tsx          # Completed deliveries
│   └── profile.tsx          # Courier profile & logout
├── delivery/
│   ├── [id].tsx             # Delivery detail screen
│   ├── [id]/navigate.tsx    # Navigation/map screen
│   └── [id]/pod.tsx         # POD capture screen
└── +not-found.tsx
```

---

## Data Types

```typescript
// types/delivery.ts
export type DeliveryStatus =
  | 'assigned'
  | 'picked_up'
  | 'en_route'
  | 'arrived'
  | 'delivered'
  | 'returned';

export type Priority = 'MINIMAL' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Delivery {
  id: string;
  scheduleId: string;
  companyName: string;
  destination: string;
  lga: string;
  contactPerson?: string;
  contactPhone?: string;
  letterCount: number;
  priority: Priority;
  status: DeliveryStatus;
  assignedAt: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export interface PODData {
  deliveryId: string;
  recipientName: string;
  recipientPhone?: string;
  signature: string; // base64
  photos: string[]; // base64 array
  notes?: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  staffId: string;
  unit: string;
}
```

---

## Mock Data & API Service

```typescript
// services/api.ts
// Mock API responses - replace with real endpoints when backend ready

export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    scheduleId: 'SCH-2024-001',
    companyName: 'Nestle Nigeria PLC',
    destination: '29, Abisogun Street, Ikeja',
    lga: 'IKEJA',
    contactPerson: 'Mr. Johnson',
    contactPhone: '08012345678',
    letterCount: 3,
    priority: 'HIGH',
    status: 'assigned',
    assignedAt: new Date().toISOString(),
    coordinates: { latitude: 6.6018, longitude: 3.3515 },
  },
  {
    id: '2',
    scheduleId: 'SCH-2024-002',
    companyName: 'Unilever Nigeria',
    destination: '21, Mercy Eneli Street, Surulere',
    lga: 'SURULERE',
    letterCount: 5,
    priority: 'MEDIUM',
    status: 'assigned',
    assignedAt: new Date().toISOString(),
    coordinates: { latitude: 6.4969, longitude: 3.3562 },
  },
  // Add more mock data...
];

// Simulated API calls
export const api = {
  login: async (username: string, password: string) => {
    await delay(1000);
    if (username && password) {
      return {
        user: { id: '1', username, fullName: 'Test Courier', staffId: 'CR001', unit: 'DISPATCH' }
      };
    }
    throw new Error('Invalid credentials');
  },

  getDeliveries: async () => {
    await delay(500);
    return mockDeliveries;
  },

  getDeliveryById: async (id: string) => {
    await delay(300);
    return mockDeliveries.find(d => d.id === id);
  },

  updateDeliveryStatus: async (id: string, status: DeliveryStatus) => {
    await delay(500);
    return { success: true, message: 'Status updated' };
  },

  submitPOD: async (pod: PODData) => {
    await delay(1000);
    console.log('POD Submitted:', pod);
    return { success: true, message: 'POD submitted successfully' };
  },
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

---

## State Management (Zustand)

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// store/deliveryStore.ts
interface DeliveryState {
  deliveries: Delivery[];
  selectedDelivery: Delivery | null;
  setDeliveries: (deliveries: Delivery[]) => void;
  selectDelivery: (delivery: Delivery | null) => void;
  updateStatus: (id: string, status: DeliveryStatus) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  deliveries: [],
  selectedDelivery: null,
  setDeliveries: (deliveries) => set({ deliveries }),
  selectDelivery: (delivery) => set({ selectedDelivery: delivery }),
  updateStatus: (id, status) => set((state) => ({
    deliveries: state.deliveries.map(d =>
      d.id === id ? { ...d, status } : d
    ),
  })),
}));
```

---

## Key Components to Build

### 1. DeliveryCard
```
- Company name (bold)
- Address (truncated)
- LGA badge
- Priority indicator (color coded)
- Letter count
- Status chip
- Chevron icon for navigation
```

### 2. StatusBadge
```
- Color coded by status
- assigned: gray
- picked_up: blue
- en_route: orange
- arrived: purple
- delivered: green
- returned: red
```

### 3. SignaturePad
```
- Full screen signature capture
- Clear button
- Done button
- Returns base64 PNG
```

### 4. PODForm
```
- Recipient name input
- Recipient phone input
- Signature capture trigger
- Photo capture (camera button)
- Photo preview thumbnails
- Notes textarea
- Submit button with loading state
```

---

## UI/UX Guidelines

### Colors
```typescript
const colors = {
  primary: '#0066CC',      // LIRS Blue
  success: '#34C759',      // Green
  warning: '#FF9500',      // Orange
  danger: '#FF3B30',       // Red
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
};
```

### Priority Colors
```typescript
const priorityColors = {
  MINIMAL: '#8E8E93',   // Gray
  MEDIUM: '#007AFF',    // Blue
  HIGH: '#FF9500',      // Orange
  URGENT: '#FF3B30',    // Red
};
```

### Typography
```
- Headers: System font, 600 weight
- Body: System font, 400 weight
- Use default React Native Paper or system fonts
```

---

## Features to SKIP for MVP (Phase 2)

- Firebase push notifications (mock with local state)
- Email sending (backend handles this)
- Background location tracking (foreground only)
- Offline queue/sync (assume connectivity)
- Barcode scanning
- Voice notes
- Route optimization
- In-app chat
- Analytics dashboard

---

## Implementation Order

1. **Project Setup**
   - Expo project with TypeScript
   - Install dependencies (expo-router, zustand, expo-location, expo-camera, react-native-signature-canvas)
   - Configure app.json

2. **Navigation Structure**
   - Setup Expo Router file structure
   - Auth flow (redirect to login if not authenticated)
   - Tab navigation

3. **Authentication**
   - Login screen UI
   - Mock auth service
   - Zustand auth store with persistence

4. **Dashboard**
   - Delivery list with FlatList
   - DeliveryCard component
   - Pull-to-refresh
   - Status filter tabs

5. **Delivery Detail**
   - Full info display
   - Action buttons
   - Status timeline

6. **Navigation Screen**
   - Map view with delivery marker
   - Current location
   - "Open in Google Maps" button
   - Distance display

7. **POD Capture**
   - Form with inputs
   - Signature pad integration
   - Camera integration
   - Photo preview
   - Submit with loading

8. **History Screen**
   - Completed deliveries list
   - Filter by outcome
   - View POD details

9. **Profile Screen**
   - User info display
   - Logout button

---

## Dependencies to Install

```bash
npx expo install expo-location expo-camera expo-image-picker @react-native-async-storage/async-storage react-native-maps

npm install zustand react-native-signature-canvas react-native-paper react-native-safe-area-context date-fns
```

---

## Sample API Endpoints Reference (from backend spec)

```
POST /login                    - Authenticate courier
GET  /courier/deliveries       - Get assigned deliveries
GET  /courier/deliveries/:id   - Get single delivery
PATCH /courier/deliveries/:id  - Update delivery status
POST /courier/pod              - Submit proof of delivery
POST /courier/location         - Send GPS coordinates
```

---

## Success Criteria

The MVP is complete when a courier can:
1. Login with credentials
2. See list of assigned deliveries
3. View delivery details
4. Navigate to delivery address (via Google Maps)
5. Capture recipient signature
6. Take photos of delivery
7. Submit POD with all required info
8. View delivery history
9. Logout

---

## Notes for AI Agent

- Keep the code simple and readable
- Use functional components with hooks
- Prefer inline styles or StyleSheet for simplicity
- Mock all API calls - don't worry about real backend
- Focus on UI/UX and user flow
- Handle loading and error states gracefully
- Use TypeScript but don't over-engineer types
- Test on both iOS and Android simulators
- Don't implement features marked as "Phase 2"
