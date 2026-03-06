import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { pushEvent, mapItemToGA4 } from "@/lib/dataLayer";
import { CheckCircle, Package } from "lucide-react";

export default function OrderConfirmation() {
  const { items, total, discount, appliedCoupon, clearCart } = useCart();
  const fired = useRef(false);
  const orderItems = useRef(items);
  const orderTotal = useRef(total);
  const orderDiscount = useRef(discount);
  const orderCoupon = useRef(appliedCoupon);

  useEffect(() => {
    if (!fired.current && orderItems.current.length > 0) {
      fired.current = true;
      const transactionId = `TXN-${Date.now()}`;
      pushEvent("purchase", {
        transaction_id: transactionId,
        currency: "USD",
        value: orderTotal.current,
        shipping: 0,
        tax: 0,
        discount: orderDiscount.current,
        coupon: orderCoupon.current || undefined,
        items: orderItems.current.map((i, idx) => mapItemToGA4(i.product, i.quantity, idx)),
      });
      clearCart();
    }
  }, []);

  const oItems = orderItems.current;
  const oTotal = orderTotal.current;

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-lg px-4 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-4 font-display text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">Thank you for your purchase. Your order is being processed.</p>

        <div className="mt-8 rounded-lg border border-border bg-card p-6 text-left">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" /> Order Summary
          </h2>
          <div className="mt-4 space-y-3">
            {oItems.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-sm">
                <span>{item.product.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3 flex justify-between font-semibold">
            <span>Total Paid</span>
            <span>${oTotal.toFixed(2)}</span>
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground shadow-orange hover:bg-orange-light transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
