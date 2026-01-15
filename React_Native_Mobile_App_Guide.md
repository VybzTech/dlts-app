# LIRS DLTS Mobile App - React Native Build Guide
## Courier Delivery Tracking System with GPS, Digital Signatures & Notifications

---

## 🎯 OBJECTIVE
Build a production-ready React Native mobile application specifically for **Courier Personnel** to manage letter pickups, real-time GPS tracking, digital signature capture for Proof of Delivery (POD), and push notifications.

**Target Users:** Courier riders/delivery personnel  
**Platforms:** iOS + Android (single codebase)  
**Offline-First:** Works without constant internet connection
 
---

## 📱 CORE FEATURES

### ✅ Must-Have (MVP)
1. **Authentication** - Courier login with credentials
2. **Delivery Dashboard** - List of assigned letters/schedules
3. **Route Management** - Turn-by-turn navigation to delivery addresses
4. **GPS Tracking** - Real-time location sharing with admin
5. **Digital Signature Capture** - POD collection with signature pad
6. **Photo Capture** - Take photos of delivered items
7. **Offline Support** - Queue actions when network unavailable
8. **Push Notifications** - New assignment alerts
9. **Delivery Status Updates** - Mark as delivered/returned with reasons

### 🔄 Phase 2 (Post-MVP)
- Route optimization (multiple stops)
- In-app chat with admin
- Barcode/QR code scanning
- Voice notes for failed deliveries
- Delivery analytics dashboard

---

## 🛠️ TECH STACK & DEPENDENCIES

### Core Framework
```json
{
  "dependencies": {
    "react-native": "^0.73.0",
    "react": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

### Navigation
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/native-stack": "^6.9.17",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "react-native-screens": "^3.29.0",
  "react-native-safe-area-context": "^4.8.2"
}
```

### State Management & API
```json
{
  "zustand": "^4.4.7",
  "axios": "^1.6.2",
  "@tanstack/react-query": "^5.17.0",
  "react-native-mmkv": "^2.11.0"
}
```

### GPS & Maps
```json
{
  "react-native-maps": "^1.10.0",
  "@react-native-community/geolocation": "^3.2.1",
  "react-native-geolocation-service": "^5.3.1",
  "react-native-google-places-autocomplete": "^2.5.6"
}
```

### Digital Signature
```json
{
  "react-native-signature-canvas": "^4.7.2",
  "@shopify/react-native-skia": "^0.1.221"
}
```

### Camera & Media
```json
{
  "react-native-image-picker": "^7.1.0",
  "react-native-permissions": "^4.0.3",
  "react-native-camera": "^4.2.1"
}
```

### Notifications & Background Tasks
```json
{
  "@notifee/react-native": "^7.8.2",
  "react-native-background-geolocation": "^4.15.1",
  "react-native-push-notification": "^8.1.1",
  "@react-native-firebase/messaging": "^19.0.0",
  "@react-native-firebase/app": "^19.0.0"
}
```

### Email Integration
```json
{
  "react-native-smtp-mailer": "^1.0.1",
  "nodemailer": "^6.9.7"
}
```

### Offline Support
```json
{
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-netinfo": "^11.2.1",
  "redux-offline": "^2.6.0-native.0"
}
```

### UI Components
```json
{
  "react-native-paper": "^5.11.3",
  "react-native-vector-icons": "^10.0.3",
  "react-native-gesture-handler": "^2.14.1",
  "react-native-reanimated": "^3.6.1"
}
```

### Utilities
```json
{
  "date-fns": "^2.30.0",
  "react-native-device-info": "^10.12.0",
  "react-native-uuid": "^2.0.1"
}
```

---

## 🏗️ PROJECT STRUCTURE

```
src/
├── api/
│   ├── config/
│   │   ├── axios.config.ts         # Axios instance with interceptors
│   │   └── endpoints.ts            # API endpoint definitions
│   ├── services/
│   │   ├── auth.service.ts         # Login, logout
│   │   ├── delivery.service.ts     # Get assignments, update status
│   │   ├── location.service.ts     # Send GPS coordinates
│   │   ├── pod.service.ts          # Upload POD (signature + photo)
│   │   └── notification.service.ts # Email & push notifications
│   └── types/
│       ├── delivery.types.ts
│       └── api.types.ts
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── delivery/
│   │   ├── DeliveryCard.tsx        # Single delivery item
│   │   ├── DeliveryList.tsx        # Scrollable list
│   │   ├── DeliveryDetail.tsx      # Full details view
│   │   └── RoutePreview.tsx        # Map preview
│   │
│   ├── signature/
│   │   ├── SignaturePad.tsx        # Canvas for signature
│   │   └── SignaturePreview.tsx    # Display captured signature
│   │
│   ├── camera/
│   │   ├── CameraCapture.tsx       # Photo capture UI
│   │   └── PhotoGallery.tsx        # Display multiple photos
│   │
│   └── maps/
│       ├── DeliveryMap.tsx         # Full-screen map
│       ├── RouteMarkers.tsx        # Pin markers
│       └── CurrentLocation.tsx     # User location indicator
│
├── navigation/
│   ├── AppNavigator.tsx            # Main navigation stack
│   ├── AuthNavigator.tsx           # Login/signup flow
│   └── TabNavigator.tsx            # Bottom tabs
│
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── ProfileScreen.tsx
│   │
│   ├── delivery/
│   │   ├── DashboardScreen.tsx     # Home - assigned deliveries
│   │   ├── DeliveryDetailScreen.tsx # Single delivery details
│   │   ├── NavigationScreen.tsx    # Turn-by-turn navigation
│   │   └── PODScreen.tsx           # Signature + photo capture
│   │
│   └── history/
│       ├── CompletedScreen.tsx     # Delivered items
│       └── ReturnedScreen.tsx      # Failed/returned items
│
├── store/
│   ├── authStore.ts                # Zustand auth state
│   ├── deliveryStore.ts            # Delivery assignments
│   ├── locationStore.ts            # GPS tracking state
│   ├── offlineStore.ts             # Offline queue
│   └── notificationStore.ts        # Push notifications
│
├── services/
│   ├── location/
│   │   ├── LocationService.ts      # Background GPS tracking
│   │   ├── RouteService.ts         # Navigation logic
│   │   └── GeocodingService.ts     # Address ↔ coordinates
│   │
│   ├── signature/
│   │   └── SignatureService.ts     # Save & compress signatures
│   │
│   ├── camera/
│   │   └── ImageService.ts         # Compress & upload photos
│   │
│   ├── offline/
│   │   ├── QueueService.ts         # Store failed requests
│   │   └── SyncService.ts          # Retry when online
│   │
│   └── notification/
│       ├── PushService.ts          # Firebase Cloud Messaging
│       └── EmailService.ts         # SMTP email sending
│
├── utils/
│   ├── permissions.ts              # Check/request permissions
│   ├── storage.ts                  # MMKV storage helpers
│   ├── validators.ts               # Form validation
│   ├── formatters.ts               # Date, distance formatting
│   └── constants.ts                # App constants
│
├── hooks/
│   ├── useLocation.ts              # GPS tracking hook
│   ├── useDeliveries.ts            # Fetch delivery data
│   ├── useOfflineSync.ts           # Handle offline queue
│   └── usePermissions.ts           # Request permissions
│
├── types/
│   ├── navigation.types.ts
│   ├── delivery.types.ts
│   └── global.d.ts
│
└── App.tsx                         # Root component
```

---

## 🌐 API INTEGRATION (Extended for Mobile)

### New Mobile-Specific Endpoints

```typescript
// src/api/config/endpoints.ts
export const MOBILE_ENDPOINTS = {
  // Courier Authentication
  COURIER_LOGIN: '/courier/login',
  COURIER_PROFILE: '/courier/profile',
  
  // Delivery Management
  GET_ASSIGNED_DELIVERIES: '/courier/deliveries/assigned',
  GET_DELIVERY_DETAIL: (id: string) => `/courier/deliveries/${id}`,
  UPDATE_DELIVERY_STATUS: (id: string) => `/courier/deliveries/${id}/status`,
  
  // Location Tracking
  SEND_LOCATION: '/courier/location/update',
  START_TRACKING: '/courier/location/start',
  STOP_TRACKING: '/courier/location/stop',
  
  // POD (Proof of Delivery)
  UPLOAD_SIGNATURE: '/courier/pod/signature',
  UPLOAD_PHOTO: '/courier/pod/photo',
  SUBMIT_POD: '/courier/pod/submit',
  
  // Notifications
  REGISTER_FCM_TOKEN: '/courier/notifications/register',
  GET_NOTIFICATIONS: '/courier/notifications',
  
  // Email
  SEND_POD_EMAIL: '/courier/pod/email',
} as const;
```

### Extended API Types

```typescript
// src/api/types/delivery.types.ts
export interface CourierDelivery {
  id: string;
  scheduleId: string;
  letterId: string;
  
  // Delivery Info
  companyName: string;
  contactPerson?: string;
  phoneNumber?: string;
  destination: string;
  lga: string;
  
  // Location
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // In kilometers
  estimatedTime?: number; // In minutes
  
  // Status
  status: 'assigned' | 'enroute' | 'arrived' | 'delivered' | 'returned';
  priority: 'MINIMAL' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  // Metadata
  assignedAt: string;
  deadline?: string;
  notes?: string;
  
  // POD
  podSignature?: string; // Base64 or URL
  podPhotos?: string[]; // Array of URLs
  podTimestamp?: string;
  podNotes?: string;
}

export interface LocationUpdate {
  courierId: string;
  letterId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  speed?: number;
  heading?: number;
}

export interface PODSubmission {
  letterId: string;
  signature: string; // Base64
  photos: string[]; // Array of Base64 or file URIs
  recipientName: string;
  recipientPhone?: string;
  notes?: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface EmailNotification {
  to: string[]; // Recipient emails
  subject: string;
  body: string;
  attachments?: {
    filename: string;
    content: string; // Base64
    contentType: string;
  }[];
}
```

---

## 🗺️ GPS & MAPPING IMPLEMENTATION

### 1. Location Service (Background Tracking)

```typescript
// src/services/location/LocationService.ts
import Geolocation from 'react-native-geolocation-service';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { useLocationStore } from '@/store/locationStore';
import { locationService } from '@/api/services/location.service';

class LocationService {
  private watchId: number | null = null;
  private backgroundEnabled = false;

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }

  async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  startTracking(letterId: string) {
    // Configure background tracking
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 50, // Update every 50 meters
      stopTimeout: 5, // Stop tracking after 5 min of no movement
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      
      // iOS specific
      activityType: BackgroundGeolocation.ACTIVITY_TYPE_OTHER,
      
      // HTTP config - send location to server
      url: `${API_CONFIG.baseUrl}/courier/location/update`,
      httpRootProperty: 'location',
      locationTemplate: JSON.stringify({
        letterId,
        latitude: '<%= latitude %>',
        longitude: '<%= longitude %>',
        accuracy: '<%= accuracy %>',
        timestamp: '<%= timestamp %>',
      }),
    }).then((state) => {
      BackgroundGeolocation.start();
      this.backgroundEnabled = true;
    });

    // Listen to location updates
    BackgroundGeolocation.onLocation((location) => {
      useLocationStore.getState().updateLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp).toISOString(),
      });
    });
  }

  stopTracking() {
    if (this.backgroundEnabled) {
      BackgroundGeolocation.stop();
      this.backgroundEnabled = false;
    }
  }

  async calculateDistance(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): Promise<number> {
    // Haversine formula
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(to.latitude - from.latitude);
    const dLon = this.toRad(to.longitude - from.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(from.latitude)) *
        Math.cos(this.toRad(to.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export default new LocationService();
```

### 2. Map Component with Route

```typescript
// src/components/maps/DeliveryMap.tsx
import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useLocationStore } from '@/store/locationStore';

interface DeliveryMapProps {
  destination: {
    latitude: number;
    longitude: number;
    title: string;
  };
  showRoute?: boolean;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  destination, 
  showRoute = true 
}) => {
  const { currentLocation } = useLocationStore();
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  useEffect(() => {
    if (showRoute && currentLocation) {
      fetchRoute();
    }
  }, [currentLocation, destination]);

  const fetchRoute = async () => {
    // Google Directions API
    const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;
    const GOOGLE_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.routes.length) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRouteCoordinates(points);
      }
    } catch (error) {
      console.error('Route fetch error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude || destination.latitude,
          longitude: currentLocation?.longitude || destination.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation
      >
        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}

        {/* Destination Marker */}
        <Marker
          coordinate={destination}
          title={destination.title}
          pinColor="red"
        />

        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="#007AFF"
          />
        )}
      </MapView>
    </View>
  );
};

// Helper: Decode Google polyline
function decodePolyline(encoded: string) {
  const points = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({
      latitude: lat / 1E5,
      longitude: lng / 1E5,
    });
  }
  return points;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
});
```

### 3. Navigation Screen with Turn-by-Turn

```typescript
// src/screens/delivery/NavigationScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { DeliveryMap } from '@/components/maps/DeliveryMap';
import LocationService from '@/services/location/LocationService';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const NavigationScreen = ({ route, navigation }) => {
  const { delivery } = route.params;
  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<number | null>(null);

  useEffect(() => {
    // Start GPS tracking
    LocationService.startTracking(delivery.letterId);

    // Update distance/ETA every 10 seconds
    const interval = setInterval(async () => {
      const current = await LocationService.getCurrentPosition();
      const dist = await LocationService.calculateDistance(
        current,
        delivery.coordinates
      );
      setDistance(dist);
      setEta(Math.round((dist / 40) * 60)); // Assume 40 km/h avg speed
    }, 10000);

    return () => {
      clearInterval(interval);
      LocationService.stopTracking();
    };
  }, []);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${delivery.coordinates.latitude},${delivery.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const markArrived = () => {
    navigation.navigate('PODScreen', { delivery });
  };

  return (
    <View style={styles.container}>
      <DeliveryMap 
        destination={{
          latitude: delivery.coordinates.latitude,
          longitude: delivery.coordinates.longitude,
          title: delivery.companyName,
        }}
        showRoute
      />

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <View style={styles.infoRow}>
          <Icon name="location-on" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            {distance ? `${distance.toFixed(1)} km away` : 'Calculating...'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="schedule" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            {eta ? `ETA: ${eta} min` : 'Calculating...'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.googleMapsBtn]}
          onPress={openGoogleMaps}
        >
          <Icon name="map" size={20} color="#fff" />
          <Text style={styles.buttonText}>Open Google Maps</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.arrivedBtn]}
          onPress={markArrived}
        >
          <Icon name="check-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>I've Arrived</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoBanner: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  googleMapsBtn: {
    backgroundColor: '#4285F4',
  },
  arrivedBtn: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
```

---

## ✍️ DIGITAL SIGNATURE IMPLEMENTATION

### 1. Signature Pad Component

```typescript
// src/components/signature/SignaturePad.tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const signatureRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleSignature = (signature: string) => {
    onSave(signature); // Base64 PNG
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setIsEmpty(true);
  };

  const handleEnd = () => {
    setIsEmpty(false);
  };

  const handleSave = () => {
    signatureRef.current?.readSignature();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipient's Signature</Text>
      <Text style={styles.subtitle}>Please sign in the box below</Text>

      <View style={styles.signatureContainer}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleSignature}
          onEnd={handleEnd}
          descriptionText=""
          clearText="Clear"
          confirmText="Save"
          webStyle={webStyle}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.clearBtn]} 
          onPress={handleClear}
        >
          <Icon name="refresh" size={20} color="#FF3B30" />
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelBtn]} 
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.saveBtn, isEmpty && styles.disabled]} 
          onPress={handleSave}
          disabled={isEmpty}
        >
          <Icon name="check" size={20} color="#fff" />
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const webStyle = `
  .m-signature-pad {
    box-shadow: none;
    border: 2px dashed #ccc;
    border-radius: 8px;
  }
  .m-signature-pad--body {
    border: none;
  }
  .m-signature-pad--footer {
    display: none;
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  signatureContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  clearBtn: {
    backgroundColor: '#FFEBEE',
  },
  clearText: {
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 4,
  },
  cancelBtn: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: '#333',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#34C759',
  },
  saveText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});
```

### 2. Photo Capture Component

```typescript
// src/components/camera/CameraCapture.tsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CameraCaptureProps {
  onPhotoCaptured: (photo: string) => void;
  maxPhotos?: number;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onPhotoCaptured,
  maxPhotos = 3 
}) => {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleTakePhoto = () => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Limit Reached', `You can only take up to ${maxPhotos} photos`);
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to capture photo');
          return;
        }

        if (response.assets && response.assets[0]) {
          const photo = `data:image/jpeg;base64,${response.assets[0].base64}`;
          setPhotos([...photos, photo]);
          onPhotoCaptured(photo);
        }
      }
    );
  };

  const handleChooseFromGallery = () => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Limit Reached', `You can only select up to ${maxPhotos} photos`);
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: maxPhotos - photos.length,
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel || response.errorCode) {
          return;
        }

        if (response.assets) {
          const newPhotos = response.assets.map(
            (asset) => `data:image/jpeg;base64,${asset.base64}`
          );
          setPhotos([...photos, ...newPhotos]);
          newPhotos.forEach(onPhotoCaptured);
        }
      }
    );
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Photos</Text>
      <Text style={styles.subtitle}>
        Take photos of the delivered items ({photos.length}/{maxPhotos})
      </Text>

      {/* Photo Grid */}
      <View style={styles.photoGrid}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoItem}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <TouchableOpacity 
              style={styles.removeBtn}
              onPress={() => removePhoto(index)}
            >
              <Icon name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Capture Buttons */}
      {photos.length < maxPhotos && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.captureBtn}
            onPress={handleTakePhoto}
          >
            <Icon name="camera-alt" size={24} color="white" />
            <Text style={styles.btnText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.galleryBtn}
            onPress={handleChooseFromGallery}
          >
            <Icon name="photo-library" size={24} color="#007AFF" />
            <Text style={styles.galleryText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  photoItem: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: 12,
  },
  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
  },
  galleryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
```

### 3. Complete POD Screen

```typescript
// src/screens/delivery/PODScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { SignaturePad } from '@/components/signature/SignaturePad';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { useMutation } from '@tanstack/react-query';
import { podService } from '@/api/services/pod.service';
import LocationService from '@/services/location/LocationService';
import toast from 'react-native-toast-message';

export const PODScreen = ({ route, navigation }) => {
  const { delivery } = route.params;
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const submitPODMutation = useMutation(
    async () => {
      const location = await LocationService.getCurrentPosition();
      
      return podService.submitPOD({
        letterId: delivery.letterId,
        signature: signature!,
        photos,
        recipientName,
        recipientPhone,
        notes,
        timestamp: new Date().toISOString(),
        location,
      });
    },
    {
      onSuccess: () => {
        toast.show({
          type: 'success',
          text1: 'POD Submitted',
          text2: 'Delivery marked as complete',
        });
        navigation.navigate('Dashboard');
      },
      onError: (error: any) => {
        toast.show({
          type: 'error',
          text1: 'Submission Failed',
          text2: error.message,
        });
      },
    }
  );

  const handleSubmit = () => {
    if (!signature) {
      Alert.alert('Missing Signature', 'Please capture recipient signature');
      return;
    }

    if (!recipientName.trim()) {
      Alert.alert('Missing Name', 'Please enter recipient name');
      return;
    }

    if (photos.length === 0) {
      Alert.alert(
        'No Photos',
        'Are you sure you want to submit without photos?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => submitPODMutation.mutate() },
        ]
      );
      return;
    }

    submitPODMutation.mutate();
  };

  if (showSignaturePad) {
    return (
      <SignaturePad
        onSave={(sig) => {
          setSignature(sig);
          setShowSignaturePad(false);
        }}
        onCancel={() => setShowSignaturePad(false)}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Delivery Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Details</Text>
        <Text style={styles.infoText}>{delivery.companyName}</Text>
        <Text style={styles.infoSubtext}>{delivery.destination}</Text>
      </View>

      {/* Recipient Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipient Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Recipient Name *"
          value={recipientName}
          onChangeText={setRecipientName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number (optional)"
          value={recipientPhone}
          onChangeText={setRecipientPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Signature */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Digital Signature *</Text>
        {signature ? (
          <View>
            <Image source={{ uri: signature }} style={styles.signaturePreview} />
            <TouchableOpacity onPress={() => setShowSignaturePad(true)}>
              <Text style={styles.retakeText}>Retake Signature</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.signatureBtn}
            onPress={() => setShowSignaturePad(true)}
          >
            <Icon name="edit" size={24} color="#007AFF" />
            <Text style={styles.signatureBtnText}>Capture Signature</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Photos */}
      <View style={styles.section}>
        <CameraCapture
          onPhotoCaptured={(photo) => setPhotos([...photos, photo])}
          maxPhotos={3}
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add any delivery notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={submitPODMutation.isLoading}
      >
        <Text style={styles.submitText}>
          {submitPODMutation.isLoading ? 'Submitting...' : 'Complete Delivery'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  signatureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
  },
  signatureBtnText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signaturePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  retakeText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#34C759',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

---

## 📧 EMAIL NOTIFICATION IMPLEMENTATION

### Email Service

```typescript
// src/services/notification/EmailService.ts
import { emailService } from '@/api/services/notification.service';
import type { EmailNotification } from '@/api/types/delivery.types';

class EmailService {
  async sendPODEmail(
    delivery: any,
    signature: string,
    photos: string[]
  ): Promise<void> {
    const emailData: EmailNotification = {
      to: [delivery.originatingUnit.email, 'admin@lirs.net'],
      subject: `POD Received - ${delivery.companyName}`,
      body: this.generatePODEmailBody(delivery),
      attachments: [
        {
          filename: 'signature.png',
          content: signature.split(',')[1], // Remove data:image/png;base64,
          contentType: 'image/png',
        },
        ...photos.map((photo, index) => ({
          filename: `photo_${index + 1}.jpg`,
          content: photo.split(',')[1],
          contentType: 'image/jpeg',
        })),
      ],
    };

    await emailService.sendEmail(emailData);
  }

  private generatePODEmailBody(delivery: any): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>Proof of Delivery Received</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Delivery Details</h3>
            <p><strong>Company:</strong> ${delivery.companyName}</p>
            <p><strong>Address:</strong> ${delivery.destination}</p>
            <p><strong>LGA:</strong> ${delivery.lga}</p>
            <p><strong>Schedule ID:</strong> ${delivery.scheduleId}</p>
          </div>
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Recipient Information</h3>
            <p><strong>Name:</strong> ${delivery.podRecipient}</p>
            <p><strong>Signature:</strong> Attached</p>
            <p><strong>Photos:</strong> ${delivery.podPhotos?.length || 0} attached</p>
            <p><strong>Timestamp:</strong> ${new Date(delivery.podTimestamp).toLocaleString()}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated email from LIRS Document & Logistics Tracking System.
          </p>
        </body>
      </html>
    `;
  }

  async sendDeliveryFailureEmail(
    delivery: any,
    reason: string
  ): Promise<void> {
    const emailData: EmailNotification = {
      to: [delivery.originatingUnit.email, 'admin@lirs.net'],
      subject: `Delivery Failed - ${delivery.companyName}`,
      body: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2 style="color: #d32f2f;">Delivery Could Not Be Completed</h2>
            
            <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Company:</strong> ${delivery.companyName}</p>
              <p><strong>Address:</strong> ${delivery.destination}</p>
              <p><strong>Reason:</strong> ${reason}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>The item will be returned to your office for redelivery.</p>
          </body>
        </html>
      `,
    };

    await emailService.sendEmail(emailData);
  }
}

export default new EmailService();
```

---

## 🔔 PUSH NOTIFICATIONS IMPLEMENTATION

### 1. Firebase Cloud Messaging Setup

```typescript
// src/services/notification/PushService.ts
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { notificationService } from '@/api/services/notification.service';

class PushService {
  async initialize() {
    // Request permission (iOS)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      this.getFCMToken();
      this.setupForegroundListener();
      this.setupBackgroundListener();
    }
  }

  async getFCMToken() {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    
    // Register token with backend
    await notificationService.registerFCMToken(token);
    
    return token;
  }

  setupForegroundListener() {
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message:', remoteMessage);
      
      // Display local notification
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'delivery-channel',
          smallIcon: 'ic_notification',
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    });
  }

  setupBackgroundListener() {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message:', remoteMessage);
      
      // Handle background notification
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'delivery-channel',
        },
      });
    });
  }

  async createNotificationChannel() {
    await notifee.createChannel({
      id: 'delivery-channel',
      name: 'Delivery Notifications',
      importance: notifee.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  async sendLocalNotification(title: string, body: string) {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'delivery-channel',
        smallIcon: 'ic_notification',
        color: '#007AFF',
      },
      ios: {
        sound: 'default',
      },
    });
  }
}

export default new PushService();
```

### 2. Notification Hook

```typescript
// src/hooks/useNotifications.ts
import { useEffect } from 'react';
import PushService from '@/services/notification/PushService';
import { useDeliveryStore } from '@/store/deliveryStore';

export const useNotifications = () => {
  useEffect(() => {
    PushService.initialize();
    PushService.createNotificationChannel();

    // Listen for new delivery assignments
    const unsubscribe = useDeliveryStore.subscribe(
      (state) => state.newAssignment,
      (newAssignment) => {
        if (newAssignment) {
          PushService.sendLocalNotification(
            'New Delivery Assigned',
            `You have a new delivery to ${newAssignment.companyName}`
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);
};
```

---

## 📴 OFFLINE SUPPORT IMPLEMENTATION

### Offline Queue Service

```typescript
// src/services/offline/QueueService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface QueuedRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  headers?: any;
  timestamp: string;
  retries: number;
}

class QueueService {
  private queueKey = '@offline_queue';
  private maxRetries = 3;

  async addToQueue(request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retries'>) {
    const queue = await this.getQueue();
    
    const newRequest: QueuedRequest = {
      ...request,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      retries: 0,
    };

    queue.push(newRequest);
    await AsyncStorage.setItem(this.queueKey, JSON.stringify(queue));
  }

  async getQueue(): Promise<QueuedRequest[]> {
    const queueStr = await AsyncStorage.getItem(this.queueKey);
    return queueStr ? JSON.parse(queueStr) : [];
  }

  async processQueue() {
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected) {
      console.log('No internet connection, skipping queue processing');
      return;
    }

    const queue = await this.getQueue();
    const failedRequests: QueuedRequest[] = [];

    for (const request of queue) {
      try {
        await this.executeRequest(request);
        console.log(`Successfully processed request ${request.id}`);
      } catch (error) {
        console.error(`Failed to process request ${request.id}:`, error);
        
        if (request.retries < this.maxRetries) {
          failedRequests.push({
            ...request,
            retries: request.retries + 1,
          });
        }
      }
    }

    // Update queue with failed requests
    await AsyncStorage.setItem(this.queueKey, JSON.stringify(failedRequests));
  }

  private async executeRequest(request: QueuedRequest) {
    const axios = require('axios');
    
    return axios({
      url: request.url,
      method: request.method,
      data: request.data,
      headers: request.headers,
    });
  }

  async clearQueue() {
    await AsyncStorage.removeItem(this.queueKey);
  }
}

export default new QueueService();
```

### Sync Hook

```typescript
// src/hooks/useOfflineSync.ts
import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import QueueService from '@/services/offline/QueueService';

export const useOfflineSync = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('Back online, processing queue...');
        QueueService.processQueue();
      }
    });

    // Process queue on mount (in case app was closed)
    QueueService.processQueue();

    return () => unsubscribe();
  }, []);
};
```

---

## 📱 MAIN APP SCREENS

### 1. Dashboard Screen

```typescript
// src/screens/delivery/DashboardScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { deliveryService } from '@/api/services/delivery.service';
import { DeliveryCard } from '@/components/delivery/DeliveryCard';
import { EmptyState } from '@/components/common/EmptyState';

export const DashboardScreen = ({ navigation }) => {
  const { data: deliveries, isLoading, refetch } = useQuery({
    queryKey: ['deliveries'],
    queryFn: () => deliveryService.getAssignedDeliveries(),
  });

  const handleDeliveryPress = (delivery: any) => {
    navigation.navigate('DeliveryDetail', { delivery });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeliveryCard 
            delivery={item} 
            onPress={() => handleDeliveryPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <EmptyState 
            icon="inbox"
            title="No Deliveries"
            message="You have no assigned deliveries at the moment"
          />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
});
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Setup & Configuration (Days 1-2)
- [ ] Initialize React Native project (npx react-native init)
- [ ] Install all dependencies
- [ ] Configure navigation (stack + tabs)
- [ ] Setup folder structure
- [ ] Configure iOS & Android permissions
- [ ] Setup Firebase (push notifications)
- [ ] Configure Google Maps API keys

### Phase 2: Authentication (Day 3)
- [ ] Build login screen
- [ ] Integrate courier login API
- [ ] Setup Zustand auth store
- [ ] Implement session persistence (AsyncStorage)

### Phase 3: Delivery Dashboard (Days 4-5)
- [ ] Build dashboard screen with delivery list
- [ ] Integrate GET assigned deliveries API
- [ ] Build delivery card component
- [ ] Implement pull-to-refresh
- [ ] Add filtering (by status, priority)

### Phase 4: GPS & Navigation (Days 6-8)
- [ ] Request location permissions
- [ ] Implement background location tracking
- [ ] Build map component with markers
- [ ] Integrate Google Directions API for routes
- [ ] Build navigation screen with ETA
- [ ] Test location updates to backend

### Phase 5: Digital Signature (Days 9-10)
- [ ] Build signature pad component
- [ ] Implement signature capture
- [ ] Convert signature to Base64
- [ ] Build signature preview

### Phase 6: Camera & Photos (Day 11)
- [ ] Request camera permissions
- [ ] Build camera capture component
- [ ] Implement photo gallery
- [ ] Compress images before upload
- [ ] Handle multiple photo selection

### Phase 7: POD Submission (Days 12-13)
- [ ] Build POD screen with all fields
- [ ] Validate required fields
- [ ] Integrate POD submission API
- [ ] Handle offline POD queueing
- [ ] Show success/error feedback

### Phase 8: Push Notifications (Days 14-15)
- [ ] Setup Firebase Cloud Messaging
- [ ] Create notification channels
- [ ] Handle foreground notifications
- [ ] Handle background notifications
- [ ] Test notification delivery

### Phase 9: Email Integration (Day 16)
- [ ] Build email templates
- [ ] Integrate SMTP service
- [ ] Send POD confirmation emails
- [ ] Send failure notification emails
- [ ] Test email delivery

### Phase 10: Offline Support (Days 17-18)
- [ ] Implement offline queue
- [ ] Setup network listener
- [ ] Auto-sync when back online
- [ ] Show offline indicator
- [ ] Test offline → online flow

### Phase 11: Testing & Polish (Days 19-20)
- [ ] End-to-end testing (full delivery flow)
- [ ] Test on real devices (iOS + Android)
- [ ] Fix UI/UX issues
- [ ] Add loading states everywhere
- [ ] Optimize performance
- [ ] Handle edge cases

---

## 🎯 SUCCESS CRITERIA

### Functional
✅ Courier can login with credentials
✅ Dashboard shows assigned deliveries
✅ Turn-by-turn navigation to address works
✅ GPS tracking sends updates to backend
✅ Digital signature capture works smoothly
✅ Camera captures and compresses photos
✅ POD submission works (online + offline)
✅ Push notifications received for new assignments
✅ Email sent after POD submission
✅ Offline queue syncs when back online

### Non-Functional
✅ App works on iOS 14+ and Android 9+
✅ Battery-efficient background tracking
✅ <3 second screen load times
✅ Signature pad responsive to touch
✅ Photos under 500KB each
✅ App size under 50MB
✅ No memory leaks
✅ Smooth 60fps animations

---

## 🚀 BUILD & RUN COMMANDS

```bash
# Install dependencies
npm install
cd ios && pod install && cd ..

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android

# Build release APK (Android)
cd android && ./gradlew assembleRelease

# Build IPA (iOS - requires Xcode)
# Use Xcode Product > Archive
```

---

## 📝 ENVIRONMENT VARIABLES

```bash
# .env
API_BASE_URL=https://lirs-dlts/api/v1
GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_MESSAGING_SENDER_ID=123456789
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@lirs.net
SMTP_PASS=your-password
```

---

This comprehensive guide provides everything needed to build a production-ready React Native courier app with GPS tracking, digital signatures, and email notifications. Follow the checklist sequentially for best results.
