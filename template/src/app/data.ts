// ─── Sample data for Cafe Review prototype ───

export type Cafe = {
  id: string;
  name: string;
  area: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  image: string;
  priceRange: string;
  hours: string;
  description: string;
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: "coffee" | "tea" | "food" | "dessert";
  popular?: boolean;
};

export type Review = {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
};

// ── Cafes ──

export const cafes: Cafe[] = [
  {
    id: "1",
    name: "Morning Light Coffee",
    area: "District 1",
    rating: 4.6,
    reviewCount: 128,
    tags: ["Wi-Fi", "Quiet", "Power Outlets"],
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
    priceRange: "$$",
    hours: "7:00 - 22:00",
    description: "A cozy neighborhood café with excellent pour-over coffee and a calm atmosphere perfect for remote work.",
  },
  {
    id: "2",
    name: "The Roastery",
    area: "District 3",
    rating: 4.8,
    reviewCount: 256,
    tags: ["Specialty", "Roastery", "Beans"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    priceRange: "$$$",
    hours: "8:00 - 21:00",
    description: "Single-origin beans roasted in-house. Watch the roasting process while enjoying your cup.",
  },
  {
    id: "3",
    name: "Garden Brew",
    area: "Binh Thanh",
    rating: 4.3,
    reviewCount: 89,
    tags: ["Garden", "Pet-Friendly", "Brunch"],
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop",
    priceRange: "$$",
    hours: "6:30 - 20:00",
    description: "Open-air garden café surrounded by tropical plants. Great brunch menu and pet-friendly.",
  },
  {
    id: "4",
    name: "Saigon Drip",
    area: "District 7",
    rating: 4.5,
    reviewCount: 167,
    tags: ["Vietnamese", "Traditional", "Iced Coffee"],
    image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&h=400&fit=crop",
    priceRange: "$",
    hours: "6:00 - 23:00",
    description: "Authentic Vietnamese coffee with a modern twist. Their cà phê sữa đá is legendary.",
  },
  {
    id: "5",
    name: "Analog Coffee Lab",
    area: "District 2",
    rating: 4.7,
    reviewCount: 203,
    tags: ["Specialty", "Minimal", "Workspace"],
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    priceRange: "$$$",
    hours: "7:30 - 21:30",
    description: "Minimalist specialty coffee shop with carefully curated single-origin selections.",
  },
  {
    id: "6",
    name: "Coconut Tree Café",
    area: "Thu Duc",
    rating: 4.1,
    reviewCount: 45,
    tags: ["Local", "Budget", "Street View"],
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&fit=crop",
    priceRange: "$",
    hours: "5:30 - 22:00",
    description: "Charming local café under coconut trees. Affordable drinks and a true Saigon vibe.",
  },
];

// ── Menu items for cafe detail ──

export const menuItems: MenuItem[] = [
  { id: "m1", name: "Espresso", price: 45000, category: "coffee" },
  { id: "m2", name: "Cappuccino", price: 55000, category: "coffee", popular: true },
  { id: "m3", name: "Pour Over", price: 65000, category: "coffee" },
  { id: "m4", name: "Cà Phê Sữa Đá", price: 35000, category: "coffee", popular: true },
  { id: "m5", name: "Matcha Latte", price: 60000, category: "tea" },
  { id: "m6", name: "Jasmine Green Tea", price: 40000, category: "tea" },
  { id: "m7", name: "Bánh Mì Sandwich", price: 50000, category: "food" },
  { id: "m8", name: "Avocado Toast", price: 75000, category: "food", popular: true },
  { id: "m9", name: "Tiramisu", price: 65000, category: "dessert" },
  { id: "m10", name: "Crème Brûlée", price: 70000, category: "dessert" },
];

// ── Reviews for cafe detail ──

export const reviews: Review[] = [
  {
    id: "r1",
    userName: "Minh Tran",
    avatar: "MT",
    rating: 5,
    date: "2026-03-08",
    comment: "Best pour-over in the city. The barista really knows their craft. Will definitely come back!",
  },
  {
    id: "r2",
    userName: "Sarah K.",
    avatar: "SK",
    rating: 4,
    date: "2026-03-05",
    comment: "Great atmosphere for working. Wi-Fi is fast and stable. Coffee is good but a bit pricey.",
  },
  {
    id: "r3",
    userName: "Huy Nguyen",
    avatar: "HN",
    rating: 5,
    date: "2026-02-28",
    comment: "Love the minimalist interior. The single-origin Ethiopian was exceptional. Friendly staff too.",
  },
  {
    id: "r4",
    userName: "Lisa Chen",
    avatar: "LC",
    rating: 3,
    date: "2026-02-20",
    comment: "Coffee is solid but the space gets crowded on weekends. Go on weekdays if you want a seat.",
  },
  {
    id: "r5",
    userName: "Duc Pham",
    avatar: "DP",
    rating: 4,
    date: "2026-02-15",
    comment: "Nice place to catch up with friends. The tiramisu is surprisingly good for a coffee shop.",
  },
];

// ── Helpers ──

export function formatPrice(vnd: number): string {
  return new Intl.NumberFormat("vi-VN").format(vnd) + "đ";
}

export function renderStars(rating: number): string {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
}
