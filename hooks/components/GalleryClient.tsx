"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, Maximize2, X, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

type GalleryImage = {
  url: string;
  title: string;
  slot: number;
  id: string;
};

type GalleryClientProps = {
  images: GalleryImage[];
};

const slotSpans: Record<number, string> = {
  1: "md:col-span-2 md:row-span-2",
  2: "md:col-span-2 md:row-span-1",
  3: "md:col-span-1 md:row-span-1",
  4: "md:col-span-1 md:row-span-1",
};

const slotHeights: Record<number, string> = {
  1: "min-h-[22rem] sm:min-h-[28rem] md:min-h-0",
  2: "min-h-[16rem] sm:min-h-[20rem] md:min-h-0",
  3: "min-h-[16rem] sm:min-h-[18rem] md:min-h-0",
  4: "min-h-[16rem] sm:min-h-[18rem] md:min-h-0",
};

export default function GalleryClient({ images }: GalleryClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, images.length]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="mt-10 ml-2 w-full md:mx-auto md:mt-16 md:max-w-7xl md:px-6 md:py-24 md:py-32">
        <div className="mb-6 flex flex-col gap-3 pr-4 md:mb-12 md:flex-row md:items-end md:justify-between md:pr-0">
          <div>
            <h2 className="text-2xl leading-[0.9] font-black tracking-tighter text-[#0a2e1a] md:text-5xl">
              Moments from the Valley
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium text-[#40614f] sm:text-base">
              Discover the atmosphere before you book. On mobile, swipe through highlights from Ourika.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d8e6dc] bg-[#f6fbf8] px-4 py-2 text-xs font-black tracking-[0.2em] text-[#0f3d24] uppercase md:hidden">
            <Maximize2 className="h-3.5 w-3.5" />
            Swipe Gallery
          </div>
        </div>

        {/* Mobile Gallery */}
        <div className="hide-scrollbar -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2 md:hidden">
          {images.map((image, index) => (
            <article
              key={image.id}
              onClick={() => openLightbox(index)}
              className="group relative min-h-[24rem] w-[84vw] max-w-sm flex-none cursor-pointer snap-center overflow-hidden rounded-[2rem] shadow-lg"
            >
              <Image src={image.url} alt={image.title} fill className="object-cover saturate-[0.85] transition-all duration-700 group-hover:scale-105 group-hover:saturate-100" sizes="84vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-white uppercase backdrop-blur-sm">
                  <Maximize2 className="h-3.5 w-3.5" />
                  Valley Moment
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">{image.title}</h3>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop Gallery */}
        <div className="hidden gap-4 md:grid md:h-[500px] md:grid-cols-4 md:grid-rows-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              onClick={() => openLightbox(index)}
              className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] shadow-lg transition-all duration-700 ${slotHeights[image.slot]} ${slotSpans[image.slot]}`}
            >
              <Image src={image.url} alt={image.title} fill className="object-cover saturate-[0.8] transition-all duration-1000 group-hover:scale-110 group-hover:saturate-100" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-10 left-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="text-xl font-black text-white">{image.title}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs font-bold tracking-widest text-[#00ef9d] uppercase">
                  <Maximize2 className="h-4 w-4" />
                  View Photo
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 mr-2 ml-2 flex flex-col items-center gap-4 text-center sm:mt-12 md:mx-auto md:mt-16 md:max-w-xl md:gap-6 md:px-0">
          <h3 className="text-xl font-black text-[#0a2e1a] sm:text-3xl">Ready to create your own memories?</h3>
          <Link href="/experiences" className="group relative inline-flex w-full max-w-sm items-center justify-center gap-2 overflow-hidden rounded-full bg-[#0a2e1a] px-6 py-3.5 text-sm font-black text-white shadow-2xl transition-all hover:scale-105 hover:bg-[#0b3320] active:scale-95 sm:max-w-md sm:px-8 sm:py-4 sm:text-base md:max-w-none md:px-12 md:py-5 md:text-lg">
            <span className="relative z-10">Find your experience</span>
            <ChevronRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
            <X className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }} className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }} className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
            <ChevronRightIcon className="h-6 w-6" />
          </button>
          <div className="relative h-[80vh] w-[90vw] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[currentIndex].url} alt={images[currentIndex].title} fill className="object-contain" sizes="90vw" />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="text-lg font-bold text-white">{images[currentIndex].title}</p>
            <p className="mt-1 text-sm text-white/60">{currentIndex + 1} / {images.length}</p>
          </div>
        </div>
      )}
    </>
  );
}