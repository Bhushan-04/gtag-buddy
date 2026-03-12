import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Star, ShoppingCart, Check, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products" className="mt-4 text-accent hover:underline">Back to products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/product/" + product.id);
      return;
    }
    addItem(product, selectedSize);
    
    // Send add_to_cart event to GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
      product_name: product.name,
      value: product.price,
      currency: 'USD'
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 overflow-hidden rounded-md border-2 transition-colors ${i === selectedImage ? "border-accent" : "border-border"}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-medium text-accent uppercase tracking-wider">{product.brand}</p>
            <h1 className="mt-2 font-display text-3xl font-bold">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.originalPrice && (
                <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-sm font-semibold text-destructive">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Features */}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.features.map((f) => (
                <span key={f} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{f}</span>
              ))}
            </div>

            {/* Size Selector */}
            <div className="mt-6">
              <label className="text-sm font-medium">Variant</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${s === selectedSize
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border hover:border-foreground/30"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-medium transition-all ${added
                ? "bg-green-600 text-primary-foreground"
                : "bg-accent text-accent-foreground shadow-orange hover:bg-orange-light"}`}
            >
              {added ? <><Check className="h-5 w-5" /> Added to Cart</> : <><ShoppingCart className="h-5 w-5" /> Add to Cart</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
