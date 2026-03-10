import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem } from "@/context/CartContext";

export interface OrderAddress {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  coupon: string | null;
  total: number;
  address: OrderAddress;
  paymentMethod: string;
  status: "Processing" | "Shipped" | "Delivered";
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  lastOrder: Order | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const lastOrder = orders.length > 0 ? orders[0] : null;

  return (
    <OrderContext.Provider value={{ orders, addOrder, lastOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
