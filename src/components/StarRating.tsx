import { Star, StarHalf, Star as StarOutline } from "lucide-react";

interface StarRatingProps {
  rating: number; // Accepts values like 3.5, 4, etc.
  outOf?: number; // Defaults to 5
}

export default function StarRating({ rating, outOf = 5 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = outOf - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-black max-sm:text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" stroke="none" className="w-5 h-5 max-sm:h-4 max-sm:w-4" />
      ))}

      {hasHalfStar && (
        <StarHalf key="half" className="w-5 h-5 max-sm:h-4 max-sm:w-4" />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <StarOutline key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  );
}
