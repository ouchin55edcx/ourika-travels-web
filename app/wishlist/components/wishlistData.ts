import type { ExperienceItem } from "@/app/experiences/components/experiencesData";

export const wishlistData: ExperienceItem[] = [
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
