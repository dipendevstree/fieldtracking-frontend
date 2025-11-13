import { Main } from "@/components/layout/main";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { useGetAllNotifications } from "./services/notifications.hook";
import { useMemo, useState } from "react";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { FilterConfig } from "@/components/global-filter-section";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment-timezone";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useGetUsers } from "../livetracking/services/live-tracking-services";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { SquareArrowOutUpRight } from "lucide-react";
import NotificationAction from "./components/notification-action";
import UserProfile from "./components/uesr-profile";

export default function Notifications() {
    const initialDateRange: DateRange = {
        from: undefined,
        to: undefined,
    };
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        initialDateRange
    );
    const [pagination, setPagination] = useState({
        page: DEFAULT_PAGE_NUMBER,
        limit: DEFAULT_PAGE_SIZE,
        sort: "desc",
        isMobile: false,
        search: undefined,
        fromUser: undefined
    });
    const notifications = useGetAllNotifications(pagination);
    const notificationData = notifications?.list ?? [];
    const { listData } = useGetUsers({
        page: 1,
        limit: 1000, // Get all users to count them
        includeLatLong: false,
    });
    
    const usersList = useMemo(() => listData.map((user: any) => ({ value: user.id, label: `${user.firstName} ${user.lastName}` })), [listData]);
    const handleDataChange = (name: string, value: string | undefined) => {
        setPagination((prev) => ({
            ...prev,
            [name]: value || ""
        }));
    }

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
            onChange: value => handleDataChange("search", value),
            placeholder: "Search By Title, Message",
            value: pagination.search
        },
        {
            key: "user",
            type: "select",
            onChange: value => handleDataChange("fromUser", value),
            placeholder: "Select From User",
            options: usersList,
            value: pagination.fromUser,
            onCancelPress: () => { }
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
    const toTitleCase = (str: string) => str.replace(/_/g, " ").toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const notificationDataColumns: ColumnDef<any>[] = [
        {
            accessorKey: "user",
            header: "From User",
            cell: ({ row }) => (
                <div className="flex gap-3">
                    <UserProfile row={row} />
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <CustomTooltip title={row?.original?.title}>
                    <div>{row?.original?.title.length > 25 ? row?.original?.title.slice(0, 25) + "..." : row?.original?.title}</div>
                </CustomTooltip>
            )
        },
        {
            accessorKey: "message",
            header: "Message",
            cell: ({ row }) => (
                <CustomTooltip title={row?.original?.body}>
                    <div>{row?.original?.body.length > 50 ? row?.original?.body.slice(0, 50) + "..." : row?.original?.body}</div>
                </CustomTooltip>
            )
        },
        {
            accessorKey: "messageType",
            header: "Type",
            cell: ({ row }) => (
                <div>{toTitleCase(row?.original?.messageType)}</div>
            )
        },
        {
            accessorKey: "dateTime",
            header: "Date & Time",
            cell: ({ row }) => (
                <div>{moment(row?.original?.createdDate).format("DD-MM-YYYY hh:mm A")}</div>
            )
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <NotificationAction row={row} removeElementIfNoLink={true}>
                        <SquareArrowOutUpRight size={20} />
                    </NotificationAction>
                </div>
            )
        }
    ];

    return (
        <Main className={cn("flex flex-col p-4")}>
            <div className='flex items-center justify-between space-y-2'>
                <h2 className='text-3xl font-bold tracking-tight'>
                    Notifications
                </h2>
            </div>
            <GlobalFilterSection key={"calender-view-filters"} filters={filters} className="my-4 space-y-5" />
            <CustomDataTable
                data={notificationData}
                columns={notificationDataColumns as any}
                totalCount={notifications.totalCount}
                currentPage={pagination.page}
                defaultPageSize={pagination.limit}
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
    )
}