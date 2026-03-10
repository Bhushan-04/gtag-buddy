import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { pushEvent } from "@/lib/dataLayer";

export default function Navbar() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      pushEvent("search", { search_term: searchQuery.trim() });
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleAuth = (type: "login" | "sign_up") => {
    pushEvent(type, { method: "email" });
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          <span className="text-accent">GTM</span>Store
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Products</Link>
          <Link to="/cart" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cart</Link>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-9 w-48 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-5 w-5" />
            </button>
          )}

          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => handleAuth("login")} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" id="login">
              Login
            </button>
            <button onClick={() => handleAuth("sign_up")} className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-orange-light transition-colors">
              Sign Up
            </button>
          </div>

          <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-sm font-medium">Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="block text-sm font-medium">Products</Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="block text-sm font-medium">Cart</Link>
          <div className="flex gap-2 pt-2">
            <button onClick={() => handleAuth("login")} className="text-sm text-muted-foreground">Login</button>
            <button onClick={() => handleAuth("sign_up")} className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  );
}
