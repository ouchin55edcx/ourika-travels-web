import { getLatestApprovedReviews } from "@/app/actions/reviews";
import ReviewCard from "./ReviewCard";

export default async function Reviews() {
  const reviews = await getLatestApprovedReviews(6);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
      <div className="mb-12">
        <h2 className="text-4xl leading-[0.9] font-black tracking-tighter text-[#0a2e1a] md:text-5xl">
          What Our Travelers Say
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}
      </div>
    </section>
  );
}
