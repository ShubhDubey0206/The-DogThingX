import type { Product } from "./products";
import type { Pet } from "./pets";

// ── Types ──────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  orderId: string;
  userEmail: string;
  placedAt: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  total: number;
  deliveryAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    pincode: string;
  };
  paymentMethod: "cod" | "online";
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  estimatedDelivery?: string;
  notes?: string;
}

export type AdoptionStatus =
  | "pending"
  | "under-review"
  | "approved"
  | "rejected"
  | "completed";

export interface AdoptionRequest {
  requestId: string;
  userEmail: string;
  petId: string;
  petName: string;
  petSpecies: string;
  petBreed: string;
  petImage: string;
  adoptionFee: number;
  submittedAt: string;
  status: AdoptionStatus;
  statusHistory: {
    status: AdoptionStatus;
    timestamp: string;
    note?: string;
  }[];
  enquiryMessage?: string;
  contactPhone?: string;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  reviewId: string;
  userEmail: string;
  itemId: string;
  itemType: "product" | "pet";
  itemName: string;
  itemImage: string;
  rating: number;
  text: string;
  date: string;
  status: ReviewStatus;
}

export interface SiteConfig {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  productsPerPage: number;
  defaultSort: string;
  showOutOfStock: boolean;
  gstRate: number;
  currency: string;
  deliveryEstimate: string;
  enableWishlist: boolean;
  enableAdoption: boolean;
  enableReviews: boolean;
  enableOffers: boolean;
  maintenanceMode: boolean;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  storeName: "The Dog Thingx Pet Shop",
  tagline: "Take a step for your pets, they'll love you more",
  phone: "9960878712",
  email: "thedogthingx@gmail.com",
  address: "Talegaon Dabhade, Pune",
  whatsapp: "919960878712",
  productsPerPage: 12,
  defaultSort: "newest",
  showOutOfStock: true,
  gstRate: 18,
  currency: "₹",
  deliveryEstimate: "3–5 business days",
  enableWishlist: true,
  enableAdoption: true,
  enableReviews: true,
  enableOffers: true,
  maintenanceMode: false,
  instagram: "",
  facebook: "",
  twitter: "",
  youtube: "",
};

const DEFAULT_CATEGORIES = {
  products: ["Dog", "Cat", "Fish", "Bird", "Accessories", "Food"],
  pets: ["Dog", "Cat", "Bird", "Fish", "Small Pets", "Rabbit"],
};

const DEFAULT_BRANDS = [
  "Royal Canin", "Pedigree", "Whiskas", "Drools", "Purina",
  "Himalaya Pet", "Heads Up For Tails", "Mr. Dog", "Trixie",
  "Ferplast", "Penn-Plax",
];

const SEED_REVIEWS: Review[] = [
  {
    reviewId: "REV-2024-0001",
    userEmail: "ravi.kumar@example.com",
    itemId: "prod-1",
    itemType: "product",
    itemName: "Royal Canin Adult Dog Food",
    itemImage: "https://images.unsplash.com/photo-1568640347023-a616a6e7d6ef?w=80&q=80",
    rating: 5,
    text: "Excellent quality food! My dog loves it and his coat has improved so much since we switched.",
    date: "2024-11-15T10:30:00Z",
    status: "approved",
  },
  {
    reviewId: "REV-2024-0002",
    userEmail: "priya.sharma@example.com",
    itemId: "prod-2",
    itemType: "product",
    itemName: "Pedigree Puppy Food",
    itemImage: "https://images.unsplash.com/photo-1589924691995-400dc9a9ed8a?w=80&q=80",
    rating: 3,
    text: "Decent product but the packaging was damaged when it arrived. The food itself seems okay.",
    date: "2024-12-02T14:15:00Z",
    status: "pending",
  },
  {
    reviewId: "REV-2024-0003",
    userEmail: "anita.belhekar@example.com",
    itemId: "p01",
    itemType: "pet",
    itemName: "Bruno (Labrador Retriever)",
    itemImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=80&q=80",
    rating: 5,
    text: "Bruno is the most wonderful dog! He settled in perfectly and my kids adore him.",
    date: "2024-12-10T09:45:00Z",
    status: "pending",
  },
  {
    reviewId: "REV-2024-0004",
    userEmail: "vikram.joshi@example.com",
    itemId: "p06",
    itemType: "pet",
    itemName: "Mochi (Scottish Fold)",
    itemImage: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=80&q=80",
    rating: 2,
    text: "The kitten was described as very social but she hides all day and hisses at everyone.",
    date: "2025-01-05T16:20:00Z",
    status: "rejected",
  },
  {
    reviewId: "REV-2024-0005",
    userEmail: "meena.patil@example.com",
    itemId: "prod-3",
    itemType: "product",
    itemName: "Trixie Cat Scratching Post",
    itemImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=80&q=80",
    rating: 5,
    text: "Absolutely love this! My cat uses it every single day. Very sturdy and well made.",
    date: "2025-01-12T11:00:00Z",
    status: "approved",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function readJson<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function readObj<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// ── ID Generators ────────────────────────────────────────────────────────────

export function generateOrderId(): string {
  const orders = readJson<Order>("dtx_orders");
  const count = orders.length + 1;
  const year = new Date().getFullYear();
  return `DTX-${year}-${String(count).padStart(4, "0")}`;
}

export function generateRequestId(): string {
  const reqs = readJson<AdoptionRequest>("dtx_adoptions");
  const count = reqs.length + 1;
  const year = new Date().getFullYear();
  return `ADO-${year}-${String(count).padStart(4, "0")}`;
}

// ── Orders ───────────────────────────────────────────────────────────────────

export function saveOrder(order: Order): void {
  const orders = readJson<Order>("dtx_orders");
  orders.push(order);
  writeJson("dtx_orders", orders);
}

export function getOrders(userEmail: string): Order[] {
  return readJson<Order>("dtx_orders")
    .filter((o) => o.userEmail === userEmail)
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
}

export function getOrderById(orderId: string): Order | null {
  return readJson<Order>("dtx_orders").find((o) => o.orderId === orderId) ?? null;
}

export function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): void {
  const orders = readJson<Order>("dtx_orders");
  const idx = orders.findIndex((o) => o.orderId === orderId);
  if (idx === -1) return;
  orders[idx].status = status;
  orders[idx].statusHistory.push({ status, timestamp: new Date().toISOString(), note });
  writeJson("dtx_orders", orders);
}

// ── Adoption Requests ────────────────────────────────────────────────────────

export function saveAdoptionRequest(req: AdoptionRequest): void {
  const reqs = readJson<AdoptionRequest>("dtx_adoptions");
  reqs.push(req);
  writeJson("dtx_adoptions", reqs);
}

export function getAdoptionRequests(userEmail: string): AdoptionRequest[] {
  return readJson<AdoptionRequest>("dtx_adoptions")
    .filter((r) => r.userEmail === userEmail)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getAdoptionRequestById(requestId: string): AdoptionRequest | null {
  return readJson<AdoptionRequest>("dtx_adoptions").find((r) => r.requestId === requestId) ?? null;
}

export function cancelAdoptionRequest(requestId: string): void {
  const reqs = readJson<AdoptionRequest>("dtx_adoptions");
  const idx = reqs.findIndex((r) => r.requestId === requestId);
  if (idx === -1) return;
  reqs[idx].status = "rejected";
  reqs[idx].statusHistory.push({ status: "rejected", timestamp: new Date().toISOString(), note: "Cancelled by user" });
  writeJson("dtx_adoptions", reqs);
}

// ── Admin — All Orders ────────────────────────────────────────────────────────

export function getAllOrders(): Order[] {
  return readJson<Order>("dtx_orders").sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  );
}

// ── Admin — All Adoption Requests ────────────────────────────────────────────

export function getAllAdoptionRequests(): AdoptionRequest[] {
  return readJson<AdoptionRequest>("dtx_adoptions").sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export function updateAdoptionStatus(requestId: string, status: AdoptionStatus, note?: string): void {
  const reqs = readJson<AdoptionRequest>("dtx_adoptions");
  const idx = reqs.findIndex((r) => r.requestId === requestId);
  if (idx === -1) return;
  reqs[idx].status = status;
  reqs[idx].statusHistory.push({ status, timestamp: new Date().toISOString(), note });
  writeJson("dtx_adoptions", reqs);
}

// ── Admin — Products ──────────────────────────────────────────────────────────

export function getAdminProducts(): Product[] {
  return readJson<Product>("dtx_admin_products");
}

export function saveAdminProduct(product: Product): void {
  const products = readJson<Product>("dtx_admin_products");
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx !== -1) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  writeJson("dtx_admin_products", products);
}

export function deleteAdminProduct(productId: string): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("dtx_deleted_products");
  const deleted: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  if (!deleted.includes(productId)) deleted.push(productId);
  localStorage.setItem("dtx_deleted_products", JSON.stringify(deleted));
}

export function getDeletedProductIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("dtx_deleted_products");
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

// ── Admin — Order Notes ───────────────────────────────────────────────────────

export function saveOrderAdminNote(orderId: string, note: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("dtx_order_notes");
    const notes: Record<string, string> = raw ? JSON.parse(raw) : {};
    notes[orderId] = note;
    localStorage.setItem("dtx_order_notes", JSON.stringify(notes));
  } catch { /* ignore */ }
}

export function getOrderAdminNote(orderId: string): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem("dtx_order_notes");
    const notes: Record<string, string> = raw ? JSON.parse(raw) : {};
    return notes[orderId] ?? "";
  } catch { return ""; }
}

// ── Admin — Pets ──────────────────────────────────────────────────────────────

export function getAllAdminPets(): Pet[] {
  return readJson<Pet>("dtx_admin_pets");
}

export function saveAdminPet(pet: Pet): void {
  const pets = readJson<Pet>("dtx_admin_pets");
  const idx = pets.findIndex((p) => p.id === pet.id);
  if (idx !== -1) { pets[idx] = pet; } else { pets.push(pet); }
  writeJson("dtx_admin_pets", pets);
}

export function updateAdminPet(petId: string, updates: Partial<Pet>): void {
  const pets = readJson<Pet>("dtx_admin_pets");
  const idx = pets.findIndex((p) => p.id === petId);
  if (idx === -1) return;
  pets[idx] = { ...pets[idx], ...updates };
  writeJson("dtx_admin_pets", pets);
}

export function deleteAdminPet(petId: string): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("dtx_deleted_pets");
  const deleted: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  if (!deleted.includes(petId)) deleted.push(petId);
  localStorage.setItem("dtx_deleted_pets", JSON.stringify(deleted));
  const pets = readJson<Pet>("dtx_admin_pets");
  writeJson("dtx_admin_pets", pets.filter((p) => p.id !== petId));
}

export function getDeletedPetIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("dtx_deleted_pets");
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

export function updatePetStatus(petId: string, status: "available" | "reserved" | "adopted"): void {
  const pets = readJson<Pet>("dtx_admin_pets");
  const idx = pets.findIndex((p) => p.id === petId);
  if (idx === -1) return;
  pets[idx].status = status;
  writeJson("dtx_admin_pets", pets);
}

// ── Admin — Inventory ─────────────────────────────────────────────────────────

export function getStockQty(productId: string): number {
  if (typeof window === "undefined") return 10;
  try {
    const raw = localStorage.getItem("dtx_stock");
    const stock: Record<string, number> = raw ? JSON.parse(raw) : {};
    return stock[productId] ?? 10;
  } catch { return 10; }
}

export function setStockQty(productId: string, qty: number): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("dtx_stock");
    const stock: Record<string, number> = raw ? JSON.parse(raw) : {};
    stock[productId] = qty;
    localStorage.setItem("dtx_stock", JSON.stringify(stock));
    const tsRaw = localStorage.getItem("dtx_stock_updated");
    const timestamps: Record<string, string> = tsRaw ? JSON.parse(tsRaw) : {};
    timestamps[productId] = new Date().toISOString();
    localStorage.setItem("dtx_stock_updated", JSON.stringify(timestamps));
  } catch { /* ignore */ }
}

export function getStockLastUpdated(productId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("dtx_stock_updated");
    const timestamps: Record<string, string> = raw ? JSON.parse(raw) : {};
    return timestamps[productId] ?? null;
  } catch { return null; }
}

export function getAllStockData(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("dtx_stock");
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch { return {}; }
}

// ── Admin — Settings ──────────────────────────────────────────────────────────

export function getSiteConfig(): SiteConfig {
  return readObj<SiteConfig>("dtx_site_config", DEFAULT_SITE_CONFIG);
}

export function saveSiteConfig(config: SiteConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("dtx_site_config", JSON.stringify(config));
}

export function getCategories(): { products: string[]; pets: string[] } {
  return readObj("dtx_categories", DEFAULT_CATEGORIES);
}

export function saveCategories(cats: { products: string[]; pets: string[] }): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("dtx_categories", JSON.stringify(cats));
}

export function getBrands(): string[] {
  if (typeof window === "undefined") return [...DEFAULT_BRANDS];
  try {
    const raw = localStorage.getItem("dtx_brands");
    if (!raw) return [...DEFAULT_BRANDS];
    const parsed = JSON.parse(raw) as string[];
    return parsed.length > 0 ? parsed : [...DEFAULT_BRANDS];
  } catch { return [...DEFAULT_BRANDS]; }
}

export function saveBrands(brands: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("dtx_brands", JSON.stringify(brands));
}

// ── Admin — Reviews ───────────────────────────────────────────────────────────

function seedReviews(): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("dtx_reviews");
  if (!raw) localStorage.setItem("dtx_reviews", JSON.stringify(SEED_REVIEWS));
}

export function getAllReviews(): Review[] {
  seedReviews();
  return readJson<Review>("dtx_reviews").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function saveReview(review: Review): void {
  seedReviews();
  const reviews = readJson<Review>("dtx_reviews");
  reviews.push(review);
  writeJson("dtx_reviews", reviews);
}

export function updateReviewStatus(reviewId: string, status: ReviewStatus): void {
  const reviews = readJson<Review>("dtx_reviews");
  const idx = reviews.findIndex((r) => r.reviewId === reviewId);
  if (idx === -1) return;
  reviews[idx].status = status;
  writeJson("dtx_reviews", reviews);
}

export function deleteReview(reviewId: string): void {
  const reviews = readJson<Review>("dtx_reviews").filter((r) => r.reviewId !== reviewId);
  writeJson("dtx_reviews", reviews);
}
