import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Guide Terms of Service | Ourika Travels",
  description: "Terms of Service for guides partnering with Ourika Travels",
};

export default function GuideTermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black tracking-tight text-[#0b3a2c]">
            Ourika Travels
          </Link>
          <Link
            href="/register/guide"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0b3a2c]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to registration
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-black text-[#0b3a2c]">Guide Terms of Service</h1>
        <p className="mb-8 text-sm text-gray-500">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-bold text-[#0b3a2c]">1. Agreement to Terms</h2>
          <p className="text-gray-600">
            By registering as a guide on Ourika Travels, you agree to be bound by these Terms of
            Service. If you do not agree to these terms, you may not register or use our platform
            as a guide.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">2. Guide Requirements</h2>
          <p className="text-gray-600">To register as a guide, you must:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Be at least 18 years old</li>
            <li>Hold a valid guide certification from the Moroccan Ministry of Tourism</li>
            <li>Provide accurate and complete information during registration</li>
            <li>Maintain valid insurance coverage for guiding activities</li>
            <li>Comply with all local laws and regulations</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">3. Guide Responsibilities</h2>
          <p className="text-gray-600">As a guide on our platform, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Provide safe, professional, and authentic experiences</li>
            <li>Honor all confirmed bookings</li>
            <li>Communicate promptly with travelers</li>
            <li>Maintain accurate availability calendars</li>
            <li>Represent the local culture and environment respectfully</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">4. Commission and Payments</h2>
          <p className="text-gray-600">
            Ourika Travels charges a commission on each booking. Payments are processed within 48
            hours after the experience is completed. You are responsible for any applicable taxes
            on your earnings.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">5. Cancellation Policy</h2>
          <p className="text-gray-600">
            Guides must provide at least 48 hours notice for cancellations. Repeated cancellations
            may result in account suspension. Emergency cancellations will be reviewed on a
            case-by-case basis.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">6. Account Termination</h2>
          <p className="text-gray-600">
            We reserve the right to suspend or terminate guide accounts for violations of these
            terms, poor ratings, or behavior that harms travelers or our platform reputation.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">7. Contact</h2>
          <p className="text-gray-600">
            For questions about these terms, contact us at{" "}
            <a href="mailto:guides@ourikatravels.com" className="text-[#0b3a2c] underline">
              guides@ourikatravels.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
