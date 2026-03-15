import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/config';
import GuideProfileView from './GuideProfileView';
import GuideProfileEditor from './GuideProfileEditor';

export async function generateMetadata(): Promise<Metadata> {
  const user = await getCurrentUser();
  if (!user) return {};
  const name = user.full_name || 'Guide';
  const title = `${name} — Certified Local Guide | Ourika Travels`;
  const description = user.bio ||
    `${name} is a certified local guide based in Ourika Valley, Morocco. Book an authentic Atlas Mountains experience.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/guide/${user.id}`,
      images: user.avatar_url
        ? [{ url: user.avatar_url, width: 400, height: 400, alt: name }]
        : [],
    },
  };
}

export default async function GuideProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login?redirectTo=/dashboard/guide/profile');
  if (user.role !== 'guide') redirect('/profile');

  // Profile completeness score
  const fields = [
    !!user.full_name, !!user.phone, !!user.bio,
    !!user.avatar_url, !!user.location,
    (user.languages?.length ?? 0) > 0,
    (user.specialties?.length ?? 0) > 0,
    !!user.years_experience,
    (user.certifications?.length ?? 0) > 0,
    !!user.guide_badge_code || !!user.badge_image_url,
  ];
  const completeness = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );

  return (
    <div className="space-y-8">
      <GuideProfileView user={user} completeness={completeness} />
      <GuideProfileEditor user={user} />
    </div>
  );
}

