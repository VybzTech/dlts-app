import type { Delivery, User, PODData, DeliveryStatus, ApiResponse, LoginResponse } from '../types';

// Simulated delay for mock API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Users Database - 3 user profiles
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'beta.courier@lirs.net',
    password: 'password123',
    user: {
      id: '1',
      email: 'beta.courier@lirs.net',
      fullName: 'Beta Courier',
      staffId: 'CR001',
      unit: 'DISPATCH',
      role: 'courier',
    },
  },
  {
    email: 'kunle.admin@lirs.net',
    password: 'password123',
    user: {
      id: '2',
      email: 'kunle.admin@lirs.net',
      fullName: 'Kunle Adeyemi',
      staffId: 'AD001',
      unit: 'ADMIN',
      role: 'admin',
    },
  },
  {
    email: 'jeremiah.it@lirs.net',
    password: 'password123',
    user: {
      id: '3',
      email: 'jeremiah.it@lirs.net',
      fullName: 'Jeremiah Okonkwo',
      staffId: 'IT001',
      unit: 'IT',
      role: 'unit',
    },
  },
];

// Mock Deliveries Data
export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    scheduleId: 'SCH-2024-001',
    companyName: 'Nestle Nigeria PLC',
    destination: '29, Abisogun Street, Ikeja, Lagos',
    lga: 'IKEJA',
    contactPerson: 'Mr. Johnson Adeyemi',
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
    companyName: 'Unilever Nigeria Limited',
    destination: '21, Mercy Eneli Street, Surulere, Lagos',
    lga: 'SURULERE',
    contactPerson: 'Mrs. Funke Okonkwo',
    contactPhone: '08023456789',
    letterCount: 5,
    priority: 'MEDIUM',
    status: 'assigned',
    assignedAt: new Date().toISOString(),
    coordinates: { latitude: 6.4969, longitude: 3.3562 },
  },
  {
    id: '3',
    scheduleId: 'SCH-2024-003',
    companyName: 'First Bank of Nigeria',
    destination: '35, Marina Road, Lagos Island',
    lga: 'LAGOS ISLAND',
    contactPerson: 'Mr. Chukwuemeka Obi',
    contactPhone: '08034567890',
    letterCount: 2,
    priority: 'URGENT',
    status: 'picked_up',
    assignedAt: new Date(Date.now() - 3600000).toISOString(),
    coordinates: { latitude: 6.4541, longitude: 3.3947 },
  },
  {
    id: '4',
    scheduleId: 'SCH-2024-004',
    companyName: 'MTN Nigeria Communications',
    destination: '12, Adeola Odeku Street, Victoria Island',
    lga: 'EKO',
    contactPerson: 'Mr. Ibrahim Musa',
    contactPhone: '08045678901',
    letterCount: 4,
    priority: 'MINIMAL',
    status: 'en_route',
    assignedAt: new Date(Date.now() - 7200000).toISOString(),
    coordinates: { latitude: 6.4281, longitude: 3.4219 },
  },
  {
    id: '5',
    scheduleId: 'SCH-2024-005',
    companyName: 'Dangote Industries Limited',
    destination: '1, Alfred Rewane Road, Ikoyi',
    lga: 'EKO',
    contactPerson: 'Mrs. Amina Bello',
    contactPhone: '08056789012',
    letterCount: 6,
    priority: 'HIGH',
    status: 'delivered',
    assignedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 82800000).toISOString(),
    coordinates: { latitude: 6.4474, longitude: 3.4278 },
    pod: {
      deliveryId: '5',
      recipientName: 'Mrs. Amina Bello',
      recipientPhone: '08056789012',
      signature: 'mock-signature-base64',
      photos: [],
      timestamp: new Date(Date.now() - 82800000).toISOString(),
    },
  },
  {
    id: '6',
    scheduleId: 'SCH-2024-006',
    companyName: 'Access Bank PLC',
    destination: '999c, Danmole Street, Victoria Island',
    lga: 'EKO',
    contactPerson: 'Mr. Emeka Nnamdi',
    contactPhone: '08067890123',
    letterCount: 1,
    priority: 'MEDIUM',
    status: 'returned',
    assignedAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 169200000).toISOString(),
    coordinates: { latitude: 6.4312, longitude: 3.4189 },
    notes: 'Recipient not available. Office closed.',
  },
  {
    id: '7',
    scheduleId: 'SCH-2024-007',
    companyName: 'Zenith Bank PLC',
    destination: '84, Ajose Adeogun Street, Victoria Island',
    lga: 'EKO',
    contactPerson: 'Dr. Ngozi Okafor',
    contactPhone: '08078901234',
    letterCount: 3,
    priority: 'HIGH',
    status: 'assigned',
    assignedAt: new Date().toISOString(),
    coordinates: { latitude: 6.4298, longitude: 3.4156 },
  },
  {
    id: '8',
    scheduleId: 'SCH-2024-008',
    companyName: 'Shoprite Nigeria',
    destination: 'Palms Shopping Mall, Lekki',
    lga: 'ETI-OSA',
    contactPerson: 'Mr. David Okonkwo',
    contactPhone: '08089012345',
    letterCount: 2,
    priority: 'MINIMAL',
    status: 'assigned',
    assignedAt: new Date().toISOString(),
    coordinates: { latitude: 6.4389, longitude: 3.4732 },
  },
];

// Mock API Service
export const api = {
  // Authentication
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay(1000);

    // Find user by email (case-insensitive)
    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      return { user: foundUser.user };
    }

    throw new Error('Invalid email or password');
  },

  // Deliveries
  getDeliveries: async (): Promise<Delivery[]> => {
    await delay(800);
    return [...mockDeliveries];
  },

  getDeliveryById: async (id: string): Promise<Delivery | undefined> => {
    await delay(300);
    return mockDeliveries.find((d) => d.id === id);
  },

  updateDeliveryStatus: async (
    id: string,
    status: DeliveryStatus,
    notes?: string
  ): Promise<ApiResponse<null>> => {
    await delay(500);

    const delivery = mockDeliveries.find((d) => d.id === id);
    if (delivery) {
      delivery.status = status;
      if (notes) delivery.notes = notes;
      if (status === 'delivered' || status === 'returned') {
        delivery.completedAt = new Date().toISOString();
      }
    }

    return { success: true, message: 'Status updated successfully' };
  },

  // POD Submission
  submitPOD: async (pod: PODData): Promise<ApiResponse<null>> => {
    await delay(1500);

    const delivery = mockDeliveries.find((d) => d.id === pod.deliveryId);
    if (delivery) {
      delivery.pod = pod;
      delivery.status = 'delivered';
      delivery.completedAt = new Date().toISOString();
    }

    console.log('POD Submitted:', {
      deliveryId: pod.deliveryId,
      recipientName: pod.recipientName,
      hasSignature: !!pod.signature,
      photoCount: pod.photos.length,
    });

    return { success: true, message: 'POD submitted successfully' };
  },

  // Mark delivery as returned/failed
  markReturned: async (
    id: string,
    reason: string
  ): Promise<ApiResponse<null>> => {
    await delay(500);

    const delivery = mockDeliveries.find((d) => d.id === id);
    if (delivery) {
      delivery.status = 'returned';
      delivery.notes = reason;
      delivery.completedAt = new Date().toISOString();
    }

    return { success: true, message: 'Delivery marked as returned' };
  },
};

// Return failure reasons
export const failureReasons = [
  'Recipient not available',
  'Wrong address',
  'Office/Business closed',
  'Refused to accept',
  'Moved to new location',
  'Unable to locate address',
  'Security restriction',
  'Other',
];
