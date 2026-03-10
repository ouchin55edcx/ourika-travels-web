export type ExperienceItem = {
  id: number;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  previousPrice?: number;
  award?: string;
  category: string;
  duration: string;
  languages: string[];
  timeOfDay: "Morning" | "Afternoon" | "Evening" | "Flexible";
  badges: string[];
};

export const filterGroups = {
  awards: ["All", "Traveler favorite", "Best Seller", "Special Offer"],
  languages: ["All", "English", "French", "Arabic"],
  timeOfDay: ["All", "Morning", "Afternoon", "Evening", "Flexible"],
  price: ["All", "Under $20", "$20-$40", "$40+"],
} as const;

export const experiencesData: ExperienceItem[] = [
  {
    id: 1,
    title: "Marrakech: Ourika Valley, Atlas Mountains, Waterfalls & Berber Villages",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviews: 480,
    price: 17,
    award: "2025",
    category: "Bus Tours",
    duration: "7h",
    languages: ["English", "French", "Arabic"],
    timeOfDay: "Morning",
    badges: ["Traveler favorite", "Best Seller"],
  },
  {
    id: 2,
    title: "Marrakech: 1 Day Tour-Best of the Atlas Mountains & Three Valleys",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    rating: 5,
    reviews: 1571,
    price: 23,
    award: "2025",
    category: "Private and Luxury",
    duration: "8h",
    languages: ["English", "French"],
    timeOfDay: "Morning",
    badges: ["Best Seller"],
  },
  {
    id: 3,
    title: "Atlas Mountains and 3 Valleys & Waterfalls - Camel Ride Marrakech",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviews: 546,
    price: 24,
    award: "2025",
    category: "Adventure Tours",
    duration: "7h",
    languages: ["English", "Arabic"],
    timeOfDay: "Morning",
    badges: ["Traveler favorite"],
  },
  {
    id: 4,
    title: "Marrakech: Atlas Mountains, Imlil Valley & Waterfalls Tour",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviews: 346,
    price: 19,
    previousPrice: 20,
    award: "2025",
    category: "Day Trips",
    duration: "7h",
    languages: ["English", "French", "Arabic"],
    timeOfDay: "Morning",
    badges: ["Special Offer"],
  },
  {
    id: 5,
    title: "Atlas Mountains and Three Valleys & Waterfalls Villages Marrakech Day Trip",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviews: 440,
    price: 16,
    award: "2025",
    category: "Bus Tours",
    duration: "6h",
    languages: ["English", "French"],
    timeOfDay: "Morning",
    badges: ["Traveler favorite"],
  },
  {
    id: 6,
    title: "Atlas Mountains 4 Valleys, Waterfalls, Villages and Camel Ride",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviews: 1320,
    price: 18,
    award: "2025",
    category: "Day Trips",
    duration: "7h",
    languages: ["English", "Arabic"],
    timeOfDay: "Morning",
    badges: ["Best Seller"],
  },
  {
    id: 7,
    title: "Atlas Mountains & 5 Valleys Tour from Marrakech - All inclusive",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1000&auto=format&fit=crop",
    rating: 5,
    reviews: 2937,
    price: 93,
    award: "2025",
    category: "Private and Luxury",
    duration: "8h",
    languages: ["English", "French"],
    timeOfDay: "Flexible",
    badges: ["Traveler favorite"],
  },
  {
    id: 8,
    title: "Ourika Valley, Atlas Mountains and Waterfalls 4x4 Tour",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviews: 121,
    price: 18,
    award: "2025",
    category: "4WD Tours",
    duration: "7h",
    languages: ["English", "Arabic"],
    timeOfDay: "Morning",
    badges: ["Traveler favorite"],
  },
  {
    id: 9,
    title: "Sunrise Hot Air Balloon above the Atlas Foothills",
    image:
      "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviews: 89,
    price: 199,
    category: "Air Tours",
    duration: "4h",
    languages: ["English", "French"],
    timeOfDay: "Morning",
    badges: ["Traveler favorite"],
  },
  {
    id: 10,
    title: "Traditional Berber Cooking Class & Lunch Experience",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviews: 64,
    price: 45,
    category: "Food Tours",
    duration: "5h",
    languages: ["English", "French", "Arabic"],
    timeOfDay: "Afternoon",
    badges: ["Traveler favorite"],
  },
  {
    id: 11,
    title: "Botanical Garden Bio-Aromatique Visit in Ourika",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    reviews: 45,
    price: 12,
    category: "Nature Walks",
    duration: "3h",
    languages: ["English", "French"],
    timeOfDay: "Afternoon",
    badges: ["Special Offer"],
  },
  {
    id: 12,
    title: "Sunset Camel Ride in the Heart of Ourika",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    reviews: 210,
    price: 25,
    category: "Camel Rides",
    duration: "2h",
    languages: ["English", "Arabic"],
    timeOfDay: "Evening",
    badges: ["Traveler favorite"],
  },
];
