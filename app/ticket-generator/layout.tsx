import type { Metadata } from "next";
import type { ReactNode } from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

export const metadata: Metadata = {
  title: "Ticket Generator — Create Printable Experience Tickets",
  description:
    "Generate beautiful, branded tickets for Ourika Valley experiences. Customise templates, add booking details, and export as PNG or PDF.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: `${baseUrl}/ticket-generator`,
    title: "Ticket Generator | Ourika Travels",
    description: "Create professional printable tickets for Ourika Valley experiences.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ourika Travels ticket generator",
      },
    ],
  },
  alternates: { canonical: `${baseUrl}/ticket-generator` },
};

export default function TicketGeneratorLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
