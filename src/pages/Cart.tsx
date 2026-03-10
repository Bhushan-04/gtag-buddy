import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, discount, appliedCoupon, applyCoupon, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState(false);

  const handleCoupon = () => {
    const ok = applyCoupon(couponInput);
    setCouponError(!ok);
    if (ok) setCouponInput("");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products to get started</p>
        <Link to="/products" className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground hover:bg-orange-light transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
        <p className="mt-1 text-muted-foreground">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-md object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">Variant: {item.selectedSize}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="rounded-md border border-border p-1 hover:bg-muted transition-colors">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="rounded-md border border-border p-1 hover:bg-muted transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => removeItem(item.product.id)} className="ml-2 p-1 text-destructive hover:text-destructive/80 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border bg-card p-6 h-fit">
            <h2 className="font-display text-lg font-semibold">Order Summary</h2>

            {/* Coupon */}
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value); setCouponError(false); }}
                  placeholder="Coupon code"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button onClick={handleCoupon} className="rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors">
                  Apply
                </button>
              </div>
              {couponError && <p className="mt-1 text-xs text-destructive">Invalid coupon code</p>}
              {appliedCoupon && (
                <p className="mt-1 flex items-center gap-1 text-xs text-success"><Tag className="h-3 w-3" /> {appliedCoupon} applied</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Try: SAVE10, GTM2024, DEMO20</p>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full rounded-lg bg-accent py-3 font-medium text-accent-foreground shadow-orange hover:bg-orange-light transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
