import { Main } from "@/components/layout/main";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import {
  useGetAllNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "./services/notifications.hook";
import { useMemo, useState } from "react";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { FilterConfig } from "@/components/global-filter-section";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useGetUsers } from "../livetracking/services/live-tracking-services";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNotificationColumns } from "./components/notification-columns";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { toast } from "sonner";

export default function Notifications() {
  const initialDateRange: DateRange = {
    from: undefined,
    to: undefined,
  };
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialDateRange,
  );
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    sort: "desc",
    isMobile: false,
    search: undefined,
    fromUser: undefined,
    showUnreadCount: false,
  });
  const notifications = useGetAllNotifications(pagination);
  const unreadCount = notifications.unreadCount;
  const { mutate: markAllAsRead } = useMarkAllAsRead({
    onSuccess: () => {
      toast.success("Marked all as read successfully", {
        position: "top-center",
        duration: 3000,
      });
    },
  });

  const { mutate: markAsRead } = useMarkAsRead({
    onSuccess: () => {
      toast.success("Marked as read successfully", {
        position: "top-center",
        duration: 3000,
      });
    },
  });
  const notificationData = notifications?.list ?? [];

  const { listData } = useGetUsers({
    includeLatLong: false,
  });

  const usersList = useMemo(
    () =>
      listData.map((user: any) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      })),
    [listData],
  );
  const handleDataChange = (name: string, value: string | undefined) => {
    setPagination((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    setPagination((prev) => ({
      ...prev,
      page: 1,
      startDate: newRange?.from ? format(newRange.from, "yyyy-MM-dd") : "",
      endDate: newRange?.to ? format(newRange.to, "yyyy-MM-dd") : "",
    }));
  };

  const filters: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      onChange: (value) => handleDataChange("search", value),
      placeholder: "Search By Title, Message",
      value: pagination.search,
    },
    {
      key: "user",
      type: "select",
      onChange: (value) => handleDataChange("fromUser", value),
      placeholder: "Select From User",
      options: usersList,
      value: pagination.fromUser,
      onCancelPress: () => {},
    },
    {
      key: "date-range",
      type: "date-range",
      placeholder: "Filter by date",
      dateRangeValue: dateRange,
      onDateRangeChange: handleDateRangeChange,
      dataRangeClassName: "w-full max-w-xs",
    },
  ];

  const notificationDataColumns = getNotificationColumns(markAsRead);

  return (
    <Main className={cn("flex flex-col p-4")}>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={() => markAllAsRead({ ids: [] })}>
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>
      <GlobalFilterSection
        key={"calender-view-filters"}
        filters={filters}
        className="my-4 space-y-5"
      />
      <CustomDataTable
        data={notificationData}
        columns={notificationDataColumns as any}
        totalCount={notifications.totalCount}
        currentPage={pagination.page}
        defaultPageSize={pagination.limit}
        getRowClassName={(row: any) =>
          !row.isRead ? "bg-muted" : "hover:bg-accent/50"
        }
        paginationCallbacks={{
          onPaginationChange: (page: number, pageSize: number) => {
            setPagination((prev) => ({
              ...prev,
              page,
              limit: pageSize,
            }));
          },
        }}
        loading={notifications.isLoading}
        key="notifications"
      />
    </Main>
  );
}
