import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BASE_URL, SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Complete Your Reservation",
  description:
    "Finalize your booking for an authentic Ourika Valley experience. Add your contact details and confirm your adventure with certified local guides.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/reservation`,
    title: `Complete Your Reservation | ${SITE_NAME}`,
    description:
      "Secure your spot for an unforgettable Ourika Valley experience with expert local guides.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} reservation`,
      },
    ],
  },
  alternates: { canonical: `${BASE_URL}/reservation` },
};

export default function ReservationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
