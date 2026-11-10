import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { PRODUCTS, type Product } from "@/data/catalog";
import { SEED_ORDERS, type Order, type OrderStatus } from "@/data/orders";
import { clampQty, computeTotals, type CartLine } from "@/lib/cart";
import { readStorage, writeStorage } from "@/lib/storage";

const KEYS = {
  cart: "hema.cart.v1",
  wishlist: "hema.wishlist.v1",
  recent: "hema.recent.v1",
  products: "hema.products.v1",
  orders: "hema.orders.v1",
  shipping: "hema.shipping.v1",
};

export interface ShippingConfig {
  mode: "manual" | "flat" | "free_threshold";
  flatFee?: number;
  threshold?: number;
}

const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  mode: "manual",
};

interface ShopState {
  hydrated: boolean;
  products: Product[];
  getProduct: (id: string) => Product | undefined;

  cart: CartLine[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (productId: string, qty?: number, opts?: { open?: boolean }) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totals: ReturnType<typeof computeTotals>;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  recent: string[];
  markViewed: (productId: string) => void;

  quickViewId: string | null;
  openQuickView: (productId: string | null) => void;

  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Order management & Admin operations
  orders: Order[];
  addOrder: (order: Order) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  setOrderShipping: (id: string, shipping: number | null) => void;
  shippingConfig: ShippingConfig;
  setShippingConfig: (cfg: ShippingConfig) => void;

  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  setStock: (id: string, stock: number) => void;
  resetDemo: () => void;
}

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>(DEFAULT_SHIPPING_CONFIG);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setProducts(readStorage(KEYS.products, PRODUCTS));
    setCart(readStorage(KEYS.cart, []));
    setWishlist(readStorage(KEYS.wishlist, []));
    setRecent(readStorage(KEYS.recent, []));
    setOrders(readStorage(KEYS.orders, SEED_ORDERS));
    setShippingConfig(readStorage(KEYS.shipping, DEFAULT_SHIPPING_CONFIG));
    setHydrated(true);
  }, []);

  useEffect(() => void (hydrated && writeStorage(KEYS.cart, cart)), [cart, hydrated]);
  useEffect(() => void (hydrated && writeStorage(KEYS.wishlist, wishlist)), [wishlist, hydrated]);
  useEffect(() => void (hydrated && writeStorage(KEYS.recent, recent)), [recent, hydrated]);
  useEffect(() => void (hydrated && writeStorage(KEYS.products, products)), [products, hydrated]);
  useEffect(() => void (hydrated && writeStorage(KEYS.orders, orders)), [orders, hydrated]);
  useEffect(
    () => void (hydrated && writeStorage(KEYS.shipping, shippingConfig)),
    [shippingConfig, hydrated],
  );

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);

  const addToCart = useCallback<ShopState["addToCart"]>(
    (productId, qty = 1, opts) => {
      const p = products.find((x) => x.id === productId);
      if (!p) return;
      if (p.stock <= 0) {
        toast("This saree is sold out", { description: "Enquire on WhatsApp for a re-weave." });
        return;
      }
      setCart((prev) => {
        const existing = prev.find((l) => l.productId === productId);
        if (existing) {
          return prev.map((l) =>
            l.productId === productId ? { ...l, qty: clampQty(l.qty + qty, p.stock) } : l,
          );
        }
        return [...prev, { productId, qty: clampQty(qty, p.stock) }];
      });
      if (opts?.open !== false) setCartOpen(true);
      toast.success(`${p.name} added to your bag`);
    },
    [products],
  );

  const setQty = useCallback(
    (productId: string, qty: number) => {
      const p = products.find((x) => x.id === productId);
      if (!p) return;
      setCart((prev) =>
        prev.map((l) => (l.productId === productId ? { ...l, qty: clampQty(qty, p.stock) } : l)),
      );
    },
    [products],
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const p = products.find((x) => x.id === productId);
      setWishlist((prev) => {
        const has = prev.includes(productId);
        if (p) toast(has ? `Removed ${p.name} from wishlist` : `Saved ${p.name} to wishlist`);
        return has ? prev.filter((id) => id !== productId) : [productId, ...prev];
      });
    },
    [products],
  );

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const markViewed = useCallback((productId: string) => {
    setRecent((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
  }, []);

  const addOrder = useCallback((order: Order) => setOrders((prev) => [order, ...prev]), []);

  const setOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const setOrderShipping = useCallback((id: string, shipping: number | null) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const total = o.subtotal + (shipping ?? 0);
        return { ...o, shipping, total };
      }),
    );
  }, []);

  const upsertProduct = useCallback((p: Product) => {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev];
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((l) => l.productId !== id));
    setWishlist((prev) => prev.filter((x) => x !== id));
  }, []);

  const setStock = useCallback((id: string, stock: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)));
  }, []);

  const resetDemo = useCallback(() => {
    setProducts(PRODUCTS);
    setOrders(SEED_ORDERS);
    setShippingConfig(DEFAULT_SHIPPING_CONFIG);
    toast.success("Demo data restored");
  }, []);

  // Drop cart lines whose product was deleted or ran out
  const validCart = useMemo(
    () => cart.filter((l) => products.some((p) => p.id === l.productId)),
    [cart, products],
  );
  const totals = useMemo(() => computeTotals(validCart, products), [validCart, products]);

  const value: ShopState = {
    hydrated,
    products,
    getProduct,
    cart: validCart,
    cartOpen,
    setCartOpen,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    totals,
    wishlist,
    toggleWishlist,
    isWishlisted,
    recent,
    markViewed,
    quickViewId,
    openQuickView: setQuickViewId,
    searchOpen,
    setSearchOpen,
    orders,
    addOrder,
    setOrderStatus,
    setOrderShipping,
    shippingConfig,
    setShippingConfig,
    upsertProduct,
    deleteProduct,
    setStock,
    resetDemo,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
