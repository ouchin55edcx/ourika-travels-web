import Image from "next/image";
import { Camera } from "lucide-react";
import { galleryImages } from "./tourData";

export default function TourGallery() {
  return (
    <div className="grid gap-2 rounded-[18px] md:grid-cols-[minmax(0,1fr)_210px]">
      <div className="relative min-h-[260px] overflow-hidden rounded-[18px] md:min-h-[438px]">
        <Image
          src={galleryImages[0].src}
          alt={galleryImages[0].alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 70vw"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
        <div className="relative min-h-[180px] overflow-hidden rounded-[18px] md:min-h-[215px]">
          <Image
            src={galleryImages[1].src}
            alt={galleryImages[1].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>
        <div className="relative min-h-[180px] overflow-hidden rounded-[18px] md:min-h-[215px]">
          <Image
            src={galleryImages[2].src}
            alt={galleryImages[2].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          <button className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-[#123d2f] px-3 py-2 text-sm font-bold text-white shadow-lg">
            <Camera className="h-4 w-4" />
            <span>563</span>
          </button>
        </div>
      </div>
    </div>
  );
}
