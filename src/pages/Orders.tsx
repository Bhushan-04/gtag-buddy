import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Package, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  Processing: "bg-yellow-500/20 text-yellow-600",
  Shipped: "bg-blue-500/20 text-blue-600",
  Delivered: "bg-success/20 text-success",
};

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/orders", { replace: true });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-4 font-display text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">Start shopping to see your orders here!</p>
        <Link to="/products" className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground hover:bg-orange-light transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl font-bold">My Orders</h1>
        <p className="mt-1 text-muted-foreground">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>

        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <p className="font-display font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-accent" /> {order.id}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(order.date), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 text-sm">
                    <img src={item.product.image} alt={item.product.name} className="h-10 w-10 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product.name}</p>
                      <p className="text-muted-foreground text-xs">×{item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-border pt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
