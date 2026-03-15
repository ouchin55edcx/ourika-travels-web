"use client";

import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  coverImage: string;
  galleryImages: { src: string; alt: string }[];
  totalPhotoCount: number;
  title: string;
};

export default function TourGallery({ coverImage, galleryImages, totalPhotoCount, title }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeGallery = (galleryImages || []).filter((img) => img?.src);
  const allImages = [{ src: coverImage, alt: title }, ...safeGallery];

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => Math.min(i + 1, allImages.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, allImages.length]);

  return (
    <>
      <div className="grid gap-2 rounded-[18px] md:grid-cols-[minmax(0,1fr)_210px]">
        <div
          className="relative min-h-[230px] cursor-pointer overflow-hidden rounded-[18px] transition hover:brightness-90 sm:min-h-[260px] md:min-h-[438px]"
          onClick={() => {
            setActiveIndex(0);
            setLightboxOpen(true);
          }}
        >
          <Image
            src={coverImage}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 70vw"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
          <div
            className="relative min-h-[140px] cursor-pointer overflow-hidden rounded-[18px] transition hover:brightness-90 sm:min-h-[180px] md:min-h-[215px]"
            onClick={() => {
              setActiveIndex(1);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={safeGallery[0]?.src || coverImage}
              alt={safeGallery[0]?.alt ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
          </div>
          <div
            className="relative min-h-[140px] cursor-pointer overflow-hidden rounded-[18px] transition hover:brightness-90 sm:min-h-[180px] md:min-h-[215px]"
            onClick={() => {
              setActiveIndex(2);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={safeGallery[1]?.src || coverImage}
              alt={safeGallery[1]?.alt ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <button
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex(allImages.length - 1);
                setLightboxOpen(true);
              }}
              className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-[#123d2f] px-3 py-2 text-xs font-bold text-white shadow-lg sm:right-4 sm:bottom-4 sm:gap-2 sm:text-sm"
            >
              <Camera className="h-4 w-4" />
              <span>{totalPhotoCount || safeGallery.length + 1}</span>
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
          <div className="flex shrink-0 items-center justify-between px-4 py-3">
            <span className="text-sm font-medium text-white/70">
              {activeIndex + 1} / {allImages.length}
            </span>
            <p className="max-w-[60%] truncate text-center text-sm font-semibold text-white">
              {title}
            </p>
            <button
              onClick={() => setLightboxOpen(false)}
              className="rounded-full p-2 transition-colors hover:bg-white/10"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-12">
            <div className="relative mx-auto h-full w-full max-w-5xl">
              <Image
                src={allImages[activeIndex].src}
                alt={allImages[activeIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {activeIndex > 0 && (
              <button
                onClick={() => setActiveIndex((i) => i - 1)}
                className="absolute left-2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/80"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {activeIndex < allImages.length - 1 && (
              <button
                onClick={() => setActiveIndex((i) => i + 1)}
                className="absolute right-2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/80"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="scrollbar-none flex shrink-0 items-center justify-center gap-2 overflow-x-auto px-4 py-3">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  i === activeIndex
                    ? "scale-105 border-[#00ef9d] opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
