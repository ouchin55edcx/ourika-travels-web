import { aboutText } from "./tourData";

export default function TourAbout() {
  return (
    <section id="overview" className="max-w-[760px] py-8">
      <h2 className="mb-1 text-2xl font-black leading-tight text-[#111827] md:text-[28px]">
        About
      </h2>
      <p className="text-[15px] leading-7 text-[#333] sm:text-[17px] sm:leading-8">
        {aboutText}{" "}
        <button className="font-bold text-[#123d2f] underline">
          Read more
        </button>
      </p>
    </section>
  );
}
