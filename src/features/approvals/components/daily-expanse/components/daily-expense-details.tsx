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
import { useDailyExpansesById } from "../../../services/daily-expanses.hook";
import {
  formatDateRange,
  getFullName,
  getUserInitials,
} from "@/utils/commonFunction";
import {
  formatExpenseSubType,
  formatExpenseType,
} from "@/utils/commonFormatters";
import { Separator } from "@/components/ui/separator";

import { Detail } from "@/components/ui/detail";
import { ExpenseDetailsSideCard } from "./ExpenseDetailsSideCard";

export default function DailyExpenseDetails() {
  const params = useParams({ strict: false });
  const id = params.id;

  const { dailyExpanse } = useDailyExpansesById(id || "");
  const user = dailyExpanse?.salesRepresentativeUser;

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
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={user?.avatarUrl || ""} />
                  <AvatarFallback>
                    {getUserInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium pl-2">
                  {getFullName(user?.firstName, user?.lastName)}
                </p>
              </div>
              <div>
                {dailyExpanse?.status && (
                  <StatusBadge status={dailyExpanse.status} />
                )}
              </div>
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
          </CardContent>
        </Card>

        <ExpenseDetailsSideCard
          expenseSubType={dailyExpanse?.expenseSubType}
          travelLumpSums={dailyExpanse?.travelLumpSums}
          travelRoutes={dailyExpanse?.travelRoutes}
        />
      </div>
    </Main>
  );
}
