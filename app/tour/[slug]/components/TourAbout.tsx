import { aboutText } from "./tourData";

export default function TourAbout() {
  return (
    <section id="overview" className="max-w-[760px] py-8">
      <h2 className="mb-4 text-[24px] font-extrabold text-[#111827]">About</h2>
      <p className="text-[17px] leading-8 text-[#333]">
        {aboutText}{" "}
        <button className="font-bold text-[#123d2f] underline">Read more</button>
      </p>
    </section>
  );
}
