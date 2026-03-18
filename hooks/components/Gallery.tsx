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

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-4 md:h-[500px] md:grid-cols-4 md:grid-rows-2">
        {hasImages
          ? galleryImages.map((image) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded-[2.5rem] shadow-lg transition-all duration-700 ${slotSpans[image.slot]}`}
              >
                <Image
                  src={image.image_url}
                  alt={image.title || "Gallery image"}
                  fill
                  className="object-cover saturate-[0.8] transition-all duration-1000 group-hover:scale-110 group-hover:saturate-100"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                className={`group relative overflow-hidden rounded-[2.5rem] shadow-lg transition-all duration-700 ${slotSpans[image.slot]}`}
              >
                <Image
                  src={image.url}
                  alt={image.title}
                  fill
                  className="object-cover saturate-[0.8] transition-all duration-1000 group-hover:scale-110 group-hover:saturate-100"
                  sizes="(max-width: 768px) 100vw, 50vw"
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

      <div className="mt-20 flex flex-col items-center gap-6 text-center">
        <h3 className="text-3xl font-black text-[#0a2e1a]">Ready to create your own memories?</h3>
        <Link
          href="/experiences"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#0a2e1a] px-12 py-5 text-lg font-black text-white shadow-2xl transition-all hover:scale-105 hover:bg-[#0b3320] active:scale-95"
        >
          <span className="relative z-10">Find your experience</span>
          <ChevronRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </Link>
      </div>
    </section>
  );
}
