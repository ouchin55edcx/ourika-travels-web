import type { Metadata } from "next";
import type { ReactNode } from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

export const metadata: Metadata = {
  title: "Application Submitted — Welcome to Ourika Travels",
  description:
    "Your guide application has been received. Download the Ourika Travels app and get ready to lead unforgettable experiences in Ourika Valley.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: `${baseUrl}/register/guide/success`,
    title: "Application Submitted | Ourika Travels",
    description: "Welcome to the Ourika Travels guide community. Your application is under review.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ourika Travels — Guide registration success",
      },
    ],
  },
  alternates: { canonical: `${baseUrl}/register/guide/success` },
};

export default function GuideSuccessLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
