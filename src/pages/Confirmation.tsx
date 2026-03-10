import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { CheckCircle, Package, MapPin, CreditCard, CalendarDays } from "lucide-react";
import { format, addDays } from "date-fns";

export default function Confirmation() {
  const { isAuthenticated } = useAuth();
  const { lastOrder } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !lastOrder) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, lastOrder]);

  if (!lastOrder) return null;

  const estimatedDelivery = format(addDays(new Date(lastOrder.date), 5), "MMMM d, yyyy");

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="text-center">
          <CheckCircle className="mx-auto h-20 w-20 text-success" />
          <h1 className="mt-4 font-display text-3xl font-bold">Order Placed Successfully!</h1>
          <p className="mt-2 text-muted-foreground">Thank you for your purchase</p>
          <p className="mt-1 text-sm font-medium">Order ID: <span className="text-accent">{lastOrder.id}</span></p>
        </div>

        {/* Items */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" /> Items Ordered
          </h2>
          <div className="mt-4 space-y-3">
            {lastOrder.items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 text-sm">
                <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-muted-foreground">×{item.quantity}</p>
                </div>
                <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${lastOrder.subtotal.toFixed(2)}</span></div>
            {lastOrder.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-${lastOrder.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${lastOrder.shipping.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${lastOrder.tax.toFixed(2)}</span></div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
              <span>Total Paid</span><span>${lastOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mt-4 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" /> Delivery Address
          </h2>
          <div className="mt-3 text-sm text-muted-foreground space-y-0.5">
            <p className="font-medium text-foreground">{lastOrder.address.fullName}</p>
            <p>{lastOrder.address.address1}{lastOrder.address.address2 && `, ${lastOrder.address.address2}`}</p>
            <p>{lastOrder.address.city}, {lastOrder.address.state} {lastOrder.address.pincode}</p>
            <p>{lastOrder.address.phone}</p>
          </div>
        </div>

        {/* Payment + Delivery */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-sm font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-accent" /> Payment Method
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{lastOrder.paymentMethod}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-sm font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent" /> Estimated Delivery
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{estimatedDelivery}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground shadow-orange hover:bg-orange-light transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 font-medium hover:bg-muted transition-all"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
