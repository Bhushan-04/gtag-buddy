export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  sizes: string[];
  rating: number;
  reviews: number;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "prod-001",
    name: "Quantum Pro Wireless Earbuds",
    brand: "SoundCore",
    category: "Audio",
    price: 79.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop",
    ],
    description: "Premium wireless earbuds with active noise cancellation and 36-hour battery life.",
    features: ["Active Noise Cancellation", "36h Battery", "IPX5 Waterproof", "Bluetooth 5.3"],
    sizes: ["Standard", "With Wireless Case"],
    rating: 4.7,
    reviews: 2341,
    badge: "Best Seller",
  },
  {
    id: "prod-002",
    name: "NexGen Ultra Slim Laptop",
    brand: "TechVault",
    category: "Laptops",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop",
    ],
    description: "14-inch ultrabook with M3 chip, 16GB RAM, and stunning Retina display.",
    features: ["M3 Chip", "16GB RAM", "512GB SSD", "14\" Retina Display"],
    sizes: ["256GB", "512GB", "1TB"],
    rating: 4.9,
    reviews: 876,
  },
  {
    id: "prod-003",
    name: "HyperCharge 65W Power Bank",
    brand: "VoltEdge",
    category: "Accessories",
    price: 49.99,
    originalPrice: 69.99,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop",
    ],
    description: "20,000mAh power bank with 65W fast charging. Charges laptops and phones.",
    features: ["65W PD Charging", "20,000mAh", "USB-C + USB-A", "LED Display"],
    sizes: ["10,000mAh", "20,000mAh"],
    rating: 4.5,
    reviews: 1567,
    badge: "Sale",
  },
  {
    id: "prod-004",
    name: "Prism 4K Webcam",
    brand: "ClearView",
    category: "Accessories",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&h=800&fit=crop",
    ],
    description: "Ultra HD 4K webcam with auto-focus and studio-grade microphone.",
    features: ["4K Resolution", "Auto Focus", "Built-in Mic", "Privacy Shutter"],
    sizes: ["Standard"],
    rating: 4.6,
    reviews: 432,
  },
  {
    id: "prod-005",
    name: "ArcFit Smart Watch Pro",
    brand: "PulseTech",
    category: "Wearables",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&h=800&fit=crop",
    ],
    description: "Advanced smartwatch with health monitoring, GPS, and 7-day battery.",
    features: ["Heart Rate Monitor", "GPS", "7-Day Battery", "AMOLED Display"],
    sizes: ["40mm", "44mm"],
    rating: 4.8,
    reviews: 3210,
    badge: "New",
  },
  {
    id: "prod-006",
    name: "Zenith Noise-Cancelling Headphones",
    brand: "SoundCore",
    category: "Audio",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    ],
    description: "Over-ear headphones with adaptive noise cancellation and Hi-Res audio.",
    features: ["Adaptive ANC", "Hi-Res Audio", "30h Battery", "Multipoint"],
    sizes: ["Standard"],
    rating: 4.7,
    reviews: 1890,
  },
  {
    id: "prod-007",
    name: "Pixel Studio Monitor 27\"",
    brand: "TechVault",
    category: "Monitors",
    price: 449.99,
    originalPrice: 549.99,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop",
    ],
    description: "27-inch 4K IPS monitor with 99% DCI-P3 color accuracy for creators.",
    features: ["4K IPS", "99% DCI-P3", "USB-C Hub", "HDR400"],
    sizes: ["27\"", "32\""],
    rating: 4.8,
    reviews: 654,
    badge: "Sale",
  },
  {
    id: "prod-008",
    name: "MechStrike RGB Keyboard",
    brand: "KeyForge",
    category: "Peripherals",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop",
    ],
    description: "Mechanical keyboard with hot-swappable switches and per-key RGB lighting.",
    features: ["Hot-Swappable", "Per-Key RGB", "PBT Keycaps", "USB-C"],
    sizes: ["65%", "75%", "Full Size"],
    rating: 4.6,
    reviews: 2100,
  },
  {
    id: "prod-009",
    name: "SwiftDock Thunderbolt Hub",
    brand: "VoltEdge",
    category: "Accessories",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=800&fit=crop",
    ],
    description: "Thunderbolt 4 docking station with dual 4K display support and 96W charging.",
    features: ["Thunderbolt 4", "Dual 4K", "96W Charging", "10Gbps"],
    sizes: ["Standard"],
    rating: 4.4,
    reviews: 312,
  },
  {
    id: "prod-010",
    name: "AirPulse Portable Speaker",
    brand: "SoundCore",
    category: "Audio",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
    ],
    description: "Compact Bluetooth speaker with 360° sound and 20-hour playback.",
    features: ["360° Sound", "20h Battery", "IPX7 Waterproof", "Party Mode"],
    sizes: ["Mini", "Standard"],
    rating: 4.5,
    reviews: 4521,
    badge: "Popular",
  },
];

export const categories = ["All", "Audio", "Laptops", "Accessories", "Wearables", "Monitors", "Peripherals"];

export const brands = ["All", "SoundCore", "TechVault", "VoltEdge", "ClearView", "PulseTech", "KeyForge"];
