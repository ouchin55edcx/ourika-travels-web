import { unstable_cache } from "next/cache";
import { createSupabasePublicClient, createSupabaseServerClient } from "@/lib/supabase/server";

export type CachedCategoryOption = {
  id: string;
  name: string;
  description: string | null;
  photo: string | null;
  created_at?: string;
};

export type CachedTrekOption = {
  id: string;
  title: string;
  slug: string;
};

export type CachedGuideOption = {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  guide_order: number | null;
  specialties: string[] | null;
};

const getCachedCategoriesInternal = unstable_cache(
  async (): Promise<CachedCategoryOption[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, description, photo, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cached categories:", error);
      return [];
    }

    return data ?? [];
  },
  ["admin-cached-categories"],
  { revalidate: 60 },
);

const getCachedTrekOptionsInternal = unstable_cache(
  async (): Promise<CachedTrekOption[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("treks")
      .select("id, title, slug")
      .order("title", { ascending: true });

    if (error) {
      console.error("Error fetching cached trek options:", error);
      return [];
    }

    return data ?? [];
  },
  ["admin-cached-trek-options"],
  { revalidate: 60 },
);

const getCachedActiveGuidesInternal = unstable_cache(
  async (): Promise<CachedGuideOption[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, phone, avatar_url, guide_order, specialties")
      .eq("role", "guide")
      .eq("is_active", true)
      .order("guide_order", { ascending: true });

    if (error) {
      console.error("Error fetching cached active guides:", error);
      return [];
    }

    return data ?? [];
  },
  ["admin-cached-active-guides"],
  { revalidate: 60 },
);

export async function getCachedCategories() {
  return getCachedCategoriesInternal();
}

export async function getCachedTrekOptions() {
  return getCachedTrekOptionsInternal();
}

export async function getCachedActiveGuides() {
  return getCachedActiveGuidesInternal();
}
