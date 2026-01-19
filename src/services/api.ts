import type {
  ApiResponse,
  Delivery,
  DeliveryStatus,
  LoginResponse,
  PODData,
  Priority,
  User,
} from "../types";

// Simulated delay for mock API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Users Database - 3 user profiles
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: "beta.courier@lirs.net",
    password: "password123",
    user: {
      id: "1",
      email: "beta.courier@lirs.net",
      fullName: "Beta Courier",
      staffId: "CR001",
      unit: "DISPATCH",
      role: "courier",
    },
  },
  {
    email: "rasheed.admin@lirs.net",
    password: "password123",
    user: {
      id: "2",
      email: "rasheed.admin@lirs.net",
      fullName: "Rasheed Adeyemi",
      staffId: "AD001",
      unit: "ADMIN",
      role: "admin",
    },
  },
  {
    email: "david.it@lirs.net",
    password: "password123",
    user: {
      id: "3",
      email: "david.it@lirs.net",
      fullName: "David Okonkwo",
      staffId: "IT001",
      unit: "IT",
      role: "mgt",
    },
  },
];

// Mock Deliveries Database
const NIGERIAN_COMPANIES = [
  "Nestlé Nigeria Plc",
  "Unilever Nigeria Plc",
  "Dangote Industries Ltd",
  "MTN Nigeria Communications",
  "Airtel Nigeria",
  "Glo Mobile",
  "First Bank of Nigeria",
  "Zenith Bank Plc",
  "Access Bank Plc",
  "GTBank",
  "Stanbic IBTC",
  "Fidelity Bank",
  "Ecobank Nigeria",
  "Shoprite Nigeria",
  "Jumia Nigeria",
  "Konga Online",
  "Chi Limited",
  "PZ Cussons Nigeria",
  "Flour Mills of Nigeria",
  "BUA Group",
  "Olam Nigeria",
  "TotalEnergies Marketing",
  "Mobil Oil Nigeria",
  "Julius Berger Nigeria",
  "Lafarge Africa Plc",
  "Dufil Prima Foods",
  "Nigerian Breweries",
  "Guinness Nigeria",
  "7Up Bottling Company",
];

const LGAS_LAGOS = [
  "IKEJA",
  "SURULERE",
  "LAGOS ISLAND",
  "EKO",
  "ETI-OSA",
  "LAGOS MAINLAND",
  "MUSHIN",
  "OSHODI-ISOLO",
  "ALIMOSHO",
  "AMUWO-ODOFIN",
  "APAPA",
  "BADAGRY",
  "EJIGBO",
  "IFAKO-IJAIYE",
  "IKORODU",
  "KOSOFE",
  "OJO",
  "SOMOLU",
  "AGEGE",
  "AJEROMI-IFELODUN",
  "IKOYI",
  "LEKKI PHASE 1",
  "YABA",
  "VICTORIA ISLAND",
  "BANANA ISLAND",
];

const STREETS = [
  "Adeola Odeku",
  "Ajose Adeogun",
  "Ozumba Mbadiwe",
  "Ahmadu Bello",
  "Akin Adesola",
  "Idowu Taylor",
  "Idowu Martins",
  "Sanusi Fafunwa",
  "Bishop Aboyade Cole",
  "Saka Tinubu",
  "Danmole",
  "Idejo",
  "Akin Adetokunbo",
  "Kofo Abayomi",
  "Aromire",
  "Toyin",
  "Opebi",
  "Allen Avenue",
  "Kolawole Shonibare",
  "Isaac John",
  "Odusami",
  "Joel Ogunnaike",
  "Saka",
  "Mercy Eneli",
  "Abisogun Leigh",
];

const FIRST_NAMES = [
  "Chukwuemeka",
  "Amina",
  "Funke",
  "Ibrahim",
  "Ngozi",
  "Emeka",
  "Tunde",
  "Fatima",
  "Olumide",
  "Blessing",
  "Yusuf",
  "Chioma",
];
const LAST_NAMES = [
  "Adeyemi",
  "Okonkwo",
  "Musa",
  "Bello",
  "Okafor",
  "Nnamdi",
  "Johnson",
  "Akinwale",
  "Ibrahim",
  "Eze",
  "Adetola",
  "Ogunleye",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  const prefixes = ["080", "081", "070", "090", "091"];
  const prefix = randomItem(prefixes);
  const rest = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${rest}`;
}

function randomDate(
  daysBack: number = 90,
  maxHoursSpread: number = 48
): string {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  const hourShift = Math.floor(Math.random() * maxHoursSpread * 60 * 60 * 1000);
  return new Date(now - offset - hourShift).toISOString();
}

function randomCoordinates(
  baseLat: number = 6.45,
  baseLng: number = 3.39,
  radiusKm: number = 35
): { latitude: number; longitude: number } {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * radiusKm;
  const lat = baseLat + (distance / 111.32) * Math.cos(angle);
  const lng =
    baseLng +
    (distance / (111.32 * Math.cos((baseLat * Math.PI) / 180))) *
      Math.sin(angle);
  return { latitude: +lat.toFixed(5), longitude: +lng.toFixed(5) };
}

function randomStatus(): DeliveryStatus {
  return randomItem([
    "assigned",
    "picked_up",
    "en_route",
    "arrived",
    "delivered",
    "returned",
  ]);
}

function randomPriority(): Priority {
  return randomItem(["URGENT", "NORMAL"]);
}

function createMockPOD(
  id: string,
  recipientName: string,
  recipientPhone: string
): PODData | undefined {
  if (Math.random() > 0.65) return undefined;

  return {
    deliveryId: id,
    recipientName,
    recipientPhone,
    signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...mock_signature",
    photos: Math.random() > 0.4 ? ["photo1.jpg", "photo2.jpg"] : [],
    timestamp: randomDate(0, 4),
    notes:
      Math.random() > 0.7
        ? "Left with security / Delivered to front desk"
        : undefined,
  };
}

function generateMockDeliveries(count: number = 100): Delivery[] {
  return Array.from({ length: count }, (_, i) => {
    const id = (i + 1).toString().padStart(3, "0");
    const company = randomItem(NIGERIAN_COMPANIES);
    const contactPerson = `${randomItem(FIRST_NAMES)} ${randomItem(
      LAST_NAMES
    )}`;
    const contactPhone = randomPhone();
    const status = randomStatus();
    const submittedAt = randomDate(120, 72);
    const assignedAt = new Date(
      new Date(submittedAt).getTime() + 3600000 * (1 + Math.random() * 24)
    ).toISOString();

    const delivery: Delivery = {
      id,
      scheduleId: `SCH-2025-${id.padStart(4, "0")}`,
      companyName: company,
      title: `Corporate Documents - ${company.split(" ")[0]}`,
      destination: `${Math.floor(Math.random() * 200) + 1}${
        Math.random() > 0.3 ? "B" : ""
      }, ${randomItem(STREETS)} Street${
        Math.random() > 0.6
          ? ", " +
            randomItem(["Phase 1", "Phase 2", "Ikeja GRA", "Lekki Phase 1"])
          : ""
      }, Lagos`,
      lga: randomItem(LGAS_LAGOS),
      liabilityYear: randomItem(["2024", "2025", "2025/2026"]),
      status,
      priority: randomPriority(),
      liabilityAmount: Math.floor(125000 + Math.random() * 1850000),
      submittedAt,
      contactPerson,
      contactPhone,
      assignedCourierId:
        Math.random() > 0.15
          ? `COU-${Math.floor(Math.random() * 10) + 1}`
          : undefined,
      assignedAt,
      coordinates: randomCoordinates(),
    };

    // Add time-based fields according to status
    if (
      ["picked_up", "en_route", "delivered", "returned", "arrived"].includes(
        status
      )
    ) {
      delivery.pickedUpAt = new Date(
        new Date(assignedAt).getTime() + 3600000 * (1 + Math.random() * 12)
      ).toISOString();
    }

    if (["delivered", "returned", "arrived"].includes(status)) {
      const completedTime = new Date(
        new Date(delivery.pickedUpAt!).getTime() +
          7200000 +
          Math.random() * 14400000
      );
      delivery.completedAt = completedTime.toISOString();

      if (status === "delivered") {
        delivery.pod = createMockPOD(id, contactPerson, contactPhone);
      }
    }

    if (["returned"].includes(status)) {
      delivery.notes = randomItem([
        "Recipient not available after multiple attempts",
        "Wrong address provided",
        "Office closed / Public holiday",
        "Recipient refused delivery",
        "Incomplete documentation",
        "Security denied access",
      ]);
    }

    return delivery;
  });
}

// Usage:
export const mockDeliveries: Delivery[] = generateMockDeliveries(20);

// Mock API Service
export const api = {
  // Authentication
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay(1000);

    // Find user by email (case-insensitive)
    const foundUser = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      return { user: foundUser.user };
    }

    throw new Error("Invalid email or password");
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

  // Deliveries
  getCourierDeliveries: async (courierId: number): Promise<Delivery[]> => {
    await delay(800);
    return [
      ...mockDeliveries.filter(
        (d) => d?.assignedCourierId === `COU-${courierId}`
      ),
    ];
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
      if (status === "delivered" || status === "returned") {
        delivery.completedAt = new Date().toISOString();
      }
    }

    return { success: true, message: "Status updated successfully" };
  },

  // POD Submission
  submitPOD: async (pod: PODData): Promise<ApiResponse<null>> => {
    await delay(1500);

    const delivery = mockDeliveries.find((d) => d.id === pod.deliveryId);
    if (delivery) {
      delivery.pod = pod;
      delivery.status = "delivered";
      delivery.completedAt = new Date().toISOString();
    }

    console.log("POD Submitted:", {
      deliveryId: pod.deliveryId,
      recipientName: pod.recipientName,
      hasSignature: !!pod.signature,
      photoCount: pod.photos.length,
    });

    return { success: true, message: "POD submitted successfully" };
  },

  // Mark delivery as returned/failed
  markReturned: async (
    id: string,
    reason: string
  ): Promise<ApiResponse<null>> => {
    await delay(500);

    const delivery = mockDeliveries.find((d) => d.id === id);
    if (delivery) {
      delivery.status = "returned";
      delivery.notes = reason;
      delivery.completedAt = new Date().toISOString();
    }

    return { success: true, message: "Delivery marked as returned" };
  },
};

// Return failure reasons
export const failureReasons = [
  "Recipient not available",
  "Wrong address",
  "Office/Business closed",
  "Refused to accept",
  "Moved to new location",
  "Unable to locate address",
  "Security restriction",
  "Other",
];
