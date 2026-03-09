import Image from "next/image";
import { ChevronRight, Heart } from "lucide-react";
import { ratingDots, similarExperiences } from "./tourData";

export default function TourSimilarExperiences() {
  return (
    <section className="py-10">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#111827]">
          Similar experiences
        </h3>
        <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#123d2f] text-[#123d2f] lg:inline-flex">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {similarExperiences.map((experience) => (
          <article key={experience.title} className="group">
            <div className="relative mb-3 overflow-hidden rounded-[14px]">
              <div className="relative aspect-[4/4]">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
              </div>
              <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#123d2f] shadow-sm">
                <Heart className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-3 rounded-[6px] bg-[#f2ef31] px-2 py-1 text-[11px] font-extrabold text-[#111827]">
                2025
              </div>
            </div>

            {experience.badge ? (
              <div
                className={`mb-2 inline-flex rounded-[4px] border px-2 py-0.5 text-[11px] font-semibold ${
                  experience.badge === "Special Offer"
                    ? "border-[#ef4a72] text-[#ef4a72]"
                    : "border-[#9ca3af] text-[#111827]"
                }`}
              >
                {experience.badge}
              </div>
            ) : null}

            <h4 className="text-[17px] font-extrabold leading-7 text-[#12311f]">
              {experience.title}
            </h4>

            <div className="mt-1 flex items-center gap-1.5 text-sm">
              <span className="font-medium">{experience.rating}</span>
              <div className="flex items-center gap-1">
                {ratingDots.map((_, index) => (
                  <span
                    key={`${experience.title}-${index}`}
                    className="h-3 w-3 rounded-full bg-[#00aa6c]"
                  />
                ))}
              </div>
              <span className="text-[#6b7280]">({experience.reviews})</span>
            </div>

            <p className="mt-2 text-[15px] text-[#666]">{experience.category}</p>

            <p className="mt-4 text-[17px] font-extrabold text-[#12311f]">
              from{" "}
              {experience.oldPrice ? (
                <span className="mr-1 text-[#666] line-through">
                  {experience.oldPrice}
                </span>
              ) : null}
              <span className={experience.oldPrice ? "text-[#cc184e]" : ""}>
                {experience.price}
              </span>{" "}
              per adult
              {experience.highlight ? (
                <span className="font-medium text-[#12311f]">
                  {" "}
                  {experience.highlight}
                </span>
              ) : null}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
