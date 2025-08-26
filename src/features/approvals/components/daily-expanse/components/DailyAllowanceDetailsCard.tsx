import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import sampleReceipt from "@/assets/a320e87c6acd18eb34ccbfefbcddc062644af66a.png";
import { useAuthStore } from "@/stores/use-auth-store";
import { useEffect, useState } from "react";

export function DailyAllowanceDetailsCard({
  dailyAllowances = [],
  expenseSubType,
  dailyExpanse,
  onExpenseReviewAndApproval,
  onUpdateExpanseDetails,
}: DailyAllowanseDetailsProps) {
  const { user: currentUser } = useAuthStore();
  const [comments, setComments] = useState<Record<string, string>>({});

  if (!dailyAllowances.length) return null;

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
      return buildResult(true, lowerLevels, item.id);
    }

    // Case 4: Current user is a reviewer (at a level lower than the final approver)
    if (lowerLevels.some((lvl: any) => lvl.level === myLevel.level)) {
      const belowMe = levels.filter((lvl: any) => lvl.level < myLevel.level);
      return buildResult(false, belowMe, item.id);
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
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4 space-y-4">
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
            {allowance.dailyAllowancesDetails?.map((detail) => {
              const myReview = getReviewAndApproval(detail.id);
              const resultObj = gettingButtonText(detail);

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
                    <Detail label="Amount" value={`₹${detail.amount}`} />
                    <Detail
                      label="Category"
                      value={detail.expensesCategory?.categoryName || "-"}
                    />
                    <Detail label="Notes" value={detail.notes || "-"} />
                  </div>

                  <Separator className="mt-4 mb-2" />

                  <div className="flex flex-col items-center space-y-4 px-0 pt-2">
                    <div className="flex flex-wrap justify-center gap-4">
                      {(detail.receiptUrls || [sampleReceipt]).map(
                        (url, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center space-y-2"
                          >
                            <img
                              src={url}
                              alt={`Receipt ${index + 1}`}
                              className="w-40 h-40 rounded-md border shadow-sm object-cover bg-muted"
                            />
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">
                                  View Full Size
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl p-0 bg-white rounded-md shadow-lg overflow-hidden">
                                <div className="flex justify-center items-center p-4">
                                  <img
                                    src={url}
                                    alt={`Full Receipt ${index + 1}`}
                                    className="max-h-[80vh] max-w-full rounded-md object-contain mx-auto"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )
                      )}
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
                            disabled={resultObj.isDisable}
                            onClick={() =>
                              handleUpdateReview(
                                myReview.id,
                                "reviewed",
                                detail.id
                              )
                            }
                          >
                            Review Expense
                          </Button>
                          <Button
                            variant="destructive"
                            disabled={resultObj.isDisable}
                            onClick={() =>
                              handleUpdateReview(
                                myReview.id,
                                "rejected",
                                detail.id
                              )
                            }
                          >
                            Reject Expense
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="bg-green-600 text-white hover:bg-green-700 w-full"
                          onClick={() =>
                            handleUpdateReview(
                              myReview.id,
                              myReview.status,
                              detail.id
                            )
                          }
                        >
                          Update Review
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
                            disabled={resultObj.isDisable}
                            onClick={() =>
                              handleReviewAction(
                                allowance.dailyAllowanceId,
                                detail.id,
                                resultObj.status as any
                              )
                            }
                          >
                            {resultObj.buttonText} Expense
                          </Button>
                          <Button
                            variant="destructive"
                            disabled={resultObj.isDisable}
                            onClick={() =>
                              handleReviewAction(
                                allowance.dailyAllowanceId,
                                detail.id,
                                "rejected"
                              )
                            }
                          >
                            Reject Expense
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
