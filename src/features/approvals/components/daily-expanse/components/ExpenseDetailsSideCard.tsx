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

  const isButtonDisabled = (id: string) => {
    if (dailyExpanse?.getThisUserLevel === "defult") return false;

    const defaultApproval = dailyExpanse?.expenseReviewAndApproval.find(
      (b: any) =>
        b.reviewerUserId === dailyExpanse?.defaultApprovalUser?.id &&
        (isLumpSum ? b.travelLumpSumId === id : b.travelRouteId === id)
    );

    const belowLevels =
      dailyExpanse?.expensesLevels?.filter(
        (f: any) => f?.level < (dailyExpanse?.getThisUserLevel ?? 0)
      ) || [];

    const approvedBelowLevels = belowLevels.filter((level: any) =>
      dailyExpanse?.expenseReviewAndApproval.some(
        (b: any) =>
          b.reviewerUserId === level.userId &&
          (isLumpSum ? b.travelLumpSumId === id : b.travelRouteId === id)
      )
    );

    return !(
      defaultApproval && approvedBelowLevels.length === belowLevels.length
    );
  };

  const handleReviewAction = (
    id: string,
    status: "approved" | "rejected" | "reviewed"
  ) => {
    onExpenseReviewAndApproval({
      parentId: id,
      status: isApprovalLevel && status === "reviewed" ? "approved" : status,
      comment: comments[id] ?? "",
    });
  };

  const handleUpdateReview = (item: any) => {
    console.log("items", item);
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] space-y-4 pr-4">
      {entries.map((item, idx) => {
        const id = isLumpSum
          ? (item as TravelLumpSum).travelLumpSumId
          : (item as TravelRoute).travelRouteId;
        const myReview = getReviewAndApproval(id);
        const isDisabled = isButtonDisabled(id);

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
                          id,
                          isApprovalLevel ? "approved" : "reviewed"
                        )
                      }
                    >
                      {isApprovalLevel ? "Approve Expense" : "Review Expense"}
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={isDisabled}
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
