import Link from "next/link";

export default function TourHighlights() {
  return (
    <section className="max-w-[760px] border-t border-[#e5e7eb] py-6">
      <h3 className="mb-4 text-[24px] font-extrabold text-[#111827]">
        Highlights
      </h3>
      <ul className="list-disc pl-5 text-[15px] leading-7 text-[#1f1f1f]">
        <li>
          <Link href="#itinerary" className="font-semibold text-[#123d2f] underline">
            See itinerary
          </Link>
        </li>
      </ul>
    </section>
  );
}
