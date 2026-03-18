import { getLatestApprovedReviews } from "@/app/actions/reviews";
import ReviewCard from "./ReviewCard";

export default async function Reviews() {
  const reviews = await getLatestApprovedReviews(6);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}
      </div>
    </section>
  );
}
