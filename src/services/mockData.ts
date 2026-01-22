import type {
  Delivery,
  DeliveryStatus,
  PODData,
  Priority,
  User,
  UserRole,
} from "../types";

function randomPhone(): string {
  const prefix = ["080", "081", "070", "090", "091"][
    Math.floor(Math.random() * 5)
  ];
  const rest = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${rest}`;
}

function randomDate(
  daysBack: number = 90,
  maxHoursSpread: number = 48,
): string {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  const hourShift = Math.floor(Math.random() * maxHoursSpread * 60 * 60 * 1000);
  return new Date(now - offset - hourShift).toISOString();
}

function randomCoordinates(
  baseLat: number = 6.45,
  baseLng: number = 3.39,
  radiusKm: number = 35,
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
  return [
    "pending_approval",
    "delivered",
    "returned",
  ][Math.floor(Math.random() * 3)] as DeliveryStatus;
}

function randomPriority(): Priority {
  return ["URGENT", "NORMAL"][Math.floor(Math.random() * 2)] as Priority;
}

function createMockPOD(
  id: string,
  recipientName: string,
  recipientPhone: string,
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

export function generateMockDeliveries(count: number = 100): Delivery[] {
  return Array.from({ length: count }, (_, i) => {
    const id = (i + 1).toString().padStart(3, "0");
    const company = [
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
    ][Math.floor(Math.random() * 24)];
    const firstName = [
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
    ][Math.floor(Math.random() * 11)];
    const lastName = [
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
    ][Math.floor(Math.random() * 12)];
    const contactPerson = `${firstName} ${lastName}`;
    const contactPhone = randomPhone();
    const status = randomStatus();
    const submittedAt = randomDate(120, 72);
    const assignedAt = new Date(
      new Date(submittedAt).getTime() + 3600000 * (1 + Math.random() * 24),
    ).toISOString();

    const street = [
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
    ][Math.floor(Math.random() * 24)];
    const lga = [
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
    ][Math.floor(Math.random() * 24)];
    const year = ["2023", "2024", "2025", "2026"][
      Math.floor(Math.random() * 4)
    ];
    const priority = randomPriority();
    const area = ["Phase 1", "Phase 2", "Ikeja GRA", "Lekki Phase 1"][
      Math.floor(Math.random() * 4)
    ];

    const delivery: Delivery = {
      id,
      trackingId: `LTR-${year}-${id.padStart(3, "0")}`,
      scheduleId: `SCH-2025-${id.padStart(4, "0")}`,
      companyName: company,
      title: `Corporate Documents - ${company.split(" ")[0]}`,
      destination: `${Math.floor(Math.random() * 200) + 1}${
        Math.random() > 0.3 ? "B" : ""
      }, ${street} Street${Math.random() > 0.6 ? ", " + area : ""}, Lagos`,
      lga,
      liabilityYear: year,
      status,
      priority,
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
    if (["delivered", "returned"].includes(status)) {
      delivery.pickedUpAt = new Date(
        new Date(assignedAt).getTime() + 3600000 * (1 + Math.random() * 12),
      ).toISOString();

      const completedTime = new Date(
        new Date(delivery.pickedUpAt).getTime() +
          7200000 +
          Math.random() * 14400000,
      );
      delivery.completedAt = completedTime.toISOString();

      if (status === "delivered") {
        delivery.pod = createMockPOD(id, contactPerson, contactPhone);
      }
    }

    if (status === "returned") {
      delivery.notes = [
        "Recipient not available after multiple attempts",
        "Wrong address provided",
        "Office closed / Public holiday",
        "Recipient refused delivery",
        "Incomplete documentation",
        "Security denied access",
      ][Math.floor(Math.random() * 6)];
    }

    return delivery;
  });
}

// Generate mock deliveries once
export const mockDeliveries: Delivery[] = generateMockDeliveries(100);

// Mock couriers list
export const mockCouriers: User[] = [
  {
    id: "1",
    email: "beta.courier@lirs.net",
    fullName: "Beta Courier",
    phone: "08012345678",
    staffId: "CR001",
    unit: "beta",
    role: "courier" as UserRole,
  },
  {
    id: "2",
    email: "john.adebayo@lirs.net",
    fullName: "John Adebayo",
    phone: "08023456789",
    staffId: "CR002",
    unit: "ikeja",
    role: "courier" as UserRole,
  },
  {
    id: "3",
    email: "sarah.okeke@lirs.net",
    fullName: "Sarah Okeke",
    phone: "08034567890",
    staffId: "CR003",
    unit: "alausa",
    role: "courier" as UserRole,
  },
  {
    id: "4",
    email: "michael.ogundipe@lirs.net",
    fullName: "Michael Ogundipe",
    phone: "08045678901",
    staffId: "CR004",
    unit: "ikeja",
    role: "courier" as UserRole,
  },
  {
    id: "5",
    email: "fatima.ibrahim@lirs.net",
    fullName: "Fatima Ibrahim",
    phone: "08056789012",
    staffId: "CR005",
    unit: "central",
    role: "courier" as UserRole,
  },
  {
    id: "6",
    email: "david.chukwu@lirs.net",
    fullName: "David Chukwu",
    phone: "08067890123",
    staffId: "CR006",
    unit: "beta",
    role: "courier" as UserRole,
  },
  {
    id: "7",
    email: "grace.olumide@lirs.net",
    fullName: "Grace Olumide",
    phone: "08078901234",
    staffId: "CR007",
    unit: "alimosho",
    role: "courier" as UserRole,
  },
  {
    id: "8",
    email: "emmanuel.nwosu@lirs.net",
    fullName: "Emmanuel Nwosu",
    phone: "08089012345",
    staffId: "CR008",
    unit: "ikeja",
    role: "courier" as UserRole,
  },
  {
    id: "9",
    email: "amina.yusuf@lirs.net",
    fullName: "Amina Yusuf",
    phone: "08090123456",
    staffId: "CR009",
    unit: "central",
    role: "courier" as UserRole,
  },
  {
    id: "10",
    email: "tunde.balogun@lirs.net",
    fullName: "Tunde Balogun",
    phone: "08001234567",
    staffId: "CR010",
    unit: "beta",
    role: "courier" as UserRole,
  },
];
