"use client";

import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { useState } from "react";
import MapboxRouteMap from "@/components/MapboxRouteMap";

function fixUrl(url?: string): string {
  if (!url) return "";
  return url.replace(/([^:])\/\/+/g, "$1/");
}

export type ItineraryStep = {
  id: number;
  title: string;
  duration: string;
  shortLabel?: string;
  image?: string;
  description?: string;
  buttonLabel?: string;
  coordinates?: { lng: number; lat: number };
};

type Props = {
  startLocation: string;
  pickupAvailable: boolean;
  steps: ItineraryStep[];
};

export default function TourItinerary({ startLocation, pickupAvailable, steps }: Props) {
  const [activeStepId, setActiveStepId] = useState<number>(steps[0]?.id || 1);

  const toggleStep = (stepId: number) => {
    setActiveStepId((currentStepId) => (currentStepId === stepId ? 0 : stepId));
  };

  if (steps.length === 0) {
    return (
      <section id="itinerary" className="border-t border-[#e5e7eb] py-8">
        <h2 className="mb-1 text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
          Itinerary
        </h2>
        <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
          Itinerary details coming soon
        </div>
      </section>
    );
  }

  return (
    <section id="itinerary" className="border-t border-[#e5e7eb] py-8">
      <h2 className="mb-1 text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
        Itinerary
      </h2>

      <div className="grid gap-6 pt-1 lg:grid-cols-[360px_minmax(0,520px)] lg:items-start lg:justify-between">
        <div>
          <div className="flex gap-3">
            <div className="flex shrink-0 flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0a2e1a] bg-[#f2ef31] text-[14px] font-extrabold text-[#111827]">
                Start
              </div>
              <div className="h-10 w-px border-l border-dashed border-[#bdbdbd]" />
            </div>
            <div className="pt-1">
              <p className="text-[18px] font-extrabold text-[#111827] sm:text-[20px]">
                You&apos;ll start at
              </p>
              <p className="mt-1 text-[16px] text-[#111827] sm:text-[18px]">{startLocation}</p>
              {pickupAvailable && (
                <p className="mt-1 text-[14px] text-[#666] sm:text-[15px]">
                  Or, you can also get picked up
                </p>
              )}
              <button className="mt-1 text-[14px] font-bold text-[#0f3d24] underline sm:text-[15px]">
                See departure details
              </button>
            </div>
          </div>

          <div className="mt-2">
            {steps.map((step, index) => {
              const isActive = step.id === activeStepId;

              return (
                <div key={step.id} className="flex gap-3">
                  <div className="flex shrink-0 flex-col items-center">
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-[18px] font-extrabold transition ${
                        isActive ? "bg-[#00ef9d] text-[#0a2e1a]" : "bg-[#081f12] text-white"
                      }`}
                    >
                      {step.id}
                    </button>
                    {index !== steps.length - 1 ? (
                      <div className="h-full min-h-8 w-px border-l border-dashed border-[#bdbdbd]" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 pb-5">
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="w-full text-left"
                    >
                      <p
                        className={`text-[18px] font-extrabold transition-colors sm:text-[22px] ${
                          isActive ? "text-[#00ef9d]" : "text-[#0a2e1a]"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="mt-1 text-[14px] text-[#666] sm:text-[15px]">
                        Stop: {step.duration}
                      </p>
                      <span className="mt-1 inline-block text-[14px] font-bold text-[#0f3d24] underline sm:text-[15px]">
                        See details &amp; photo
                      </span>
                    </button>

                    {isActive && step.image ? (
                      <div className="pt-3">
                        <div className="relative mb-3 overflow-hidden rounded-[10px]">
                          <div className="relative aspect-[16/9] sm:aspect-[16/7]">
                            <Image
                              src={fixUrl(step.image)}
                              alt={step.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 340px"
                            />
                          </div>
                          <button className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0f3d24] shadow-sm">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>

                        <p className="text-[14px] leading-7 text-[#444] sm:text-[15px] sm:leading-8">
                          {step.description}
                        </p>

                        <button className="mt-4 min-h-11 w-full rounded-full border border-[#0f3d24] px-5 py-3 text-[15px] font-bold text-[#0a2e1a] transition hover:bg-[#f6f8f7]">
                          {step.buttonLabel || `More about ${step.title}`}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0a2e1a] bg-[#f2ef31] text-[14px] font-extrabold text-[#111827]">
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

        <div className="relative h-[400px] w-full overflow-hidden rounded-[20px] border border-black/5 shadow-2xl shadow-black/5 lg:h-[600px]">
          <MapboxRouteMap
            steps={steps}
            activeStepId={activeStepId}
            onMarkerClick={(id) => setActiveStepId(id)}
          />

          <div className="pointer-events-none absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black tracking-widest text-[#0b3a2c] uppercase shadow-xl ring-1 ring-black/5 backdrop-blur-md">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#00ef9d]" />
              Live Route View
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
