/** DEMONSTRATION ORDERS — sample data for the admin prototype and WhatsApp orders. */

export type OrderStatus =
  "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type OrderChannel = "whatsapp" | "website";

export interface OrderLine {
  productId: string;
  name: string;
  sku: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: string;
  phone: string;
  address?: string;
  city: string;
  state?: string;
  pincode?: string;
  channel: OrderChannel;
  status: OrderStatus;
  lines: OrderLine[];
  subtotal: number;
  shipping: number | null; // null indicates "To be confirmed by seller"
  total: number; // subtotal + (shipping ?? 0)
  notes?: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const SEED_ORDERS: Order[] = [
  {
    id: "HS-24117",
    createdAt: "2026-11-09T11:20:00Z",
    customer: "S. Ramanathan",
    phone: "+91 98400 12345",
    address: "14 Mylapore Tank Street",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600004",
    channel: "whatsapp",
    status: "pending",
    lines: [{ productId: "p02", name: "Maragatham", sku: "HS-KAN-102", qty: 1, price: 21800 }],
    subtotal: 21800,
    shipping: null, // pending confirmation
    total: 21800,
    notes: "Requires daylight video before dispatch",
  },
  {
    id: "HS-24116",
    createdAt: "2026-11-08T15:05:00Z",
    customer: "Ananya Iyer",
    phone: "+91 99800 67890",
    address: "42 Indiranagar 100ft Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    channel: "website",
    status: "confirmed",
    lines: [
      { productId: "p08", name: "Neel", sku: "HS-COT-401", qty: 2, price: 2450 },
      { productId: "p13", name: "Mitti", sku: "HS-DLY-701", qty: 1, price: 1980 },
    ],
    subtotal: 6880,
    shipping: 200,
    total: 7080,
  },
  {
    id: "HS-24115",
    createdAt: "2026-11-07T09:40:00Z",
    customer: "Pooja Reddy",
    phone: "+91 97000 34567",
    address: "8-2-293 Banjara Hills Road No 14",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
    channel: "whatsapp",
    status: "processing",
    lines: [{ productId: "p03", name: "Swarna Jaal", sku: "HS-BAN-201", qty: 1, price: 18900 }],
    subtotal: 18900,
    shipping: 250,
    total: 19150,
  },
  {
    id: "HS-24114",
    createdAt: "2026-11-05T18:12:00Z",
    customer: "Meera Kulkarni",
    phone: "+91 98200 45678",
    address: "Plot 12, Prabhat Road, Lane 4",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411004",
    channel: "website",
    status: "shipped",
    lines: [{ productId: "p10", name: "Pista", sku: "HS-LIN-501", qty: 1, price: 4650 }],
    subtotal: 4650,
    shipping: 150,
    total: 4800,
  },
  {
    id: "HS-24113",
    createdAt: "2026-11-03T12:30:00Z",
    customer: "Devika Menon",
    phone: "+91 98470 23456",
    address: "Panampilly Nagar Main Ave",
    city: "Kochi",
    state: "Kerala",
    pincode: "682036",
    channel: "whatsapp",
    status: "delivered",
    lines: [
      { productId: "p06", name: "Haldi", sku: "HS-SLK-301", qty: 1, price: 9800 },
      { productId: "p09", name: "Kattam", sku: "HS-COT-402", qty: 1, price: 2890 },
    ],
    subtotal: 12690,
    shipping: 200,
    total: 12890,
  },
  {
    id: "HS-24112",
    createdAt: "2026-10-31T10:00:00Z",
    customer: "Ritika Sharma",
    phone: "+91 98110 56789",
    address: "B-4/22 Safdarjung Enclave",
    city: "Delhi",
    state: "Delhi",
    pincode: "110029",
    channel: "website",
    status: "delivered",
    lines: [{ productId: "p05", name: "Lal Bagh", sku: "HS-BAN-203", qty: 1, price: 28600 }],
    subtotal: 28600,
    shipping: 300,
    total: 28900,
  },
  {
    id: "HS-24111",
    createdAt: "2026-10-28T16:45:00Z",
    customer: "Gayatri Joshi",
    phone: "+91 98210 11223",
    address: "24 Marine Drive",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400020",
    channel: "whatsapp",
    status: "cancelled",
    lines: [{ productId: "p12", name: "Rani", sku: "HS-FES-601", qty: 1, price: 7800 }],
    subtotal: 7800,
    shipping: null,
    total: 7800,
  },
];
