import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Package,
  Truck,
  Settings,
  Search,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

import { useShop, type ShippingConfig } from "@/store/shop";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/data/orders";
import { formatINR } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Workspace — Orders & Shipping | Hema Sarees" }],
  }),
  component: AdminPage,
});

export function AdminPage() {
  const {
    orders,
    setOrderStatus,
    setOrderShipping,
    shippingConfig,
    setShippingConfig,
    products,
    setStock,
    resetDemo,
  } = useShop();

  const [activeTab, setActiveTab] = useState<"orders" | "shipping" | "inventory">("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Editing shipping charges state
  const [editingShippingId, setEditingShippingId] = useState<string | null>(null);
  const [shippingInput, setShippingInput] = useState<string>("");

  // Shipping policy settings local state
  const [shippingMode, setShippingMode] = useState<ShippingConfig["mode"]>(shippingConfig.mode);
  const [flatFeeInput, setFlatFeeInput] = useState<string>(
    shippingConfig.flatFee ? String(shippingConfig.flatFee) : "200",
  );
  const [thresholdInput, setThresholdInput] = useState<string>(
    shippingConfig.threshold ? String(shippingConfig.threshold) : "5000",
  );

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleStartEditShipping = (o: Order) => {
    setEditingShippingId(o.id);
    setShippingInput(o.shipping != null ? String(o.shipping) : "");
  };

  const handleSaveShipping = (orderId: string) => {
    const fee = shippingInput.trim() === "" ? null : Math.max(0, Number(shippingInput));
    if (fee !== null && isNaN(fee)) {
      toast.error("Please enter a valid shipping charge in INR");
      return;
    }
    setOrderShipping(orderId, fee);
    setEditingShippingId(null);
    toast.success(`Shipping charges updated for ${orderId}`);
  };

  const handleSaveShippingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const flat = Number(flatFeeInput);
    const th = Number(thresholdInput);
    setShippingConfig({
      mode: shippingMode,
      flatFee: isNaN(flat) ? 200 : flat,
      threshold: isNaN(th) ? 5000 : th,
    });
    toast.success("Shipping configuration saved");
  };

  return (
    <div className="admin-theme min-h-screen bg-background text-foreground">
      {/* Admin Top Navigation */}
      <header className="border-b border-border bg-card px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded bg-primary text-primary-foreground font-display font-bold">
              HS
            </span>
            <div>
              <h1 className="text-base font-semibold text-foreground leading-tight">
                Hema Sarees • Boutique Operations
              </h1>
              <p className="text-xs text-muted-foreground">
                WhatsApp Orders & Manual Shipping Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetDemo}
              className="text-xs text-muted-foreground flex items-center gap-1.5"
            >
              <RotateCcw className="h-3 w-3" /> Reset Demo
            </Button>
            <Link
              to="/"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              View Storefront <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Workspace Tabs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl gap-8 px-6 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`py-3.5 font-medium border-b-2 transition ${
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Orders Pipeline ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`py-3.5 font-medium border-b-2 transition ${
              activeTab === "shipping"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Shipping Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`py-3.5 font-medium border-b-2 transition ${
              activeTab === "inventory"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Inventory ({products.length})
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* TAB 1: ORDERS & SHIPPING PIPELINE */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground mr-1">Status:</span>
                {["all", ...ORDER_STATUSES].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={`rounded px-2.5 py-1 text-xs capitalize transition ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground font-medium"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search order ID, name, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded border border-input bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
                />
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/50 text-muted-foreground font-medium">
                    <tr>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Customer & City</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Subtotal</th>
                      <th className="py-3 px-4">Shipping Charge</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-muted-foreground">
                          No orders found matching the filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => {
                        const isEditingShipping = editingShippingId === o.id;
                        const customerWaMsg = `Namaste ${o.customer}, this is Hema Sarees regarding your order ${o.id}.`;
                        const waDirectUrl = `https://wa.me/${o.phone.replace(/\D/g, "")}?text=${encodeURIComponent(customerWaMsg)}`;

                        return (
                          <tr key={o.id} className="hover:bg-muted/20 transition">
                            <td className="py-3 px-4 font-mono font-medium text-foreground">
                              {o.id}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                              {new Date(o.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-foreground">{o.customer}</p>
                              <p className="text-[0.7rem] text-muted-foreground">
                                {o.city} {o.pincode ? `(${o.pincode})` : ""}
                              </p>
                              {o.phone && (
                                <a
                                  href={waDirectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[0.7rem] text-emerald-600 hover:underline mt-0.5"
                                >
                                  <WhatsAppIcon className="h-3 w-3" /> {o.phone}
                                </a>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-foreground">
                                {o.lines.map((l) => `${l.name} (${l.qty})`).join(", ")}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-foreground">
                              {formatINR(o.subtotal)}
                            </td>
                            <td className="py-3 px-4">
                              {isEditingShipping ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="e.g. 250"
                                    value={shippingInput}
                                    onChange={(e) => setShippingInput(e.target.value)}
                                    className="w-20 rounded border border-input px-2 py-1 text-xs outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveShipping(o.id)}
                                    className="rounded bg-primary px-2 py-1 text-[0.65rem] text-primary-foreground font-medium"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingShippingId(null)}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  {o.shipping != null ? (
                                    <span className="font-medium text-foreground">
                                      {formatINR(o.shipping)}
                                    </span>
                                  ) : (
                                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[0.68rem] text-amber-700 font-medium">
                                      Pending
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditShipping(o)}
                                    className="text-[0.68rem] text-primary hover:underline"
                                  >
                                    {o.shipping != null ? "Edit" : "+ Enter"}
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 font-semibold text-foreground">
                              {o.shipping != null ? (
                                formatINR(o.total)
                              ) : (
                                <span className="text-muted-foreground">
                                  {formatINR(o.subtotal)} + ship
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                aria-label="Order status"
                                value={o.status}
                                onChange={(e) =>
                                  setOrderStatus(o.id, e.target.value as OrderStatus)
                                }
                                className="rounded border border-input bg-background py-1 px-2 text-xs font-medium capitalize"
                              >
                                {ORDER_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <a
                                href={waDirectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-2.5 py-1 text-[0.68rem] text-white hover:bg-emerald-700"
                              >
                                <WhatsAppIcon className="h-3 w-3" /> WhatsApp
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHIPPING CONFIGURATION */}
        {activeTab === "shipping" && (
          <div className="max-w-2xl rounded-md border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Shipping Policy Settings</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure how delivery charges are computed for customer checkout and admin workflows.
            </p>

            <form onSubmit={handleSaveShippingConfig} className="mt-6 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 rounded border border-border p-3.5 cursor-pointer hover:bg-muted/20">
                  <input
                    type="radio"
                    name="shippingMode"
                    value="manual"
                    checked={shippingMode === "manual"}
                    onChange={() => setShippingMode("manual")}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground">
                      Manual Quote by Seller (Default & Current)
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      No automated delivery fee is added during checkout. Customers are informed
                      that exact courier charges will be confirmed directly on WhatsApp based on
                      parcel weight and postal pincode.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded border border-border p-3.5 cursor-pointer hover:bg-muted/20">
                  <input
                    type="radio"
                    name="shippingMode"
                    value="flat"
                    checked={shippingMode === "flat"}
                    onChange={() => setShippingMode("flat")}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground">
                      Flat Rate Delivery Across India
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Standard fee applied to all domestic shipments.
                    </p>
                    {shippingMode === "flat" && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Amount in INR: ₹</span>
                        <input
                          type="number"
                          value={flatFeeInput}
                          onChange={(e) => setFlatFeeInput(e.target.value)}
                          className="w-24 rounded border border-input px-2 py-1 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded border border-border p-3.5 cursor-pointer hover:bg-muted/20">
                  <input
                    type="radio"
                    name="shippingMode"
                    value="free_threshold"
                    checked={shippingMode === "free_threshold"}
                    onChange={() => setShippingMode("free_threshold")}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground">
                      Free Shipping Above Order Threshold
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Complimentary delivery if cart exceeds the threshold; otherwise flat rate.
                    </p>
                    {shippingMode === "free_threshold" && (
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span>Threshold: ₹</span>
                          <input
                            type="number"
                            value={thresholdInput}
                            onChange={(e) => setThresholdInput(e.target.value)}
                            className="w-24 rounded border border-input px-2 py-1 text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span>Below Threshold Fee: ₹</span>
                          <input
                            type="number"
                            value={flatFeeInput}
                            onChange={(e) => setFlatFeeInput(e.target.value)}
                            className="w-20 rounded border border-input px-2 py-1 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <Button type="submit" size="sm" className="w-fit">
                Save Shipping Settings
              </Button>
            </form>
          </div>
        )}

        {/* TAB 3: INVENTORY STOCK MANAGEMENT */}
        {activeTab === "inventory" && (
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 text-muted-foreground font-medium">
                  <tr>
                    <th className="py-3 px-4">Saree Name</th>
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4">Weave & Fabric</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock In Boutique</th>
                    <th className="py-3 px-4 text-right">Adjust Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition">
                      <td className="py-3 px-4 font-medium text-foreground">
                        <p>{p.name}</p>
                        <p className="text-[0.7rem] text-muted-foreground">{p.subtitle}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{p.sku}</td>
                      <td className="py-3 px-4 text-muted-foreground capitalize">
                        {p.categories[0]} • {p.colour}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {formatINR(p.price)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${
                            p.stock <= 0
                              ? "bg-destructive/10 text-destructive"
                              : p.stock <= 3
                                ? "bg-amber-500/10 text-amber-700"
                                : "bg-emerald-500/10 text-emerald-700"
                          }`}
                        >
                          {p.stock <= 0 ? "Out of Stock" : `${p.stock} units`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setStock(p.id, p.stock - 1)}
                            disabled={p.stock <= 0}
                            className="h-6 w-6 rounded border border-border grid place-items-center hover:bg-muted disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="w-8 text-center tabular-nums font-medium">
                            {p.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => setStock(p.id, p.stock + 1)}
                            className="h-6 w-6 rounded border border-border grid place-items-center hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
