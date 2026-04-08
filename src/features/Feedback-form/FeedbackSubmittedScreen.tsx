import { CheckCircle } from "lucide-react";
import RatingStars from "./components/RatingStars";

interface FeedbackSubmittedScreenProps {
  data?: {
    behaviorRating: number;
    punctualityRating: number;
    knowledgeRating: number;
    comments: string;
  };
}

export default function FeedbackSubmittedScreen({
  data,
}: FeedbackSubmittedScreenProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 rounded-full bg-green-100 p-6 animate-in zoom-in duration-300">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>

      <h2 className="mb-2 text-3xl font-bold text-gray-900">Thank You!</h2>
      <p className="mb-8 text-lg text-gray-600">
        Your feedback has been submitted successfully.
      </p>

      {/* Summary Card */}
      {data && (
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-left shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="mb-6 text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
            Your Feedback Summary
          </h3>

          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold text-gray-700">Behavior</span>
              <RatingStars rating={data.behaviorRating} readOnly />
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold text-gray-700">Punctuality</span>
              <RatingStars rating={data.punctualityRating} readOnly />
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold text-gray-700">
                Skills & Knowledge
              </span>
              <RatingStars rating={data.knowledgeRating} readOnly />
            </div>

            <div className="mt-4">
              <span className="block font-semibold text-gray-700 mb-2">
                Your Comments
              </span>
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 border border-gray-100 italic">
                {data.comments ? (
                  `"${data.comments}"`
                ) : (
                  <span className="text-gray-400 not-italic">
                    No comments provided.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
