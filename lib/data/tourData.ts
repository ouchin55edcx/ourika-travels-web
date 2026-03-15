// TODO: Replace with API call to backend — see lib/api/ (to be created)

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CircleAlert,
  Clock3,
  Globe,
  Languages,
  ShieldCheck,
  Smartphone,
  Users,
  WalletCards,
} from "lucide-react";

export const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200&auto=format&fit=crop",
    alt: "Terraced village in Ourika Valley",
  },
  {
    src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=900&auto=format&fit=crop",
    alt: "Travelers sitting near the river in the Atlas Mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
    alt: "Colorful riverside seating in the valley",
  },
] as const;

export const navigationItems = ["Overview", "Details", "Itinerary", "Operator", "Reviews"] as const;

export const bookingBenefits: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
    {
      icon: ShieldCheck,
      title: "Free cancellation",
      description:
        "Full refund if cancelled up to 24 hours before the experience starts (local time).",
    },
    {
      icon: WalletCards,
      title: "Reserve now & pay later",
      description: "Secure your spot while staying flexible.",
    },
    {
      icon: CalendarDays,
      title: "Book ahead",
      description: "This is booked 11 days in advance on average.",
    },
  ];

export const aboutText =
  "Take a break from the bustling streets of Marrakech to spend the day visiting the beautiful landscapes of the Atlas Mountains. Hard to navigate alone, this small-group tour takes care of everything for you so you can explore stress-free. After hotel pickup, begin with breathtaking valley views, traditional Berber villages, riverside stops, and time to relax before heading back to the city.";

export const ratingDots = Array.from({ length: 5 });

export const reviewCards = [
  {
    author: "Nirdvall",
    date: "Feb 2026",
    text: "it was a very fun experience, suggest it",
  },
  {
    author: "najav",
    date: "Feb 2026",
    text: "We had the chance to meet Sarah (our guide) who shared her love of her country and region. A real pleasure that this meeting with very beautiful day in the different valleys. A very nice...",
  },
] as const;

export const experienceFacts: Array<{ icon: LucideIcon; text: string }> = [
  { icon: Users, text: "Ages 1-99, max of 15 per group" },
  { icon: Clock3, text: "Duration: 7h" },
  { icon: CircleAlert, text: "Start time: Check availability" },
  { icon: Smartphone, text: "Mobile ticket" },
  {
    icon: Globe,
    text: "Live guide: Czech, Arabic, Chinese, Russian, Japanese, Slovak, English, French, Danish",
  },
  {
    icon: Languages,
    text: "Audio guide: Arabic, English, French, Spanish",
  },
  {
    icon: CircleAlert,
    text: "Written guide: Arabic, English, French",
  },
];

export const similarExperiences = [
  {
    title: "Marrakech: 1 Day Tour-Best of the Atlas Mountains &Three Valleys",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    badge: "Best Seller",
    rating: "5.0",
    reviews: "1,571",
    category: "Private and Luxury",
    price: "$22.65",
    oldPrice: null,
    highlight: null,
  },
  {
    title: "Atlas Mountains & 5 Valleys Tour from Marrakech - All inclusive -",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    rating: "5.0",
    reviews: "2,937",
    category: "Private and Luxury",
    price: "$92.72",
    oldPrice: null,
    highlight: "(price varies by group size)",
  },
  {
    title: "Marrakech: Atlas Mountains, Imlil Valley & Waterfalls Tour",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format&fit=crop",
    badge: "Special Offer",
    rating: "4.9",
    reviews: "346",
    category: "Private and Luxury",
    price: "$19.35",
    oldPrice: "$20.53",
    highlight: null,
  },
  {
    title: "Atlas Mountains 4 Valleys, Waterfalls, Villages and Camel Ride",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    rating: "4.9",
    reviews: "1,320",
    category: "Private and Luxury",
    price: "$17.60",
    oldPrice: null,
    highlight: null,
  },
] as const;

export const tourData = {
  highlights: [
    "Visit Berber villages in the Atlas Mountains",
    "Taste authentic Moroccan mint tea",
    "Hike to Setti-Fatma waterfalls",
    "Panoramic Atlas Mountains view",
  ],
  included: [
    "Professional local guide",
    "Transport by 4x4",
    "Traditional Berber lunch",
    "Hotel pickup",
  ],
  not_included: ["Tips / gratuities", "Personal expenses", "Travel insurance"],
  services: [
    "Small group guaranteed (max 15)",
    "Hotel pickup available",
    "Multilingual guide",
  ],
};

export function formatTitleFromSlug(slug?: string) {
  if (!slug) {
    return "";
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
