import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  setRating?: (rating: number) => void;
  error?: string;
  readOnly?: boolean;
}

export default function RatingStars({
  rating,
  setRating,
  error,
  readOnly = false,
}: RatingStarsProps) {
  return (
    <div className="space-y-1">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 transition ${
              star <= rating
                ? "fill-yellow-400 stroke-yellow-400"
                : "stroke-gray-300"
            } ${!readOnly ? "cursor-pointer hover:stroke-yellow-300" : ""}`}
            onClick={() => !readOnly && setRating?.(star)}
          />
        ))}
      </div>
      {error && !readOnly && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
