import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { Star } from "lucide-react";

interface Props {
  product: Product;
  index: number;
  listName?: string;
}

export default function ProductCard({ product, index, listName = "Product Listing" }: Props) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold ${
            product.badge === "Sale" ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"
          }`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>
        <h3 className="mt-1 text-sm font-semibold leading-tight text-foreground line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
