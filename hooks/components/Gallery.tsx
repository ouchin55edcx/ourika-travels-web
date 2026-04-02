import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Maximize2 } from "lucide-react";
import { getGalleryImages, type GalleryImage } from "@/app/actions/gallery";

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

const defaultImages = [
  {
    url: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200&auto=format&fit=crop",
    title: "Ourika Waterfalls",
    slot: 1,
  },
  {
    url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop",
    title: "Berber Tea Ceremony",
    slot: 2,
  },
  {
    url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200&auto=format&fit=crop",
    title: "Atlas Mountain Village",
    slot: 3,
  },
  {
    url: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=1200&auto=format&fit=crop",
    title: "Hot Air Balloon",
    slot: 4,
  },
];

export default async function Gallery() {
  const galleryImages = await getGalleryImages();
  const hasImages = galleryImages.length > 0;
  const images = hasImages ? galleryImages : defaultImages;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
      <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-4xl leading-[0.9] font-black tracking-tighter text-[#0a2e1a] md:text-5xl">
            Moments from the Valley
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-medium text-[#40614f] sm:text-base">
            Discover the atmosphere before you book. On mobile, swipe through highlights from
            Ourika.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d8e6dc] bg-[#f6fbf8] px-4 py-2 text-xs font-black tracking-[0.2em] text-[#0f3d24] uppercase md:hidden">
          <Maximize2 className="h-3.5 w-3.5" />
          Swipe Gallery
        </div>
      </div>

      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:hidden">
        {images.map((image, index) => {
          const title = image.title || "Gallery Image";
          const imageSrc = "image_url" in image ? image.image_url : image.url;

          return (
            <article
              key={"id" in image ? image.id : `mobile-${index}`}
              className="group relative min-h-[24rem] w-[84vw] max-w-sm flex-none snap-center overflow-hidden rounded-[2rem] shadow-lg"
            >
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover saturate-[0.85] transition-all duration-700 group-hover:scale-105 group-hover:saturate-100"
                sizes="84vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-white uppercase backdrop-blur-sm">
                  <Maximize2 className="h-3.5 w-3.5" />
                  Valley Moment
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">{title}</h3>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden gap-4 md:grid md:h-[500px] md:grid-cols-4 md:grid-rows-2">
        {hasImages
          ? galleryImages.map((image) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded-[2.5rem] shadow-lg transition-all duration-700 ${slotHeights[image.slot]} ${slotSpans[image.slot]}`}
              >
                <Image
                  src={image.image_url}
                  alt={image.title || "Ourika Valley, Morocco gallery image"}
                  fill
                  className="object-cover saturate-[0.8] transition-all duration-1000 group-hover:scale-110 group-hover:saturate-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute bottom-10 left-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="text-xl font-black text-white">
                    {image.title || "Gallery Image"}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold tracking-widest text-[#00ef9d] uppercase">
                    <Maximize2 className="h-4 w-4" />
                    View Photo
                  </div>
                </div>
              </div>
            ))
          : defaultImages.map((image, index) => (
              <div
                key={`default-${index}`}
                className={`group relative overflow-hidden rounded-[2.5rem] shadow-lg transition-all duration-700 ${slotHeights[image.slot]} ${slotSpans[image.slot]}`}
              >
                <Image
                  src={image.url}
                  alt={`${image.title} — Ourika Valley, Morocco`}
                  fill
                  className="object-cover saturate-[0.8] transition-all duration-1000 group-hover:scale-110 group-hover:saturate-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
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

      <div className="mt-12 flex flex-col items-center gap-5 text-center sm:mt-16 md:mt-20 md:gap-6">
        <h3 className="text-2xl font-black text-[#0a2e1a] sm:text-3xl">
          Ready to create your own memories?
        </h3>
        <Link
          href="/experiences"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#0a2e1a] px-8 py-4 text-base font-black text-white shadow-2xl transition-all hover:scale-105 hover:bg-[#0b3320] active:scale-95 sm:px-12 sm:py-5 sm:text-lg"
        >
          <span className="relative z-10">Find your experience</span>
          <ChevronRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </Link>
      </div>
    </section>
  );
}
