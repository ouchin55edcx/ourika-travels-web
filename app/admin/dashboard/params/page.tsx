"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { updateGalleryImage } from "@/app/actions/gallery";

type GallerySlot = {
  id: string;
  slot: number;
  image_url: string;
  cf_image_id: string | null;
  title: string | null;
};

export default function AdminParamsPage() {
  const [activeTab, setActiveTab] = useState("gallery");
  const [gallerySlots, setGallerySlots] = useState<GallerySlot[]>([
    {
      id: "1",
      slot: 1,
      image_url: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200",
      cf_image_id: null,
      title: "Ourika Waterfalls",
    },
    {
      id: "2",
      slot: 2,
      image_url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200",
      cf_image_id: null,
      title: "Berber Tea Ceremony",
    },
    {
      id: "3",
      slot: 3,
      image_url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200",
      cf_image_id: null,
      title: "Atlas Mountain Village",
    },
    {
      id: "4",
      slot: 4,
      image_url: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=1200",
      cf_image_id: null,
      title: "Hot Air Balloon",
    },
  ]);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFileSelect(slot: number, file: File | null) {
    if (!file) return;

    setUploadingSlot(slot);

    const formData = new FormData();
    formData.append("file", file);

    const result = await updateGalleryImage(slot, formData);

    if ("success" in result) {
      setGallerySlots((prev) =>
        prev.map((s) => (s.slot === slot ? { ...s, image_url: result.url } : s)),
      );
      showToast("success", "Photo updated ✓");
    } else {
      showToast("error", result.error);
    }

    setUploadingSlot(null);

    // Reset file input
    const input = fileInputRefs.current[slot - 1];
    if (input) input.value = "";

    // Trigger re-render
    setGallerySlots([...gallerySlots]);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold tracking-wider text-[#0a2e1a]/60 uppercase">Settings</p>
        <h1 className="text-4xl font-black tracking-tight text-[#0a2e1a]">Platform Settings</h1>
        <p className="mt-1 text-base font-medium text-gray-500">
          Manage gallery images and platform configuration.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("gallery")}
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "gallery"
              ? "bg-[#0a2e1a] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#0a2e1a]"
          }`}
        >
          Gallery Images
        </button>
        <button
          onClick={() => setActiveTab("general")}
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "general"
              ? "bg-[#0a2e1a] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#0a2e1a]"
          }`}
        >
          General
        </button>
      </div>

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#0a2e1a]">Home Page Gallery</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload photos for the 4 gallery slots on the home page. Each upload replaces the
              existing image.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {gallerySlots.map((slot) => (
              <div
                key={slot.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Image Preview */}
                <div className="relative aspect-video w-full">
                  <Image
                    src={slot.image_url}
                    alt={slot.title || `Gallery slot ${slot.slot}`}
                    fill
                    className="object-cover"
                  />

                  {/* Slot Badge */}
                  <div className="absolute top-3 left-3 rounded-full bg-[#0a2e1a]/90 px-3 py-1 text-xs font-black text-white backdrop-blur-sm">
                    Photo {slot.slot}
                  </div>

                  {/* Upload Overlay */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a2e1a]/80 transition-opacity ${
                      uploadingSlot === slot.slot
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {uploadingSlot === slot.slot ? (
                      <>
                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                        <p className="text-sm font-bold text-white">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-[#00ef9d]" />
                        <p className="text-sm font-black text-white">Replace photo</p>
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => {
                            fileInputRefs.current[slot.slot - 1] = el;
                          }}
                          onChange={(e) => handleFileSelect(slot.slot, e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRefs.current[slot.slot - 1]?.click()}
                          className="rounded-full bg-[#00ef9d] px-6 py-2 text-sm font-black text-[#0a2e1a] transition-transform hover:scale-105 active:scale-95"
                        >
                          Choose file
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="border-t border-gray-100 px-4 py-3">
                  <p className="text-sm font-bold text-gray-700">{slot.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Tab Placeholder */}
      {activeTab === "general" && (
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
          <p className="text-lg font-semibold text-gray-800">General settings coming soon...</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-[400] flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl ${
            toast.type === "success" ? "bg-[#0a2e1a] text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-[#00ef9d]" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          {toast.text}
        </div>
      )}
    </div>
  );
}
