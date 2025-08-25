import { format } from "date-fns";
import sampleReceipt from "@/assets/a320e87c6acd18eb34ccbfefbcddc062644af66a.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Detail } from "@/components/ui/detail";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  TravelLumpSum,
  TravelExpanseDetailsProps,
  TravelRoute,
} from "@/features/approvals/type/type";

export function ExpenseDetailsSideCard({
  expenseSubType,
  travelLumpSums = [],
  travelRoutes = [],
  isApprovalLevel,
  dailyExpanse,
  onExpenseReviewAndApproval,
  onUpdateExpanseDetails,
}: TravelExpanseDetailsProps) {
  const isLumpSum = expenseSubType === "travel_lump_sum";
  const entries = isLumpSum ? travelLumpSums : travelRoutes;
  const { user: currentUser } = useAuthStore();
  const [comments, setComments] = useState<Record<string, string>>({});

  // Pre-fill comments from existing reviews when data changes
  useEffect(() => {
    if (dailyExpanse?.expenseReviewAndApproval) {
      const initialComments: Record<string, string> = {};

      entries.forEach((item) => {
        const id = isLumpSum
          ? (item as TravelLumpSum).travelLumpSumId
          : (item as TravelRoute).travelRouteId;

        const existingReview = dailyExpanse.expenseReviewAndApproval.find(
          (review: any) =>
            review.reviewerUserId === currentUser?.id &&
            (isLumpSum
              ? review.travelLumpSumId === id
              : review.travelRouteId === id)
        );

        if (existingReview?.comment) {
          initialComments[id] = existingReview.comment;
        }
      });

      setComments(initialComments);
    }
  }, [
    dailyExpanse?.expenseReviewAndApproval,
    entries,
    isLumpSum,
    currentUser?.id,
  ]);

  const handleChangeComment = (id: string, value: string) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  const getReviewAndApproval = (id: string) =>
    dailyExpanse?.expenseReviewAndApproval.find(
      (b: any) =>
        b.reviewerUserId === currentUser?.id &&
        (isLumpSum ? b.travelLumpSumId === id : b.travelRouteId === id)
    );
  // backup
  const getingButtonText = (item: any) => {
    let obj = {
      buttonText: "Review",
      isDisable: false,
      reason: "",
      status: "reviewed",
    };
    // step 1 findfist this category relatd level
    let levels = dailyExpanse.expensesLevels.filter(
      (h: any) => h.expensesCategoryId == item.expensesCategoryId
    );

    if (levels.length) {
      let findApprovalLevel = levels.find((v: any) => {
        return v.minAmount <= item.amount && v.maxAmount >= item.amount;
      });

      if (findApprovalLevel) {
        let lowerLevels = levels
          .filter((r: any) => r.level < findApprovalLevel.level)
          .sort((a: any, b: any) => a.level - b.level);

        let getCurrentUserLevel = levels.find(
          (z: any) => z.userId == currentUser?.id
        );
        console.log("lowerLevels", lowerLevels, getCurrentUserLevel);
        if (getCurrentUserLevel) {
          let checkMyLvelIsLowerOrApproval = lowerLevels.find(
            (z: any) => z.level == getCurrentUserLevel?.level
          );
          if (checkMyLvelIsLowerOrApproval) {
            // Step: get all levels below the current user's level
            const myLowerLevels = levels
              .filter((lvl: any) => lvl.level < getCurrentUserLevel.level)
              .sort((a: any, b: any) => a.level - b.level);

            // Check if all of them have reviewed
            const allReviewed = myLowerLevels.every((lvl: any) =>
              dailyExpanse?.expenseReviewAndApproval.some(
                (rev: any) =>
                  rev.reviewerUserId === lvl.userId && rev.status === "reviewed"
              )
            );

            obj["buttonText"] = "Review";
            obj["status"] = "reviewed";

            // If I am the first level (no one below me), or all my lower levels reviewed → enable
            if (myLowerLevels.length === 0 || allReviewed) {
              obj["isDisable"] = false;
            } else {
              obj["isDisable"] = true;
              obj["reason"] = "Lower-level reviewers must review before you.";
            }
          } else {
            if (findApprovalLevel?.userId == currentUser?.id) {
              // Step: get all levels below the current user's level
              // Check if all of them have reviewed
              const allReviewed = lowerLevels.every((lvl: any) =>
                dailyExpanse?.expenseReviewAndApproval.some(
                  (rev: any) =>
                    rev.reviewerUserId === lvl.userId &&
                    rev.status === "reviewed"
                )
              );

              obj["buttonText"] = "Approve";
              obj["status"] = "approved";
              // If I am the first level (no one below me), or all my lower levels reviewed → enable
              if (allReviewed) {
                obj["isDisable"] = false;
              } else {
                obj["isDisable"] = true;
                obj["reason"] = "Lower-level reviewers must review before you.";
              }
            } else {
              obj["buttonText"] = "Review";
              obj["isDisable"] = true;
              obj["reason"] =
                "This expense does not match your approval level.";
            }
          }
        } else {
          obj["buttonText"] = "Review";
          obj["isDisable"] = true;
          obj["reason"] = "This expense does not match your approval level.";
        }
      } else {
        obj["buttonText"] = "Review";
        obj["isDisable"] = true;
        obj["reason"] = "This expense does not match your approval level.";
      }
    }
    return obj;
  };

  const handleReviewAction = (id: string, status: any) => {
    onExpenseReviewAndApproval({
      parentId: id,
      status: status,
      comment: comments[id] ?? "",
    });
  };

  const handleUpdateReview = (
    id: string,
    status: "approved" | "rejected" | "reviewed",
    commentId: string
  ) => {
    onUpdateExpanseDetails({
      id,
      status: isApprovalLevel && status === "reviewed" ? "approved" : status,
      comment: comments[commentId] ?? "",
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] space-y-4 pr-4">
      {entries.map((item: any, idx) => {
        const id = isLumpSum
          ? (item as TravelLumpSum).travelLumpSumId
          : (item as TravelRoute).travelRouteId;
        const myReview = getReviewAndApproval(id);
        const resultObj = getingButtonText(item);
        return (
          <Card key={id} className="border shadow-sm mb-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                {isLumpSum ? "Lump Sum Travel" : `Travel Route ${idx + 1}`}
                {/* <StatusBadge status={item.status} /> */}
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <Detail
                  label="Date"
                  value={format(new Date(item.date), "dd-MM-yyyy")}
                />
                <Detail
                  label={isLumpSum ? "Mode" : "Vehicle"}
                  value={
                    isLumpSum
                      ? (item as TravelLumpSum).mode
                      : (item as TravelRoute).vehicleCategory
                  }
                />
                {!isLumpSum && (
                  <>
                    <Detail
                      label="From"
                      value={(item as TravelRoute).fromLocation}
                    />
                    <Detail
                      label="To"
                      value={(item as TravelRoute).toLocation}
                    />
                  </>
                )}
                <Detail label="Amount" value={`₹${item.amount}`} />
                {"notes" in item && item.notes && (
                  <Detail label="Notes" value={item.notes} />
                )}
              </div>
              <Separator />
              <div className="flex flex-col items-center space-y-4 pt-2">
                <img
                  src={sampleReceipt || ""}
                  alt="Receipt"
                  className="h-auto w-40 rounded border"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Full Size</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0">
                    <img
                      src={sampleReceipt || ""}
                      alt="Full Receipt"
                      className="h-auto w-full rounded"
                    />
                  </DialogContent>
                </Dialog>
                <Textarea
                  placeholder="Add Comment (Optional)"
                  value={comments[id] ?? ""}
                  onChange={(e) => handleChangeComment(id, e.target.value)}
                />
                {myReview ? (
                  myReview.status === "rejected" ? (
                    // If rejected, keep showing Review + Reject
                    <div className="grid w-full grid-cols-2 gap-2">
                      <Button
                        className="bg-green-600 text-white hover:bg-green-700"
                        disabled={resultObj?.isDisable}
                        onClick={() =>
                          handleUpdateReview(myReview.id, "reviewed", id)
                        }
                      >
                        Review Expense
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={resultObj?.isDisable}
                        onClick={() =>
                          handleUpdateReview(myReview.id, "rejected", id)
                        }
                      >
                        Reject Expense
                      </Button>
                    </div>
                  ) : (
                    // If reviewed/approved, only show Update
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700 w-full"
                      disabled={resultObj?.isDisable}
                      onClick={() =>
                        handleUpdateReview(myReview.id, myReview.status, id)
                      }
                    >
                      Update Review
                    </Button>
                  )
                ) : (
                  // Initial state: Review + Reject
                  <div className="grid w-full grid-cols-2 gap-2">
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700"
                      disabled={resultObj?.isDisable}
                      onClick={() => handleReviewAction(id, resultObj?.status)}
                    >
                      {resultObj?.status == "reviewed"
                        ? "Review Expense"
                        : "Approve Expense"}
                    </Button>
                    {resultObj?.reason != "" && <p>{resultObj.reason}</p>}
                    <Button
                      variant="destructive"
                      disabled={resultObj?.isDisable}
                      onClick={() => handleReviewAction(id, "rejected")}
                    >
                      Reject Expense
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </ScrollArea>
  );
}
