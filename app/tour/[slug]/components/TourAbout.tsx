type Props = { about: string };

export default function TourAbout({ about }: Props) {
  return (
    <section id="overview" className="max-w-[760px] py-8">
      <h2 className="mb-1 text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
        About
      </h2>
      <p className="whitespace-pre-wrap text-[15px] leading-7 text-[#333] sm:text-[17px] sm:leading-8">
        {about}
      </p>
    </section>
  );
}
