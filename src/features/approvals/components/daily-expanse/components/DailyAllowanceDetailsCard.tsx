import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Detail } from "@/components/ui/detail";
import { format } from "date-fns";
import {
  DailyAllowanseDetailsProps,
  DailyAllowanceDetail,
} from "@/features/approvals/type/type";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  IconFileWord,
  IconFileTypePdf,
  IconFileTypeXls,
  IconFileSpreadsheet,
  IconArchive,
  IconJson,
  IconFile,
} from "@tabler/icons-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useEffect, useState } from "react";
import { isImage } from "@/utils/commonFunction";
import { FileDown, Loader2 } from "lucide-react";

export function DailyAllowanceDetailsCard({
  dailyAllowances = [],
  expenseSubType,
  dailyExpanse,
  onExpenseReviewAndApproval,
  onUpdateExpanseDetails,
  loadingIds = {},
  updatingReviewKeys = {},
}: DailyAllowanseDetailsProps & {
  loadingIds?: Record<string, boolean>;
  updatingReviewKeys?: Record<string, boolean>;
}) {
  const { user: currentUser } = useAuthStore();
  const [comments, setComments] = useState<Record<string, string>>({});

  if (!dailyAllowances.length) return null;

  const getFileIcon = (file: string) => {
    const ext = file.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <IconFileTypePdf className="h-12 w-12 text-red-600" />;
      case "doc":
      case "docx":
        return <IconFileWord className="h-12 w-12 text-blue-600" />;
      case "xls":
      case "xlsx":
        return <IconFileTypeXls className="h-12 w-12 text-green-600" />;
      case "csv":
        return <IconFileSpreadsheet className="h-12 w-12 text-emerald-600" />;
      case "zip":
      case "rar":
        return <IconArchive className="h-12 w-12 text-yellow-600" />;
      case "js":
      case "ts":
      case "json":
        return <IconJson className="h-12 w-12 text-purple-600" />;
      default:
        return <IconFile className="h-12 w-12 text-gray-600" />;
    }
  };

  // Prefill comments from existing reviews
  useEffect(() => {
    if (dailyExpanse?.expenseReviewAndApproval) {
      const initialComments: Record<string, string> = {};
      dailyAllowances.forEach((allowance) => {
        allowance.dailyAllowancesDetails?.forEach((detail) => {
          const existingReview = dailyExpanse.expenseReviewAndApproval.find(
            (review: any) =>
              review.reviewerUserId === currentUser?.id &&
              review.dailyAllowanceDetailsId === detail.id
          );
          if (existingReview?.comment) {
            initialComments[detail.id] = existingReview.comment;
          }
        });
      });
      setComments(initialComments);
    }
  }, [
    dailyExpanse?.expenseReviewAndApproval,
    dailyAllowances,
    currentUser?.id,
  ]);

  const handleChangeComment = (id: string, value: string) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  const getReviewAndApproval = (id: string) =>
    dailyExpanse?.expenseReviewAndApproval.find(
      (b: any) =>
        b.reviewerUserId === currentUser?.id && b.dailyAllowanceDetailsId === id
    );

  const gettingButtonText = (item: DailyAllowanceDetail) => {
    const REASON_BELOW = "Lower-level reviewers must review before you.";
    const REASON_MISMATCH = "This expense does not match your approval level.";

    const base = {
      buttonText: "Review",
      isDisable: false,
      reason: "",
      status: "reviewed" as "reviewed" | "approved",
      warningMessageForAmount: "",
    };

    // Filter levels specific to the item's category
    const levels =
      (dailyExpanse?.expensesLevels || []).filter(
        (lvl: any) => lvl.expensesCategoryId == item.expensesCategoryId
      ) || [];

    const me = currentUser?.id;

    // 🟢 Case 1: No levels → only default approver
    if (!levels.length) {
      // If you have a "system default approver" (like AdminId)
      const firstLevelUserId = [...(dailyExpanse?.expensesLevels || [])].sort(
        (a, b) => a.level - b.level
      )[0]?.userId;

      if (me === firstLevelUserId) {
        return { ...base, buttonText: "Approve", status: "approved" };
      }

      return { ...base, isDisable: true, reason: REASON_MISMATCH };
    }

    // Case 2: Determine the required approval level based on the amount
    const approvalLevel =
      levels.find(
        (lvl: any) =>
          lvl.minAmount <= item.amount && lvl.maxAmount >= item.amount
      ) || [...levels].sort((a: any, b: any) => b.level - a.level)[0]; // Fallback to the highest level

    const myLevel = levels.find((lvl: any) => lvl.userId === me);
    if (!myLevel) return { ...base, isDisable: true, reason: REASON_MISMATCH };

    if (myLevel) {
      if (Number(dailyExpanse?.totalAmount) > myLevel.maxAmount) {
        base.warningMessageForAmount = `Max Allowed Limit is ${currentUser?.organization?.currency || "₹"}${myLevel.maxAmount}`;
      }
    }
    // Find all levels that must review before the target approval level
    const lowerLevels = levels.filter(
      (lvl: any) => lvl.level < approvalLevel.level
    );

    // Helper to check if all required reviewers have reviewed THIS SPECIFIC item
    const allReviewed = (lvls: any[], detailId: string) =>
      lvls.every((lvl: any) =>
        (dailyExpanse?.expenseReviewAndApproval || []).some(
          (rev: any) =>
            rev.reviewerUserId === lvl.userId &&
            rev.status === "reviewed" &&
            rev.dailyAllowanceDetailsId === detailId // Check against specific detail ID
        )
      );

    // Helper to build the final result object
    const buildResult = (
      isApprover: boolean,
      blockers: any[],
      detailId: string
    ) => {
      const ready = !blockers.length || allReviewed(blockers, detailId);
      return {
        buttonText: isApprover ? "Approve" : "Review",
        status: (isApprover ? "approved" : "reviewed") as
          | "approved"
          | "reviewed",
        isDisable: !ready,
        reason: ready ? "" : REASON_BELOW,
      };
    };

    // Case 3: Current user IS the designated approver for this amount
    if (approvalLevel.userId === myLevel.userId) {
      return { ...base, ...buildResult(true, lowerLevels, item.id) };
    }

    // Case 4: Current user is a reviewer (at a level lower than the final approver)
    if (lowerLevels.some((lvl: any) => lvl.level === myLevel.level)) {
      const belowMe = levels.filter((lvl: any) => lvl.level < myLevel.level);
      return { ...base, ...buildResult(false, belowMe, item.id) };
    }

    // Case 5: User is in the hierarchy but not the approver or a required reviewer
    return { ...base, isDisable: true, reason: REASON_MISMATCH };
  };

  const handleReviewAction = (
    dailyAllowanceId: string,
    dailyAllowanceDetailsId: string,
    status: "approved" | "rejected" | "reviewed"
  ) => {
    onExpenseReviewAndApproval({
      dailyAllowanceId,
      dailyAllowanceDetailsId,
      status,
      comment: comments[dailyAllowanceDetailsId] ?? "",
    });
  };

  const handleUpdateReview = (
    id: string,
    status: "approved" | "rejected" | "reviewed",
    commentId: string
  ) => {
    onUpdateExpanseDetails({
      id,
      status,
      comment: comments[commentId],
    });
  };

  return (
    <div className="pr-4 space-y-4">
      {dailyAllowances.map((allowance, i) => (
        <Card
          key={allowance.dailyAllowanceId}
          className="border shadow-sm mb-4"
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              {expenseSubType === "daily_outstation"
                ? `Outstation Day ${i + 1}`
                : "Daily Allowance"}
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 text-sm">
            {!allowance.dailyAllowancesDetails?.length ? (
              <div className="text-center text-sm text-gray-500 py-6 border rounded-md">
                No expense available for this day
              </div>
            ) : (
              allowance.dailyAllowancesDetails.map((detail: any) => {
                const myReview = getReviewAndApproval(detail.id);
                const resultObj = gettingButtonText(detail);

                // ✅ loader keys
                const approveKey = `${detail.id}-${resultObj?.status}`;
                const rejectKey = `${detail.id}-rejected`;
                const isProcessingApprove = loadingIds[approveKey] ?? false;
                const isProcessingReject = loadingIds[rejectKey] ?? false;
                const isUpdatingApprove =
                  myReview?.id &&
                  updatingReviewKeys?.[`${myReview.id}-reviewed`];
                const isUpdatingReject =
                  myReview?.id &&
                  updatingReviewKeys?.[`${myReview.id}-rejected`];

                return (
                  <div key={detail.id} className="border p-4 rounded-md mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Detail
                        label="Date"
                        value={format(
                          new Date(detail.expensesDate),
                          "dd-MM-yyyy"
                        )}
                      />
                      <Detail
                        label="Amount"
                        value={
                          <p>
                            {currentUser?.organization?.currency || "₹"}
                            {detail.amount}{" "}
                            {resultObj?.warningMessageForAmount ? (
                              <span className="text-red-500">
                                ({resultObj?.warningMessageForAmount})
                              </span>
                            ) : (
                              ``
                            )}
                          </p>
                        }
                      />
                      <Detail
                        label="Category"
                        value={detail.expensesCategory?.categoryName || "-"}
                      />
                      <Detail label="Notes" value={detail.notes || "-"} />
                    </div>

                    <Separator className="mt-4 mb-2" />

                    <div className="flex flex-col items-center space-y-4 pt-2">
                      {/* files */}
                      <div className="grid grid-cols-3 gap-3 w-full">
                        {detail.filesUrl?.length > 0 &&
                          detail.filesUrl.map((file: string, idx: number) => {
                            if (isImage(file)) {
                              // 🖼️ Image Preview
                              return (
                                <Dialog key={idx}>
                                  <DialogTrigger asChild>
                                    <img
                                      src={file}
                                      alt={`Receipt ${idx + 1}`}
                                      className="h-28 w-full cursor-pointer rounded border object-cover"
                                    />
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl p-0">
                                    <img
                                      src={file}
                                      alt={`Receipt Full ${idx + 1}`}
                                      className="h-auto w-full rounded"
                                    />
                                  </DialogContent>
                                </Dialog>
                              );
                            } else {
                              // 📄 Non-image → Icon + Download Button
                              return (
                                <div
                                  key={idx}
                                  className="flex flex-col items-center justify-between h-28 w-full rounded border bg-gray-50 p-2"
                                >
                                  <div className="flex-1 flex items-center justify-center">
                                    {getFileIcon(file)}
                                  </div>
                                  <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-2"
                                  >
                                    <a
                                      href={file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FileDown className="h-4 w-4 mr-1" />{" "}
                                      Download
                                    </a>
                                  </Button>
                                </div>
                              );
                            }
                          })}
                      </div>

                      <Textarea
                        placeholder="Add Comment (Optional)"
                        value={comments[detail.id] ?? ""}
                        onChange={(e) =>
                          handleChangeComment(detail.id, e.target.value)
                        }
                      />

                      {myReview ? (
                        myReview.status === "rejected" ? (
                          <div className="grid w-full grid-cols-2 gap-2">
                            <Button
                              className="bg-green-600 text-white hover:bg-green-700"
                              disabled={
                                resultObj.isDisable || isUpdatingApprove
                              }
                              onClick={() =>
                                handleUpdateReview(
                                  myReview.id,
                                  "reviewed",
                                  detail.id
                                )
                              }
                            >
                              {isUpdatingApprove ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Processing...
                                </>
                              ) : (
                                "Review Expense"
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              disabled={resultObj.isDisable || isUpdatingReject}
                              onClick={() =>
                                handleUpdateReview(
                                  myReview.id,
                                  "rejected",
                                  detail.id
                                )
                              }
                            >
                              {isUpdatingReject ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Processing...
                                </>
                              ) : (
                                "Reject Expense"
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="bg-green-600 text-white hover:bg-green-700 w-full"
                            disabled={resultObj.isDisable || isUpdatingApprove}
                            onClick={() =>
                              handleUpdateReview(
                                myReview.id,
                                myReview.status,
                                detail.id
                              )
                            }
                          >
                            {isUpdatingApprove ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Updating...
                              </>
                            ) : (
                              "Update Review"
                            )}
                          </Button>
                        )
                      ) : (
                        <>
                          {resultObj.reason && (
                            <p className="text-red-600 text-sm text-center">
                              {resultObj.reason}
                            </p>
                          )}
                          <div className="grid w-full grid-cols-2 gap-2">
                            <Button
                              className="bg-green-600 text-white hover:bg-green-700"
                              disabled={
                                resultObj.isDisable || isProcessingApprove
                              }
                              onClick={() =>
                                handleReviewAction(
                                  allowance.dailyAllowanceId,
                                  detail.id,
                                  resultObj.status as any
                                )
                              }
                            >
                              {isProcessingApprove ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Processing...
                                </>
                              ) : (
                                resultObj.buttonText
                              )}
                              Expense
                            </Button>
                            <Button
                              variant="destructive"
                              disabled={
                                resultObj.isDisable || isProcessingReject
                              }
                              onClick={() =>
                                handleReviewAction(
                                  allowance.dailyAllowanceId,
                                  detail.id,
                                  "rejected"
                                )
                              }
                            >
                              {isProcessingReject ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Processing...
                                </>
                              ) : (
                                "Reject Expense"
                              )}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
