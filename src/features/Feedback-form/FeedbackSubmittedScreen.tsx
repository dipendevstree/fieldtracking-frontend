// src/features/Feedback-form/FeedbackSubmittedScreen.tsx
export default function FeedbackSubmittedScreen() {
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-6 shadow-md text-center">
      <h2 className="text-xl font-semibold text-green-700 mb-4">
        Feedback Already Submitted
      </h2>
      <p className="text-gray-600">
        You’ve already submitted feedback for this visit. Thank you!
      </p>
    </div>
  );
}
