export const adminMockStats = {
  activeTreks: 24,
  bookingsToday: 18,
  walkInsToday: 6,
  pendingBookings: 7,
  monthlyRevenue: 18420,
  activeGuides: 32,
  pendingReviews: 5,
  pendingVerifications: 3,
};

export const adminMockRevenue = [
  { label: "Mon", value: 1840 },
  { label: "Tue", value: 2480 },
  { label: "Wed", value: 1960 },
  { label: "Thu", value: 3210 },
  { label: "Fri", value: 2870 },
  { label: "Sat", value: 4020 },
  { label: "Sun", value: 2040 },
];

export const adminMockBookings = [
  { id: "mock-1", tourist_name: "Sofia Martin", booking_ref: "NM-2401", trek_date: "2026-10-06", status: "confirmed", payment_status: "paid", source: "online", treks: { title: "Ourika Valley & Atlas Waterfalls" } },
  { id: "mock-2", tourist_name: "Daniel Brooks", booking_ref: "NM-2402", trek_date: "2026-10-06", status: "pending", payment_status: "unpaid", source: "walkin", treks: { title: "Agafay Desert Sunset Dinner" } },
  { id: "mock-3", tourist_name: "Lucía García", booking_ref: "NM-2403", trek_date: "2026-10-07", status: "confirmed", payment_status: "paid", source: "online", treks: { title: "Marrakech Medina Food Walk" } },
  { id: "mock-4", tourist_name: "Oliver Chen", booking_ref: "NM-2404", trek_date: "2026-10-08", status: "pending", payment_status: "unpaid", source: "online", treks: { title: "Berber Villages & Mountain Lunch" } },
  { id: "mock-5", tourist_name: "Amélie Bernard", booking_ref: "NM-2405", trek_date: "2026-10-09", status: "completed", payment_status: "paid", source: "online", treks: { title: "Three Valleys Day Trip" } },
];

export const adminMockTasks = [
  { title: "Reviews to moderate", detail: "5 reviews waiting approval", href: "/admin/dashboard/reviews", urgent: true },
  { title: "Guide verifications pending", detail: "3 guides waiting verification", href: "/admin/dashboard/users", urgent: true },
  { title: "Total active guides", detail: "32 guides on platform", href: "/admin/dashboard/users", urgent: false },
];

export const adminMockUsers = [
  { id: "user-1", full_name: "Sofia Martin", email: "sofia@example.com", role: "tourist", is_active: true, verification_status: "verified" },
  { id: "user-2", full_name: "Youssef El Amrani", email: "youssef@nomadicashara.com", role: "guide", is_active: true, verification_status: "verified" },
  { id: "user-3", full_name: "Daniel Brooks", email: "daniel@example.com", role: "tourist", is_active: true, verification_status: "verified" },
  { id: "user-4", full_name: "Amina Tazi", email: "amina@nomadicashara.com", role: "guide", is_active: true, verification_status: "pending" },
];

export const adminMockTreks = [
  { id: "trek-1", title: "Ourika Valley & Atlas Waterfalls", slug: "ourika-valley-atlas-waterfalls", price_per_adult: 45, is_active: true, rating: 4.9, review_count: 128 },
  { id: "trek-2", title: "Agafay Desert Sunset Dinner", slug: "agafay-desert-sunset-dinner", price_per_adult: 68, is_active: true, rating: 4.8, review_count: 94 },
  { id: "trek-3", title: "Marrakech Medina Food Walk", slug: "marrakech-medina-food-walk", price_per_adult: 32, is_active: true, rating: 4.7, review_count: 76 },
];

export type AdminMockBooking = (typeof adminMockBookings)[number];
export type AdminMockUser = (typeof adminMockUsers)[number];
export type AdminMockTrek = (typeof adminMockTreks)[number];
