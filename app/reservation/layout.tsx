import type { Metadata } from "next";
import type { ReactNode } from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

export const metadata: Metadata = {
    title: "Complete Your Reservation",
    description:
        "Finalize your booking for an authentic Ourika Valley experience. Add your contact details and confirm your adventure with certified local guides.",
    robots: { index: false, follow: false },
    openGraph: {
        type: "website",
        url: `${baseUrl}/reservation`,
        title: "Complete Your Reservation | Ourika Travels",
        description:
            "Secure your spot for an unforgettable Ourika Valley experience with expert local guides.",
        images: [
            {
                url: `${baseUrl}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "Ourika Travels reservation",
            },
        ],
    },
    alternates: { canonical: `${baseUrl}/reservation` },
};

export default function ReservationLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
