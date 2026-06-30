"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Order, OrderStatus, getOrders, saveOrder, saveAdoptionRequest, getAdoptionRequests, AdoptionRequest } from "@/lib/storage";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Footer } from "@/components/Footer";

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Out for Delivery", value: "out-for-delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

function seedMockData(userEmail: string, userName: string) {
  const existing = getOrders(userEmail);
  if (existing.length > 0) return;
  const mockOrders: Order[] = [
    {
      orderId: "DTX-2024-0001",
      userEmail,
      placedAt: new Date(Date.now() - 5 * 864e5).toISOString(),
      items: [
        { productId: "prod01", name: "Royal Canin Adult Dog Food 10kg", category: "Food", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=64&q=60", price: 1200, quantity: 2 },
        { productId: "prod05", name: "Trixie Adjustable Dog Harness", category: "Accessories", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=64&q=60", price: 350, quantity: 1 },
      ],
      subtotal: 2750, gst: 495, total: 3245,
      deliveryAddress: { name: userName, phone: "9960878712", street: "12 Patel Nagar", city: "Talegaon Dabhade", pincode: "410506" },
      paymentMethod: "cod", status: "out-for-delivery",
      statusHistory: [
        { status: "confirmed", timestamp: new Date(Date.now() - 5 * 864e5).toISOString(), note: "Order received" },
        { status: "processing", timestamp: new Date(Date.now() - 4 * 864e5).toISOString(), note: "Packed and ready" },
        { status: "out-for-delivery", timestamp: new Date(Date.now() - 864e5).toISOString(), note: "With delivery partner" },
      ],
      estimatedDelivery: new Date(Date.now() + 864e5).toISOString(),
    },
    {
      orderId: "DTX-2024-0002",
      userEmail,
      placedAt: new Date(Date.now() - 15 * 864e5).toISOString(),
      items: [{ productId: "prod15", name: "Cat Scratching Post 60cm", category: "Accessories", image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=64&q=60", price: 950, quantity: 1 }],
      subtotal: 950, gst: 171, total: 1121,
      deliveryAddress: { name: userName, phone: "9960878712", street: "12 Patel Nagar", city: "Talegaon Dabhade", pincode: "410506" },
      paymentMethod: "cod", status: "delivered",
      statusHistory: [
        { status: "confirmed", timestamp: new Date(Date.now() - 15 * 864e5).toISOString() },
        { status: "processing", timestamp: new Date(Date.now() - 14 * 864e5).toISOString() },
        { status: "out-for-delivery", timestamp: new Date(Date.now() - 13 * 864e5).toISOString() },
        { status: "delivered", timestamp: new Date(Date.now() - 12 * 864e5).toISOString(), note: "Delivered successfully" },
      ],
    },
  ];
  mockOrders.forEach((o) => saveOrder(o));

  const existingAdoptions = getAdoptionRequests(userEmail);
  if (existingAdoptions.length === 0) {
    const mockAdoptions: AdoptionRequest[] = [
      { requestId: "ADO-2024-0001", userEmail, petId: "p01", petName: "Bruno", petSpecies: "dog", petBreed: "Labrador Retriever", petImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=160&q=60", adoptionFee: 5000, submittedAt: new Date(Date.now() - 3 * 864e5).toISOString(), status: "under-review", statusHistory: [{ status: "pending", timestamp: new Date(Date.now() - 3 * 864e5).toISOString(), note: "Enquiry received" }, { status: "under-review", timestamp: new Date(Date.now() - 2 * 864e5).toISOString(), note: "Prasad reviewing your request" }], enquiryMessage: "I'd love to adopt Bruno! I have a large apartment.", contactPhone: "9876543210" },
      { requestId: "ADO-2024-0002", userEmail, petId: "p06", petName: "Mochi", petSpecies: "cat", petBreed: "Scottish Fold", petImage: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=160&q=60", adoptionFee: 6000, submittedAt: new Date(Date.now() - 20 * 864e5).toISOString(), status: "completed", statusHistory: [{ status: "pending", timestamp: new Date(Date.now() - 20 * 864e5).toISOString() }, { status: "under-review", timestamp: new Date(Date.now() - 19 * 864e5).toISOString() }, { status: "approved", timestamp: new Date(Date.now() - 18 * 864e5).toISOString(), note: "Adoption approved!" }, { status: "completed", timestamp: new Date(Date.now() - 15 * 864e5).toISOString(), note: "Mochi has found her forever home 🐱" }] },
    ];
    mockAdoptions.forEach((r) => saveAdoptionRequest(r));
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const { currentUser, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { router.push("/"); return; }
    if (currentUser) { seedMockData(currentUser.email, currentUser.name); setOrders(getOrders(currentUser.email)); }
    setLoading(false);
  }, [currentUser, isLoggedIn]);

  const filtered = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);
  const countFor = (tab: OrderStatus | "all") => tab === "all" ? orders.length : orders.filter((o) => o.status === tab).length;

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <nav aria-label="Breadcrumb" className="mb-4">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span>My Orders</span>
          </p>
        </nav>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-3xl font-extrabold">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track your orders and view history</p>
        </motion.div>
        <div role="tablist" aria-label="Order status filter" className="flex flex-wrap gap-2 mb-8">
          {STATUS_TABS.map((tab) => {
            const count = countFor(tab.value);
            return (
              <button key={tab.value} role="tab" aria-selected={activeTab === tab.value} onClick={() => setActiveTab(tab.value)} data-testid={`tab-orders-${tab.value}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeTab === tab.value ? "bg-[#F5A623] text-[#111111]" : "bg-card border border-border text-muted-foreground hover:border-[#F5A623] hover:text-[#F5A623]"}`}
              >
                {tab.label}
                {count > 0 && <span className={`ml-1.5 text-xs font-semibold ${activeTab === tab.value ? "text-[#111111]" : "text-muted-foreground"}`}>({count})</span>}
              </button>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No orders yet" subtitle={activeTab === "all" ? "Start shopping and your orders will appear here." : `No orders with status "${activeTab.replace(/-/g, " ")}".`} buttonLabel={activeTab === "all" ? "Browse Shop →" : "View all orders"} onButtonClick={() => activeTab === "all" ? router.push("/shop") : setActiveTab("all")} />
        ) : (
          <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="show" className="space-y-4">
            {filtered.map((order, i) => <OrderCard key={order.orderId} order={order} isLast={i === filtered.length - 1} />)}
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}
