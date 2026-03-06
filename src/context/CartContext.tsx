import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/data/products";
import { pushEvent, mapItemToGA4 } from "@/lib/dataLayer";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const addItem = useCallback((product: Product, size: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.selectedSize === size);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedSize === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size }];
    });
    pushEvent("add_to_cart", {
      currency: "USD",
      value: product.price,
      items: [mapItemToGA4(product, 1, undefined, size)],
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        pushEvent("remove_from_cart", {
          currency: "USD",
          value: item.product.price * item.quantity,
          items: [mapItemToGA4(item.product, item.quantity, undefined, item.selectedSize)],
        });
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const validCoupons = ["SAVE10", "GTM2024", "DEMO20"];
    const upper = code.toUpperCase();
    if (validCoupons.includes(upper)) {
      setAppliedCoupon(upper);
      pushEvent("apply_coupon", { coupon: upper });
      return true;
    }
    return false;
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discount = appliedCoupon === "DEMO20" ? subtotal * 0.2 : appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, appliedCoupon, applyCoupon, discount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
