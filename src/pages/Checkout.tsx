import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrders, Order, OrderAddress } from "@/context/OrderContext";
import { CreditCard, Smartphone, Banknote, Loader2, Tag } from "lucide-react";

type PaymentMethod = "card" | "upi" | "cod";

interface InputFieldProps {
  label: string;
  field: keyof OrderAddress;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (field: keyof OrderAddress, value: string) => void;
  error?: string;
}

const InputField = ({ label, field, placeholder, type = "text", value, onChange, error }: InputFieldProps) => (
  <div>
    <label className="text-sm font-medium mb-1 block">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);

export default function Checkout() {
  const { isAuthenticated, user } = useAuth();
  const { items, total, discount, appliedCoupon, applyCoupon, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState(false);

  const [address, setAddress] = useState<OrderAddress>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout", { replace: true });
    }
    if (items.length === 0 && !placing) {
      navigate("/cart", { replace: true });
    }
  }, [isAuthenticated, items.length]);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = 9.99;
  const taxRate = 0.08;
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * taxRate;
  const grandTotal = afterDiscount + shipping + tax;

  const handleCoupon = () => {
    const ok = applyCoupon(couponInput);
    setCouponError(!ok);
    if (ok) setCouponInput("");
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!address.fullName.trim()) errs.fullName = "Full name is required";
    if (!address.email.trim()) errs.email = "Email is required";
    if (!address.phone.trim()) errs.phone = "Phone is required";
    if (!address.address1.trim()) errs.address1 = "Address is required";
    if (!address.city.trim()) errs.city = "City is required";
    if (!address.state.trim()) errs.state = "State is required";
    if (!address.pincode.trim()) errs.pincode = "Pincode is required";
    if (paymentMethod === "card") {
      if (!cardNumber.trim()) errs.cardNumber = "Card number is required";
      if (!cardExpiry.trim()) errs.cardExpiry = "Expiry is required";
      if (!cardCvv.trim()) errs.cardCvv = "CVV is required";
    }
    if (paymentMethod === "upi" && !upiId.trim()) errs.upiId = "UPI ID is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    setPlacing(true);

    setTimeout(() => {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const paymentLabel = paymentMethod === "card" ? "Credit/Debit Card" : paymentMethod === "upi" ? "UPI" : "Cash on Delivery";

      const order: Order = {
        id: orderId,
        date: new Date().toISOString(),
        items: [...items],
        subtotal,
        shipping,
        tax,
        discount,
        coupon: appliedCoupon,
        total: grandTotal,
        address,
        paymentMethod: paymentLabel,
        status: "Processing",
      };

      addOrder(order);
      clearCart();
      
      // Send purchase event to GTM
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'purchase',
        value: grandTotal,
        currency: 'USD'
      });

      navigate("/confirmation", { replace: true });
    }, 2000);
  };

  const updateAddress = (field: keyof OrderAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  if (!isAuthenticated || items.length === 0) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold">Checkout</h1>
        <p className="mt-1 text-muted-foreground">Complete your order</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Address */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Delivery Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Full Name" field="fullName" placeholder="John Doe" value={address.fullName} onChange={updateAddress} error={errors.fullName} />
                <InputField label="Email" field="email" placeholder="you@example.com" type="email" value={address.email} onChange={updateAddress} error={errors.email} />
                <InputField label="Phone Number" field="phone" placeholder="+1 234 567 8900" value={address.phone} onChange={updateAddress} error={errors.phone} />
                <div className="sm:col-span-2">
                  <InputField label="Address Line 1" field="address1" placeholder="123 Main Street" value={address.address1} onChange={updateAddress} error={errors.address1} />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Address Line 2" field="address2" placeholder="Apt, Suite (optional)" value={address.address2} onChange={updateAddress} error={errors.address2} />
                </div>
                <InputField label="City" field="city" placeholder="New York" value={address.city} onChange={updateAddress} error={errors.city} />
                <InputField label="State" field="state" placeholder="NY" value={address.state} onChange={updateAddress} error={errors.state} />
                <InputField label="Pincode" field="pincode" placeholder="10001" value={address.pincode} onChange={updateAddress} error={errors.pincode} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Payment Method</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  { id: "card" as const, icon: CreditCard, label: "Credit/Debit Card", emoji: "💳" },
                  { id: "upi" as const, icon: Smartphone, label: "UPI", emoji: "📱" },
                  { id: "cod" as const, icon: Banknote, label: "Cash on Delivery", emoji: "💵" },
                ]).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm font-medium transition-all ${
                      paymentMethod === m.id
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {paymentMethod === "card" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Card Number</label>
                      <input value={cardNumber} onChange={(e) => { setCardNumber(e.target.value); if (errors.cardNumber) setErrors(p => { const n = {...p}; delete n.cardNumber; return n; }); }} placeholder="4242 4242 4242 4242" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                      {errors.cardNumber && <p className="mt-1 text-xs text-destructive">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Expiry</label>
                        <input value={cardExpiry} onChange={(e) => { setCardExpiry(e.target.value); if (errors.cardExpiry) setErrors(p => { const n = {...p}; delete n.cardExpiry; return n; }); }} placeholder="MM/YY" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                        {errors.cardExpiry && <p className="mt-1 text-xs text-destructive">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">CVV</label>
                        <input value={cardCvv} onChange={(e) => { setCardCvv(e.target.value); if (errors.cardCvv) setErrors(p => { const n = {...p}; delete n.cardCvv; return n; }); }} placeholder="123" type="password" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                        {errors.cardCvv && <p className="mt-1 text-xs text-destructive">{errors.cardCvv}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {paymentMethod === "upi" && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">UPI ID</label>
                    <input value={upiId} onChange={(e) => { setUpiId(e.target.value); if (errors.upiId) setErrors(p => { const n = {...p}; delete n.upiId; return n; }); }} placeholder="yourname@upi" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                    {errors.upiId && <p className="mt-1 text-xs text-destructive">{errors.upiId}</p>}
                  </div>
                )}
                {paymentMethod === "cod" && (
                  <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
                    💵 Pay with cash when your order is delivered. No advance payment needed.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
              <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 text-sm">
                    <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product.name}</p>
                      <p className="text-muted-foreground">×{item.quantity}</p>
                    </div>
                    <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mt-4 border-t border-border pt-4">
                {!appliedCoupon ? (
                  <div>
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
                  </div>
                ) : (
                  <p className="flex items-center gap-1 text-xs text-success"><Tag className="h-3 w-3" /> {appliedCoupon} applied</p>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                  <span>Grand Total</span><span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="mt-6 w-full rounded-lg bg-accent py-3 font-medium text-accent-foreground shadow-orange hover:bg-orange-light transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {placing ? <><Loader2 className="h-5 w-5 animate-spin" /> Placing Order...</> : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
