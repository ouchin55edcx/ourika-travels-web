"use client";

import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { useState } from "react";

type ItineraryStep = {
  id: number;
  title: string;
  duration: string;
  shortLabel?: string;
  image?: string;
  description?: string;
  buttonLabel?: string;
};

const itinerarySteps: ItineraryStep[] = [
  {
    id: 1,
    title: "Marrakech",
    duration: "60 minutes",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1200&auto=format&fit=crop",
    description:
      "Leave behind the vibrant energy of Marrakech and immerse yourself in the serene beauty of the Atlas Mountains on this unforgettable guided tour. Begin your journey by observing skilled Berber women as they craft argan oil, then savor a traditional breakfast featuring mint tea, fresh bread, argan oil, and honey.",
    buttonLabel: "More about Marrakech",
  },
  {
    id: 2,
    title: "Ourika Valley",
    duration: "2 hours",
    shortLabel: "Ourika Valleys",
  },
  {
    id: 3,
    title: "Atlas Mountains View",
    duration: "2 hours",
  },
  {
    id: 4,
    title: "Marrakech-Safi",
    duration: "60 minutes",
  },
];

export default function TourItinerary() {
  const [activeStepId, setActiveStepId] = useState<number>(1);

  const toggleStep = (stepId: number) => {
    setActiveStepId((currentStepId) => (currentStepId === stepId ? 0 : stepId));
  };

  return (
    <section id="itinerary" className="border-t border-[#e5e7eb] py-8">
      <h2 className="mb-1 text-2xl font-black leading-tight text-[#111827] md:text-[28px]">
        Itinerary
      </h2>

      <div className="grid gap-6 pt-1 lg:grid-cols-[360px_minmax(0,520px)] lg:items-start lg:justify-between">
        <div>
          <div className="flex gap-3">
            <div className="flex shrink-0 flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#12311f] bg-[#f2ef31] text-[14px] font-extrabold text-[#111827]">
                Start
              </div>
              <div className="h-10 w-px border-l border-dashed border-[#bdbdbd]" />
            </div>
            <div className="pt-1">
              <p className="text-[18px] font-extrabold text-[#111827] sm:text-[20px]">
                You&apos;ll start at
              </p>
              <p className="mt-1 text-[16px] text-[#111827] sm:text-[18px]">
                Marrakesh-Safi
              </p>
              <p className="mt-1 text-[14px] text-[#666] sm:text-[15px]">
                Or, you can also get picked up
              </p>
              <button className="mt-1 text-[14px] font-bold text-[#123d2f] underline sm:text-[15px]">
                See departure details
              </button>
            </div>
          </div>

          <div className="mt-2">
            {itinerarySteps.map((step, index) => {
              const isActive = step.id === activeStepId;

              return (
                <div key={step.id} className="flex gap-3">
                  <div className="flex shrink-0 flex-col items-center">
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003b1f] text-[18px] font-extrabold text-white transition"
                    >
                      {step.id}
                    </button>
                    {index !== itinerarySteps.length - 1 ? (
                      <div className="h-full min-h-8 w-px border-l border-dashed border-[#bdbdbd]" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 pb-5">
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="w-full text-left"
                    >
                      <p className="text-[18px] font-extrabold text-[#12311f] sm:text-[22px]">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[14px] text-[#666] sm:text-[15px]">
                        Stop: {step.duration}
                      </p>
                      <span className="mt-1 inline-block text-[14px] font-bold text-[#123d2f] underline sm:text-[15px]">
                        See details &amp; photo
                      </span>
                    </button>

                    {isActive && step.image ? (
                      <div className="pt-3">
                        <div className="relative mb-3 overflow-hidden rounded-[10px]">
                          <div className="relative aspect-[16/9] sm:aspect-[16/7]">
                            <Image
                              src={step.image}
                              alt={step.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 340px"
                            />
                          </div>
                          <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#123d2f] shadow-sm">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>

                        <p className="text-[14px] leading-7 text-[#444] sm:text-[15px] sm:leading-8">
                          {step.description}
                        </p>

                        <button className="mt-4 min-h-11 w-full rounded-full border border-[#123d2f] px-5 py-3 text-[15px] font-bold text-[#12311f] transition hover:bg-[#f6f8f7]">
                          {step.buttonLabel}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-1 flex gap-3">
            <div className="flex shrink-0 flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#12311f] bg-[#f2ef31] text-[14px] font-extrabold text-[#111827]">
                End
              </div>
            </div>
            <div className="pt-1">
              <p className="text-[18px] font-extrabold text-[#111827] sm:text-[20px]">
                You&apos;ll return to the starting point
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[10px] border border-[#d7d7d7] bg-[#eef3df]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://tile.openstreetmap.org/6/31/26.png"
            alt="Map showing the itinerary route through Marrakech and Ourika Valley"
            className="h-full min-h-[260px] w-full object-cover sm:min-h-[320px] lg:min-h-[400px]"
          />

          <div className="absolute left-[8%] top-[46%] flex items-center gap-1">
            <div className="rounded-full border border-[#12311f] bg-[#f2ef31] px-2.5 py-1.5 text-[11px] font-extrabold text-[#111827] shadow-sm sm:px-3 sm:py-2 sm:text-[13px]">
              Start / End
            </div>
            <span className="h-3.5 w-3.5 rounded-full bg-[#003b1f] sm:h-4 sm:w-4" />
          </div>

          <div className="absolute bottom-[38%] right-[9%] flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003b1f] text-[15px] font-extrabold text-white shadow-sm sm:h-10 sm:w-10 sm:text-[18px]">
              2
            </span>
            <div className="text-[11px] font-medium leading-4 text-[#12311f] sm:text-[13px]">
              <p>Ourika</p>
              <p>Valleys</p>
            </div>
          </div>

          <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#4b5563] shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs">
            Mapbox · OpenStreetMap
          </div>

          <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-[4px] border border-[#d7d7d7] bg-white shadow-sm sm:bottom-4 sm:right-4">
            <button className="flex h-8 w-8 items-center justify-center text-lg text-[#4b5563] sm:h-10 sm:w-10 sm:text-xl">
              +
            </button>
            <button className="flex h-8 w-8 items-center justify-center text-lg text-[#4b5563] sm:h-10 sm:w-10 sm:text-xl">
              −
            </button>
          </div>

          <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#6b7280] shadow-sm sm:bottom-4 sm:left-4 sm:px-3 sm:py-1.5 sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Morocco route
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
