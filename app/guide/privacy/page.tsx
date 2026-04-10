import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Guide Privacy Policy | Ourika Travels",
  description: "Privacy Policy for guides partnering with Ourika Travels",
};

export default function GuidePrivacyPage() {
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
        <h1 className="mb-2 text-3xl font-black text-[#0b3a2c]">Guide Privacy Policy</h1>
        <p className="mb-8 text-sm text-gray-500">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-bold text-[#0b3a2c]">1. Information We Collect</h2>
          <p className="text-gray-600">When you register as a guide, we collect:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Personal information (name, email, phone number)</li>
            <li>Professional credentials (guide certification, badge images)</li>
            <li>Profile information (bio, photos, languages spoken)</li>
            <li>Banking information for payments</li>
            <li>Location data during active tours</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">2. How We Use Your Information</h2>
          <p className="text-gray-600">We use your information to:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Verify your identity and credentials</li>
            <li>Display your profile to potential travelers</li>
            <li>Process bookings and payments</li>
            <li>Communicate with you about bookings and platform updates</li>
            <li>Improve our services and user experience</li>
            <li>Ensure safety and security on our platform</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">3. Information Sharing</h2>
          <p className="text-gray-600">We share your information with:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Travelers who book your experiences (name, photo, contact info)</li>
            <li>Payment processors to facilitate transactions</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p className="mt-2 text-gray-600">
            We never sell your personal information to third parties.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">4. Data Security</h2>
          <p className="text-gray-600">
            We implement industry-standard security measures to protect your data, including
            encryption, secure servers, and regular security audits. However, no method of
            transmission over the internet is 100% secure.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">5. Your Rights</h2>
          <p className="text-gray-600">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Export your data in a portable format</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">6. Data Retention</h2>
          <p className="text-gray-600">
            We retain your data for as long as your account is active. After account deletion, we
            may retain certain information for legal and business purposes for up to 7 years.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[#0b3a2c]">7. Contact Us</h2>
          <p className="text-gray-600">
            For privacy-related questions or to exercise your rights, contact us at{" "}
            <a href="mailto:privacy@ourikatravels.com" className="text-[#0b3a2c] underline">
              privacy@ourikatravels.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
