import { getGalleryImages } from "@/app/actions/gallery";
import GalleryClient from "./GalleryClient";

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

  const images = hasImages
    ? galleryImages.map(img => ({
        url: img.image_url,
        title: img.title || "Gallery Image",
        slot: img.slot,
        id: img.id,
      }))
    : defaultImages.map((img, index) => ({
        ...img,
        id: `default-${index}`,
      }));

  return <GalleryClient images={images} />;
}
