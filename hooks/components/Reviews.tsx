import { getLatestApprovedReviews } from "@/app/actions/reviews";
import ReviewCard from "./ReviewCard";

export default async function Reviews() {
  const reviews = await getLatestApprovedReviews(6);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="mt-16 ml-2 w-full md:mx-auto md:mt-16 md:max-w-7xl md:px-6 md:py-24 md:py-32">
      <div className="mb-6 pr-4 md:mb-12">
        <h2 className="text-2xl leading-[0.9] font-black tracking-tighter text-[#0a2e1a] md:text-5xl">
          What Our Travelers Say
        </h2>
      </div>
      <div className="hide-scrollbar -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-8 md:grid md:grid-cols-3 md:gap-8 md:px-0 md:pb-0">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} mobileScroll />
        ))}
      </div>
    </section>
  );
}
