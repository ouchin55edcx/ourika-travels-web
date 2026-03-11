import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";

const categorySlugs = ["outdoors", "food", "culture", "water"] as const;

export function generateStaticParams() {
  return categorySlugs.map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!categorySlugs.includes(slug as (typeof categorySlugs)[number])) {
    notFound();
  }

  return <CategoryPageClient slug={slug} />;
}
