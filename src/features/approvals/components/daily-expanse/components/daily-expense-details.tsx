import { useParams } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Main } from "@/components/layout/main";
import StatusBadge from "@/components/shared/common-status-badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Detail } from "@/components/ui/detail";
import {
  formatDateRange,
  getFullName,
  getUserInitials,
} from "@/utils/commonFunction";
import {
  formatExpenseSubType,
  formatExpenseType,
} from "@/utils/commonFormatters";
import { ExpenseDetailsSideCard } from "./ExpenseDetailsSideCard";
import { DailyAllowanceDetailsCard } from "./DailyAllowanceDetailsCard";
import {
  useDailyExpansesById,
  useExpenseReviewAndApproval,
  useExpenseReviewAndApprovalUpdate,
} from "@/features/approvals/services/daily-expanses.hook";
import { useEffect, useMemo, useState } from "react";

export default function DailyExpenseDetails() {
  const [updateId, setUpdateId] = useState<string | null>(null);
  const { id } = useParams({ strict: false });
  const { dailyExpanse, refetch: refetchExpanseDetails } = useDailyExpansesById(
    id || ""
  );

  const { mutate: expenseReviewAndApproval, isSuccess } =
    useExpenseReviewAndApproval();

  const { mutate: expenseReviewAndApprovalUpdate, isSuccess: isSuccessUpdate } =
    useExpenseReviewAndApprovalUpdate(updateId ?? "");

  const user = dailyExpanse?.salesRepresentativeUser;
  const isApprovalLevel = dailyExpanse?.isApprovalLevel;

  const handleExpenseReviewAndApproval = ({
    parentId,
    status,
    comment,
  }: {
    parentId: string;
    status: "approved" | "reviewed" | "rejected";
    comment: string;
  }) => {
    const payload = {
      expenseId: id,
      status,
      comment,
      isApprovalLevel,
      ...(dailyExpanse?.expenseSubType === "travel_lump_sum"
        ? { travelLumpSumId: parentId }
        : { travelRouteId: parentId }),
    };
    expenseReviewAndApproval(payload);
  };

  const handleDailyAllowanseReviewAndApproval = ({
    dailyAllowanceId,
    dailyAllowanceDetailsId,
    status,
    comment,
  }: {
    dailyAllowanceId: string;
    dailyAllowanceDetailsId: string;
    status: "approved" | "reviewed" | "rejected";
    comment: string;
  }) => {
    const payload = {
      expenseId: id,
      status,
      comment,
      isApprovalLevel,
      dailyAllowanceId,
      dailyAllowanceDetailsId,
    };
    expenseReviewAndApproval(payload);
  };

  const handleUpdateExpanseDetails = ({
    id,
    status,
    comment,
  }: {
    id: string;
    status: "approved" | "reviewed" | "rejected";
    comment: string;
  }) => {
    setUpdateId(id);
    const payload = {
      status,
      comment,
      isApprovalLevel,
    };
    expenseReviewAndApprovalUpdate(payload);
  };

  const getUserLevelLabel = useMemo(
    () => (review: any) => {
      if (dailyExpanse?.defaultApprovalUser?.id === review.reviewerUserId) {
        return "Default User";
      }
      const level = dailyExpanse?.expensesLevels?.find(
        (h: any) => h.userId === review.reviewerUserId
      )?.level;
      return level ? `Level ${level}` : "Level";
    },
    [dailyExpanse]
  );

  useEffect(() => {
    if (isSuccess || isSuccessUpdate) {
      refetchExpanseDetails();
    }
  }, [isSuccess, isSuccessUpdate, refetchExpanseDetails]);

  return (
    <Main>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Expense Information */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Information</CardTitle>
            <CardDescription>
              Detailed breakdown of the expense submission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user?.avatarUrl || ""} alt="User avatar" />
                  <AvatarFallback>
                    {getUserInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">
                  {getFullName(user?.firstName, user?.lastName)}
                </p>
              </div>
              <StatusBadge status={dailyExpanse?.status} />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail
                label="Date"
                value={formatDateRange(
                  dailyExpanse?.startDate,
                  dailyExpanse?.endDate
                )}
              />
              <Detail
                label="Type"
                value={formatExpenseType(dailyExpanse?.expenseType)}
              />
              <Detail
                label="Sub Type"
                value={formatExpenseSubType(dailyExpanse?.expenseSubType)}
              />
              <Detail
                label="Amount"
                value={`₹${dailyExpanse?.totalAmount ?? 0}`}
              />
              <Detail label="Notes" value={dailyExpanse?.notes || "-"} />
            </div>

            <Separator />

            <div>
              <p className="font-medium text-sm mb-2">Review and Approval</p>
              <ScrollArea className="h-[calc(100vh-32rem)] pr-4">
                {dailyExpanse?.expenseReviewAndApproval?.length ? (
                  dailyExpanse.expenseReviewAndApproval.map((data: any) => (
                    <Card
                      key={data.id}
                      className="p-4 shadow-sm border text-sm mb-3"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <Detail
                          label="Name"
                          value={getFullName(
                            data.reviewer?.firstName,
                            data.reviewer?.lastName
                          )}
                        />
                        <Detail
                          label="Created At"
                          value={
                            data?.createdDate
                              ? formatDateRange(data.createdDate)
                              : "-"
                          }
                        />
                        <Detail label="Level" value={getUserLevelLabel(data)} />
                        <Detail label="Comment" value={data?.comment || "-"} />
                        <Detail
                          label="Status"
                          value={<StatusBadge status={data?.status} />}
                        />
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No Review and Approval
                  </p>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Side Cards */}
        <Card className="pl-4">
          {dailyExpanse?.expenseType === "daily" ? (
            <DailyAllowanceDetailsCard
              expenseSubType={dailyExpanse?.expenseSubType}
              dailyAllowances={dailyExpanse?.dailyAllowances}
              isApprovalLevel={isApprovalLevel}
              dailyExpanse={dailyExpanse}
              onExpenseReviewAndApproval={handleDailyAllowanseReviewAndApproval}
              onUpdateExpanseDetails={handleUpdateExpanseDetails}
            />
          ) : (
            <ExpenseDetailsSideCard
              expenseSubType={dailyExpanse?.expenseSubType}
              travelLumpSums={dailyExpanse?.travelLumpSums}
              travelRoutes={dailyExpanse?.travelRoutes}
              isApprovalLevel={isApprovalLevel}
              dailyExpanse={dailyExpanse}
              onExpenseReviewAndApproval={handleExpenseReviewAndApproval}
              onUpdateExpanseDetails={handleUpdateExpanseDetails}
            />
          )}
        </Card>
      </div>
    </Main>
  );
}
