import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from "date-fns";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useGetAllReportsAndAnalyticsQuickStats } from "../../services/reports and-analytics";

export default function ReportsAnalytics() {
  const [filter, setFilter] = useState<
    "day" | "week" | "lastMonth" | "currentMonth"
  >("day");

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    switch (filter) {
      case "day":
        return { startDate: startOfDay(now), endDate: endOfDay(now) };
      case "week":
        return { startDate: startOfWeek(now), endDate: endOfWeek(now) };
      case "lastMonth":
        const lastMonth = subMonths(now, 1);
        return {
          startDate: startOfMonth(lastMonth),
          endDate: endOfMonth(lastMonth),
        };
      case "currentMonth":
      default:
        return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
    }
  }, [filter]);

  const { data, isLoading } = useGetAllReportsAndAnalyticsQuickStats({
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  });

  const {
    pendingApprovals = 0,
    approvedToday = 0,
    averageDailyExpense = 0,
  } = data || {};

  return (
    <div className="space-y-4">
      {/* Header with filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Expense Analytics</h2>

        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="currentMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>
            Overview of expense metrics ({filter.replace(/([A-Z])/g, " $1")}).
          </CardDescription>
        </CardHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 bg-white rounded-b-xl">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Pending Approvals
                </span>
                <span className="font-medium">{pendingApprovals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Approved
                </span>
                <span className="font-medium">{approvedToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Average Daily Expense
                </span>
                <span className="font-medium">
                  ₹ {averageDailyExpense.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
