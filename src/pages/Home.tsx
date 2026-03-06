import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { pushEvent, mapItemToGA4 } from "@/lib/dataLayer";

export default function Home() {
  const featured = products.slice(0, 4);

  useEffect(() => {
    pushEvent("view_promotion", {
      creative_name: "Hero Banner",
      creative_slot: "hero",
      promotion_id: "HERO_SPRING_2024",
      promotion_name: "Spring Tech Sale",
    });

    pushEvent("view_promotion", {
      creative_name: "Coupon Banner",
      creative_slot: "bottom",
      promotion_id: "COUPON_BANNER",
      promotion_name: "SAVE10 Coupon Banner",
    });
  }, []);

  const handlePromotionClick = () => {
    pushEvent("select_promotion", {
      creative_name: "Hero Banner",
      creative_slot: "hero",
      promotion_id: "HERO_SPRING_2024",
      promotion_name: "Spring Tech Sale",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <span className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
            Spring Tech Sale — Up to 40% Off
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
            Next-Gen Gadgets,<br />
            <span className="text-accent">Unbeatable Prices</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
            Discover premium electronics with free shipping and hassle-free returns.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              onClick={handlePromotionClick}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground shadow-orange transition-all hover:bg-orange-light"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/20 px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary-foreground/10"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-b border-border bg-card py-6">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-8 px-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Truck className="h-5 w-5 text-accent" /> Free Shipping</div>
          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-accent" /> 2-Year Warranty</div>
          <div className="flex items-center gap-2"><Zap className="h-5 w-5 text-accent" /> Fast Checkout</div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Featured Products</h2>
              <p className="mt-1 text-muted-foreground">Handpicked for you</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-accent hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} listName="Featured Products" />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground md:text-4xl">
            Use code <span className="text-accent">SAVE10</span> for 10% off
          </h2>
          <p className="mt-2 text-primary-foreground/70">Limited time offer on all electronics</p>
          <Link
            to="/products"
            onClick={() => pushEvent("select_promotion", { promotion_id: "COUPON_BANNER", promotion_name: "SAVE10 Coupon Banner" })}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground shadow-orange hover:bg-orange-light transition-all"
          >
            Shop Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
