import type { Metadata } from "next";
import type { ReactNode } from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

export const metadata: Metadata = {
  title: "Booking History — Your Past Experiences",
  description:
    "View all your past and upcoming Ourika Valley experience reservations. Track your bookings and download digital tickets.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: `${baseUrl}/reservation-historic`,
    title: "Booking History | Ourika Travels",
    description: "Track your Ourika Travels reservations and download your experience tickets.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ourika Travels booking history",
      },
    ],
  },
  alternates: { canonical: `${baseUrl}/reservation-historic` },
};

export default function ReservationHistoricLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
