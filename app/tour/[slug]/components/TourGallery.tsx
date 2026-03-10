import Image from "next/image";
import { Camera } from "lucide-react";
import { galleryImages } from "./tourData";

export default function TourGallery() {
  return (
    <div className="grid gap-2 rounded-[18px] md:grid-cols-[minmax(0,1fr)_210px]">
      <div className="relative min-h-[230px] overflow-hidden rounded-[18px] sm:min-h-[260px] md:min-h-[438px]">
        <Image
          src={galleryImages[0].src}
          alt={galleryImages[0].alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 70vw"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
        <div className="relative min-h-[140px] overflow-hidden rounded-[18px] sm:min-h-[180px] md:min-h-[215px]">
          <Image
            src={galleryImages[1].src}
            alt={galleryImages[1].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>
        <div className="relative min-h-[140px] overflow-hidden rounded-[18px] sm:min-h-[180px] md:min-h-[215px]">
          <Image
            src={galleryImages[2].src}
            alt={galleryImages[2].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          <button className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#123d2f] px-3 py-2 text-xs font-bold text-white shadow-lg sm:bottom-4 sm:right-4 sm:gap-2 sm:text-sm">
            <Camera className="h-4 w-4" />
            <span>563</span>
          </button>
        </div>
      </div>
    </div>
  );
}
