import type { Metadata } from "next";
import type { ReactNode } from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

export const metadata: Metadata = {
    title: "Become a Local Guide — Join the Expert Team",
    description:
        "Apply to join Ourika Travels as a certified local guide. Share the hidden gems of the Ourika Valley and build your guiding business on our trusted platform.",
    keywords: [
        "become a guide Morocco",
        "local guide Ourika Valley",
        "register guide Marrakech",
        "join Ourika Travels",
        "local expert guide Morocco",
    ],
    openGraph: {
        type: "website",
        url: `${baseUrl}/register/guide`,
        title: "Become a Local Guide | Ourika Travels",
        description:
            "Join our certified guide network and start leading unforgettable tours in Ourika Valley, Morocco.",
        images: [
            {
                url: `${baseUrl}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "Join Ourika Travels as a local guide",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Become a Local Guide | Ourika Travels",
        description: "Register as a certified guide and take your local expertise global.",
        images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: { canonical: `${baseUrl}/register/guide` },
};

export default function RegisterGuideLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
