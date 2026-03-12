import type { Metadata } from "next";
import type { ReactNode } from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

export const metadata: Metadata = {
    title: "Guide Home — Your Partner Dashboard",
    description:
        "Welcome to your Ourika Travels guide home. Manage your bookings, build your digital profile, and connect with travelers in Ourika Valley.",
    robots: { index: false, follow: false },
    openGraph: {
        type: "website",
        url: `${baseUrl}/register/guide/home`,
        title: "Guide Home | Ourika Travels",
        description:
            "Your central hub for managing tours, bookings and your guide profile in Ourika Valley.",
        images: [
            {
                url: `${baseUrl}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "Ourika Travels Guide Partner Dashboard",
            },
        ],
    },
    alternates: { canonical: `${baseUrl}/register/guide/home` },
};

export default function GuideHomeLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
