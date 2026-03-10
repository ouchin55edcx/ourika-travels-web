import Link from "next/link";

export default function TourHighlights() {
  return (
    <section className="max-w-[760px] border-t border-[#e5e7eb] py-6">
      <h3 className="mb-1 text-2xl font-black leading-tight text-[#111827] md:text-[28px]">
        Highlights
      </h3>
      <ul className="list-disc pl-5 text-[14px] leading-6 text-[#1f1f1f] sm:text-[15px] sm:leading-7">
        <li>
          <Link
            href="#itinerary"
            className="font-semibold text-[#123d2f] underline"
          >
            See itinerary
          </Link>
        </li>
      </ul>
    </section>
  );
}
