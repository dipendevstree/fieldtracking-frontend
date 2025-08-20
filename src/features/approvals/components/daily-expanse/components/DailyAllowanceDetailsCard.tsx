import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Detail } from "@/components/ui/detail";
import { format } from "date-fns";
import { DailyAllowanseDetailsProps } from "@/features/approvals/type/type";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import sampleReceipt from "@/assets/a320e87c6acd18eb34ccbfefbcddc062644af66a.png";
import { useAuthStore } from "@/stores/use-auth-store";
import { useEffect, useState } from "react";

export function DailyAllowanceDetailsCard({
  dailyAllowances = [],
  expenseSubType,
  isApprovalLevel,
  dailyExpanse,
  onExpenseReviewAndApproval,
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

  const isButtonDisabled = (id: string) => {
    if (dailyExpanse?.getThisUserLevel === "defult") return false;

    const defaultApproval = dailyExpanse?.expenseReviewAndApproval.find(
      (b: any) =>
        b.reviewerUserId === dailyExpanse?.defaultApprovalUser?.id &&
        b.dailyAllowanceDetailsId === id
    );

    const belowLevels =
      dailyExpanse?.expensesLevels?.filter(
        (f: any) => f?.level < (dailyExpanse?.getThisUserLevel ?? 0)
      ) || [];

    const approvedBelowLevels = belowLevels.filter((level: any) =>
      dailyExpanse?.expenseReviewAndApproval.some(
        (b: any) =>
          b.reviewerUserId === level.userId && b.dailyAllowanceDetailsId === id
      )
    );

    return !(
      defaultApproval && approvedBelowLevels.length === belowLevels.length
    );
  };

  const handleReviewAction = (
    dailyAllowanceId: string,
    dailyAllowanceDetailsId: string,
    status: "approved" | "rejected" | "reviewed"
  ) => {
    onExpenseReviewAndApproval({
      dailyAllowanceId,
      dailyAllowanceDetailsId,
      status: isApprovalLevel && status === "reviewed" ? "approved" : status,
      comment: comments[dailyAllowanceDetailsId] ?? "",
    });
  };

  const handleUpdateReview = (item: any) => {
    console.log("update review", item);
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
              {/* <StatusBadge status={allowance.status} /> */}
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 text-sm">
            {allowance.dailyAllowancesDetails?.map((detail) => {
              const myReview = getReviewAndApproval(detail.id);
              const isDisabled = isButtonDisabled(detail.id);

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
                      <Button
                        className="bg-green-600 text-white hover:bg-green-700 w-full"
                        onClick={() => handleUpdateReview(myReview)}
                      >
                        Update Review
                      </Button>
                    ) : (
                      <div className="grid w-full grid-cols-2 gap-2">
                        <Button
                          className="bg-green-600 text-white hover:bg-green-700"
                          disabled={isDisabled}
                          onClick={() =>
                            handleReviewAction(
                              allowance.dailyAllowanceId,
                              detail.id,
                              isApprovalLevel ? "approved" : "reviewed"
                            )
                          }
                        >
                          {isApprovalLevel
                            ? "Approve Expense"
                            : "Review Expense"}
                        </Button>
                        <Button
                          variant="destructive"
                          disabled={isDisabled}
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
