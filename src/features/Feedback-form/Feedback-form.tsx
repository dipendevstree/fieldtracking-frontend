import { useState } from "react";
import { Star } from "lucide-react";
import { Main } from "@/components/layout/main";
import { useSearch } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
import { useGetVisitByID } from "../calendar/services/calendar-view.hook";
import { z } from "zod";
import { feedbackFormSchema, TFeedbackFormSchema } from "./data/schema";
import { useUpdateVisitFeedBack } from "./services/feedbakckformhook";
import FeedbackSubmittedScreen from "./FeedbackSubmittedScreen";
import { format } from "date-fns";

interface ValidationErrors {
  behaviorRating?: string;
  punctualityRating?: string;
  knowledgeRating?: string;
  comments?: string;
}

export default function FeedbackForm() {
  const [behaviorRating, setBehaviorRating] = useState(0);
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [knowledgeRating, setKnowledgeRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useSearch({ strict: false });

  const decoded: { visitId: string; schema: string } = jwtDecode(
    token || ""
  ) as any;

  const visitId = decoded?.visitId;
  const schemaName = decoded?.schema || "";
  const { data: visitData, isLoading } = useGetVisitByID(
    visitId || "",
    true,
    token
  );

  const onSuccess = () => {
    setSubmitted(true);
    setIsSubmitting(false);
    // Reset form after successful submission
    setBehaviorRating(0);
    setPunctualityRating(0);
    setKnowledgeRating(0);
    setComments("");
    setErrors({});
  };

  const { mutate: UpdateVisitFeedBack, isPending: isUpdateLoading } =
    useUpdateVisitFeedBack(visitId || "", token, onSuccess);

  const validateForm = (): boolean => {
    try {
      const formData: TFeedbackFormSchema = {
        behaviorRating,
        punctualityRating,
        knowledgeRating,
        comments,
        visitId: visitId || undefined,
        submittedAt: new Date(),
      };

      // Validate using Zod schema
      feedbackFormSchema.parse(formData);

      // Clear errors if validation passes
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors = {};

        error.errors.forEach((err) => {
          const field = err.path[0] as keyof ValidationErrors;
          if (field && typeof field === "string") {
            newErrors[field] = err.message;
          }
        });

        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare feedback payload with validated data
    // const validatedData: any = {
    //   feedBackSalesRepBehaviorRating: behaviorRating,
    //   feedBackSalesRepPunctualityRating: punctualityRating,
    //   feedBackSalesSkillsAndKnowledgeRating: knowledgeRating,
    //   feedBackDescription: comments.trim(),
    // };

    const feedbackPayload = {
      feedBackSalesRepBehaviorRating: behaviorRating,
      feedBackSalesRepPunctualityRating: punctualityRating,
      feedBackSalesSkillsAndKnowledgeRating: knowledgeRating,
      feedBackDescription: comments.trim(),
      feedBackStatus: true, // Example: update visit status
      schemaName: schemaName,
    };

    UpdateVisitFeedBack(feedbackPayload);
  };

  const renderStars = (
    rating: number,
    setRating: (rating: number) => void,
    error?: string
  ) => {
    return (
      <div className="space-y-1">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 cursor-pointer transition ${
                star <= rating
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "stroke-gray-300 hover:stroke-yellow-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  if (!isLoading) {
    if (
      visitData?.feedBackStatus != null ||
      visitData?.feedBackStatus == true
    ) {
      return <FeedbackSubmittedScreen />;
    } else {
      return (
        <Main>
          <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">
              Please provide your valuable feedback for the following meeting:
            </h2>

            <div className="mb-2 text-sm text-gray-700">
              Sales Rep:{" "}
              <span className="font-medium">
                {visitData?.salesRepresentativeUser?.firstName +
                  " " +
                  visitData?.salesRepresentativeUser?.lastName || "N/A"}
              </span>
            </div>

            <div className="mb-2 text-sm text-gray-700">
              Meeting Date:{" "}
              <span className="font-medium">
                {visitData?.date ? (
                  <>
                    {format(new Date(visitData.date), "dd-MM-yyyy")}
                    {visitData?.time && `, ${visitData.time}`}
                  </>
                ) : (
                  "N/A"
                )}
              </span>
            </div>

            <div className="mb-2 text-sm text-gray-700">
              Meeting Time:{" "}
              <span className="font-medium">{visitData?.time || "N/A"}</span>
            </div>

            <div className="mb-4 text-sm text-gray-700">
              Customer Contact:{" "}
              <span className="font-medium">
                {visitData?.customer?.companyName || "N/A"}
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-1 block font-medium">
                  Sales Rep Behavior <span className="text-red-500">*</span>
                </label>
                {renderStars(
                  behaviorRating,
                  setBehaviorRating,
                  errors.behaviorRating
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block font-medium">
                  Punctuality <span className="text-red-500">*</span>
                </label>
                {renderStars(
                  punctualityRating,
                  setPunctualityRating,
                  errors.punctualityRating
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block font-medium">
                  Skills and Knowledge <span className="text-red-500">*</span>
                </label>
                {renderStars(
                  knowledgeRating,
                  setKnowledgeRating,
                  errors.knowledgeRating
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block font-medium">
                  Describe your experience{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 ${
                    errors.comments
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Please share your experience with the sales representative..."
                  rows={4}
                  maxLength={500}
                />
                <div className="mt-1 flex justify-between">
                  {errors.comments && (
                    <p className="text-sm text-red-600">{errors.comments}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {comments.length}/500 characters
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isUpdateLoading}
                className={`w-full rounded-lg py-2 text-white transition ${
                  isSubmitting || isUpdateLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting || isUpdateLoading
                  ? "Submitting..."
                  : "Submit Feedback"}
              </button>
            </form>

            {submitted && (
              <div className="mt-4 rounded-lg bg-green-100 p-3 text-green-700">
                <div className="flex items-center">
                  <div className="mr-2">✓</div>
                  <div>
                    <p className="font-medium">Thank you for your feedback!</p>
                    <p className="text-sm">
                      Your feedback has been submitted successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Display any submission errors */}
            {!submitted && Object.keys(errors).length > 0 && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">
                <p className="text-sm font-medium">
                  Please fix the following errors:
                </p>
                <ul className="mt-1 text-sm list-disc list-inside">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Main>
      );
    }
  }
}
