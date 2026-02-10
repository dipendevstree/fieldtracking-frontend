import { useState, useMemo } from "react";
import { Main } from "@/components/layout/main";
import { useSearch } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
import { useGetVisitByID } from "../calendar/services/calendar-view.hook";
import { feedbackFormSchema } from "./data/schema";
import { useUpdateVisitFeedBack } from "./services/feedbakckformhook";
import FeedbackSubmittedScreen from "./FeedbackSubmittedScreen";
import { format } from "date-fns";
import RatingStars from "./components/RatingStars";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormValues {
  behaviorRating: number;
  punctualityRating: number;
  knowledgeRating: number;
  comments: string;
}

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const { token } = useSearch({ strict: false });

  const {
    control,
    handleSubmit,
    register,
    getValues,
    watch,
    formState: { errors, isSubmitting: isLocalSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(feedbackFormSchema) as any,
    defaultValues: {
      behaviorRating: 0,
      punctualityRating: 0,
      knowledgeRating: 0,
      comments: "",
    },
  });

  const commentsValue = watch("comments") || "";

  const decoded: { visitId: string; schema: string } = useMemo(() => {
    try {
      return jwtDecode(token || "") as any;
    } catch {
      return {};
    }
  }, [token]);

  const visitId = decoded?.visitId;
  const schemaName = decoded?.schema || "";

  const { data: visitData, isLoading } = useGetVisitByID(
    visitId || "",
    true,
    token,
  );

  const handleSuccess = () => {
    setSubmitted(true);
  };

  const { mutate: UpdateVisitFeedBack, isPending: isUpdateLoading } =
    useUpdateVisitFeedBack(visitId || "", token, handleSuccess);

  const onSubmit = (data: FormValues) => {
    const feedbackPayload = {
      feedBackSalesRepBehaviorRating: data.behaviorRating,
      feedBackSalesRepPunctualityRating: data.punctualityRating,
      feedBackSalesSkillsAndKnowledgeRating: data.knowledgeRating,
      feedBackDescription: data.comments?.trim(),
      feedBackStatus: true,
      schemaName: schemaName,
    };

    UpdateVisitFeedBack(feedbackPayload);
  };

  if (isLoading) {
    return (
      <Main>
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-gray-500">Loading visit details...</p>
        </div>
      </Main>
    );
  }

  const isAlreadySubmitted = submitted || visitData?.feedBackStatus === true;

  if (isAlreadySubmitted) {
    const values = getValues();
    const displayData = submitted
      ? {
          behaviorRating: values.behaviorRating,
          punctualityRating: values.punctualityRating,
          knowledgeRating: values.knowledgeRating,
          comments: values.comments,
        }
      : {
          behaviorRating: visitData?.feedBackSalesRepBehaviorRating || 0,
          punctualityRating: visitData?.feedBackSalesRepPunctualityRating || 0,
          knowledgeRating:
            visitData?.feedBackSalesSkillsAndKnowledgeRating || 0,
          comments: visitData?.feedBackDescription || "",
        };

    return <FeedbackSubmittedScreen data={displayData} />;
  }

  const ratingCategories = [
    {
      name: "behaviorRating" as const,
      label: "Sales Rep Behavior",
    },
    {
      name: "punctualityRating" as const,
      label: "Punctuality",
    },
    {
      name: "knowledgeRating" as const,
      label: "Skills and Knowledge",
    },
  ];

  const isPending = isLocalSubmitting || isUpdateLoading;

  return (
    <Main>
      <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-6 shadow-md border border-gray-100">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Please provide your valuable feedback for the following meeting:
        </h2>

        <div className="space-y-2 mb-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          <p>
            Sales Rep:{" "}
            <span className="font-semibold">
              {visitData?.salesRepresentativeUser
                ? `${visitData.salesRepresentativeUser.firstName} ${visitData.salesRepresentativeUser.lastName}`
                : "N/A"}
            </span>
          </p>
          <p>
            Meeting Date:{" "}
            <span className="font-semibold">
              {visitData?.date ? (
                <>
                  {format(new Date(visitData.date), "dd-MM-yyyy")}
                  {visitData?.time && `, ${visitData.time}`}
                </>
              ) : (
                "N/A"
              )}
            </span>
          </p>
          <p>
            Customer:{" "}
            <span className="font-semibold">
              {visitData?.customer?.companyName || "N/A"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {ratingCategories.map((cat) => (
            <div key={cat.name}>
              <label className="mb-2 block font-medium text-gray-700">
                {cat.label} <span className="text-red-500">*</span>
              </label>
              <Controller
                name={cat.name}
                control={control}
                render={({ field }) => (
                  <RatingStars
                    rating={field.value}
                    setRating={field.onChange}
                    error={errors[cat.name]?.message}
                  />
                )}
              />
            </div>
          ))}

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Describe your experience{" "}
              <span className="text-xs text-gray-400 font-normal ml-1">
                (Optional)
              </span>
            </label>
            <textarea
              {...register("comments")}
              className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition ${
                errors.comments
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
              placeholder="Please share your experience with the sales representative..."
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between">
              {errors.comments && (
                <p className="text-sm text-red-600">
                  {errors.comments.message}
                </p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {commentsValue.length}/500 characters
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full rounded-lg py-3 font-semibold text-white shadow-sm transition ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-black/80 active:scale-[0.98]"
            }`}
          >
            {isPending ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </Main>
  );
}
