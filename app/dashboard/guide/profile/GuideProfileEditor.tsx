"use client";

import { useState } from "react";
import { AuthUser } from "@/lib/auth";
import { updateGuideProfile } from "@/app/actions/profile";
import { uploadGuideBadgeImage } from "@/app/actions/auth";
import {
  User,
  MapPin,
  Briefcase,
  FileText,
  Camera,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface GuideProfileEditorProps {
  user: AuthUser;
}

const AVAILABLE_LANGUAGES = [
  "Arabic",
  "French",
  "English",
  "Spanish",
  "German",
  "Italian",
  "Chinese",
  "Russian",
];

const AVAILABLE_SPECIALTIES = [
  "Hiking",
  "Cultural tours",
  "Cooking classes",
  "Photography",
  "Berber villages",
  "Waterfall hikes",
  "Sunrise treks",
  "Family tours",
  "Camel rides",
  "4x4 adventures",
];

const CERTIFICATION_SUGGESTIONS = [
  "Certified mountain guide",
  "First-aid trained",
  "Cultural ambassador",
  "Tourism license",
  "Language interpreter",
];

export default function GuideProfileEditor({ user }: GuideProfileEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: user.full_name || "",
    phone: user.phone || "",
    bio: user.bio || "",
    location: user.location || "",
    years_experience: user.years_experience?.toString() || "",
    languages: user.languages ?? [],
    specialties: user.specialties ?? [],
    certifications: user.certifications ?? [],
    guide_badge_code: user.guide_badge_code || "",
  });

  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const [badgeUrl, setBadgeUrl] = useState(user.badge_image_url || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCert, setNewCert] = useState("");

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadGuideBadgeImage(fd);
    setUploadingAvatar(false);
    if ("error" in result) setError(result.error);
    else setAvatarUrl(result.url);
  }

  async function handleBadgeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBadge(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadGuideBadgeImage(fd);
    setUploadingBadge(false);
    if ("error" in result) setError(result.error);
    else setBadgeUrl(result.url);
  }

  function toggleLanguage(lang: string) {
    setForm((p) => ({
      ...p,
      languages: p.languages.includes(lang)
        ? p.languages.filter((l) => l !== lang)
        : [...p.languages, lang],
    }));
  }

  function toggleSpecialty(spec: string) {
    setForm((p) => ({
      ...p,
      specialties: p.specialties.includes(spec)
        ? p.specialties.filter((s) => s !== spec)
        : [...p.specialties, spec],
    }));
  }

  function addCertification(cert: string) {
    if (!cert.trim()) return;
    if (form.certifications.includes(cert.trim())) return;
    setForm((p) => ({ ...p, certifications: [...p.certifications, cert.trim()] }));
    setNewCert("");
  }

  function removeCertification(index: number) {
    setForm((p) => ({
      ...p,
      certifications: p.certifications.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const fd = new FormData();
    fd.set("full_name", form.full_name);
    fd.set("phone", form.phone);
    fd.set("bio", form.bio);
    fd.set("location", form.location);
    fd.set("years_experience", form.years_experience);
    fd.set("languages", JSON.stringify(form.languages));
    fd.set("specialties", JSON.stringify(form.specialties));
    fd.set("certifications", JSON.stringify(form.certifications));
    fd.set("guide_badge_code", form.guide_badge_code);
    if (avatarUrl) fd.set("avatar_url", avatarUrl);
    if (badgeUrl) fd.set("badge_image_url", badgeUrl);

    const result = await updateGuideProfile(fd);
    setSaving(false);
    if ("error" in result) {
      setError(result.error || "An error occurred");
    } else {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.refresh();
      }, 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-black text-[#0b3a2c]">Complete Your Profile</h2>

        <div className="space-y-8">
          {/* 1. Identity */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-black tracking-widest text-gray-400 uppercase">
              <User className="h-4 w-4" />
              Identity
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-bold text-gray-700">Full name *</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                  placeholder="Ahmed Amziane"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Setti Fatma, Ourika Valley"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Years of experience</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={form.years_experience}
                  onChange={(e) => setForm((p) => ({ ...p, years_experience: e.target.value }))}
                  placeholder="5"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Your story */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="flex items-center gap-2 text-xs font-black tracking-widest text-gray-400 uppercase">
              <FileText className="h-4 w-4" />
              Your Story
            </h3>
            <div>
              <label className="text-sm font-bold text-gray-700">Bio</label>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell travelers what makes guiding with you special..."
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-400">
                {form.bio.length} characters {form.bio.length < 100 && "(min 100 recommended)"}
              </p>
            </div>
          </div>

          {/* 3. Profile photo */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="flex items-center gap-2 text-xs font-black tracking-widest text-gray-400 uppercase">
              <Camera className="h-4 w-4" />
              Profile Photo
            </h3>
            <label className="${avatarUrl ? 'border-[#0b3a2c]' : 'border-gray-200 hover:bg-[#f7fdf9]'} relative flex h-40 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:border-[#0b3a2c]">
              {uploadingAvatar && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0b3a2c]" />
                </div>
              )}
              {avatarUrl && !uploadingAvatar && (
                <>
                  <div className="h-28 w-28 overflow-hidden rounded-full">
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setAvatarUrl("");
                    }}
                    className="absolute top-2 right-2 z-10 rounded-full bg-white p-1.5 shadow hover:bg-red-50"
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                </>
              )}
              {!avatarUrl && !uploadingAvatar && (
                <div className="flex flex-col items-center gap-2 text-center">
                  <Camera className="h-8 w-8 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-500">Upload profile photo</p>
                  <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 10 MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          {/* 4. Official guide badge */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="flex items-center gap-2 text-xs font-black tracking-widest text-gray-400 uppercase">
              <Shield className="h-4 w-4" />
              Official Guide Badge
            </h3>
            <label className="${badgeUrl ? 'border-[#0b3a2c]' : 'border-gray-200 hover:bg-[#f7fdf9]'} relative flex h-32 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:border-[#0b3a2c]">
              {uploadingBadge && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0b3a2c]" />
                </div>
              )}
              {badgeUrl && !uploadingBadge && (
                <>
                  <img src={badgeUrl} alt="Badge" className="h-full w-full object-contain p-2" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setBadgeUrl("");
                    }}
                    className="absolute top-2 right-2 z-10 rounded-full bg-white p-1.5 shadow hover:bg-red-50"
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                </>
              )}
              {!badgeUrl && !uploadingBadge && (
                <div className="flex flex-col items-center gap-2 text-center">
                  <Shield className="h-7 w-7 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-500">Upload guide badge</p>
                  <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 10 MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleBadgeUpload}
              />
            </label>
            <div>
              <label className="text-sm font-bold text-gray-700">Guide badge code (optional)</label>
              <input
                type="text"
                value={form.guide_badge_code}
                onChange={(e) => setForm((p) => ({ ...p, guide_badge_code: e.target.value }))}
                placeholder="e.g. GD-2026-MA-0042"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm focus:bg-white focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
              />
            </div>
          </div>

          {/* 5. Languages */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    form.languages.includes(lang)
                      ? "bg-[#0b3a2c] text-white"
                      : "border border-gray-200 text-gray-600 hover:border-[#0b3a2c]"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Specialties */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">
              Specialties
            </h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SPECIALTIES.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleSpecialty(spec)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    form.specialties.includes(spec)
                      ? "bg-[#0b3a2c] text-white"
                      : "border border-gray-200 text-gray-600 hover:border-[#0b3a2c]"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Certifications */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">
              Certifications & Credentials
            </h3>

            {/* Existing certifications */}
            {form.certifications.length > 0 && (
              <ul className="space-y-2">
                {form.certifications.map((cert, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    <span className="text-sm text-gray-700">{cert}</span>
                    <button
                      type="button"
                      onClick={() => removeCertification(i)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Add new certification */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCertification(newCert);
                  }
                }}
                placeholder="e.g. Certified mountain guide — Morocco Ministry of Tourism"
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => addCertification(newCert)}
                className="rounded-xl bg-[#0b3a2c] px-4 py-3 text-white transition-all hover:bg-[#0f3d24]"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {CERTIFICATION_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => addCertification(sug)}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all hover:border-[#0b3a2c] hover:text-[#0b3a2c]"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b3a2c] py-4 text-base font-black text-white shadow-lg transition-all hover:bg-[#0f3d24] active:scale-95 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="h-5 w-5" />✓ Profile saved!
              </>
            ) : (
              "Save profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
