import { experiencesData } from "@/lib/data/experiences";

export const staticCategories = [
  { id: "outdoors", slug: "outdoors", name: "Outdoors", description: "Scale the heights of the High Atlas", photo: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop" },
  { id: "food", slug: "food", name: "Food", description: "Authentic culinary journeys", photo: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop" },
  { id: "culture", slug: "culture", name: "Culture", description: "Uncover ancient traditions", photo: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200&auto=format&fit=crop" },
  { id: "water", slug: "water", name: "Water", description: "Refreshing mountain escapes", photo: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop" },
];

export const staticExperiences = experiencesData.slice(0, 8).map((experience) => ({
  id: String(experience.id),
  slug: experience.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  title: experience.title,
  cover_image: experience.image,
  badge: experience.badges[0] ?? null,
  rating: experience.rating,
  review_count: experience.reviews,
  previous_price: experience.previousPrice ?? null,
  price_per_adult: experience.price,
}));

export const staticReviews = [
  { id: "review-1", author: "Sofia M.", rating: 5, text: "A beautiful day in the Atlas Mountains with a genuinely local guide." },
  { id: "review-2", author: "Daniel R.", rating: 5, text: "Everything was clear, welcoming, and full of memorable moments." },
  { id: "review-3", author: "Amelia K.", rating: 4.8, text: "The villages and waterfalls were unforgettable." },
];

export const staticAverageRating = "4.9";
export const staticReviewCount = staticReviews.length;

export type StaticBooking = {
  id: string;
  booking_ref: string;
  tourist_name: string;
  tourist_phone: string;
  tourist_email: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "paid" | "unpaid";
  date: string;
  guests: number;
  total: number;
  tour_title: string;
};

export const staticBookings: StaticBooking[] = [
  { id: "booking-1", booking_ref: "NM-1001", tourist_name: "Sara Bennani", tourist_phone: "+212 600 123 456", tourist_email: "sara@example.com", status: "confirmed", payment_status: "paid", date: "2026-10-04", guests: 2, total: 34, tour_title: staticExperiences[0].title },
  { id: "booking-2", booking_ref: "NM-1002", tourist_name: "Youssef Amrani", tourist_phone: "+212 611 987 654", tourist_email: "youssef@example.com", status: "pending", payment_status: "unpaid", date: "2026-10-11", guests: 4, total: 92, tour_title: staticExperiences[1].title },
];

export const staticTourSlugs = staticExperiences.map(({ slug }) => slug);
export const staticCategorySlugs = staticCategories.map(({ slug }) => slug);
export const staticGuideSlugs = ["local-guides", "atlas-experts"];
