import { Main } from "@/components/layout/main";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { useGetAllNotifications } from "./services/notifications.hook";
import { useState } from "react";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { FilterConfig } from "@/components/global-filter-section";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatName, getFullName } from "@/utils/commonFunction";
import moment from "moment-timezone";

export default function Notifications() {
    const [filterData, setFilterData] = useState<Record<string, string>>({})
    const [pagination, setPagination] = useState({
        page: DEFAULT_PAGE_NUMBER,
        limit: DEFAULT_PAGE_SIZE,
        isMobile: true
    });
    const notifications = useGetAllNotifications(pagination);
    const notificationData = notifications?.list ?? [];
    console.log("notificationData", notificationData)
    const durationOptions = [
        {
            label: "This Month",
            value: "this_month"
        },
        {
            label: "Last Month",
            value: "last_month"
        }
    ];
    const handleDateChange = (name: string, value: string | undefined) => {
        setFilterData((prev) => ({
            ...prev,
            [name]: value || ""
        }));
    }

    const filters: FilterConfig[] = [
        {
            key: "search",
            type: "search",
            onChange: value => handleDateChange("search", value),
            placeholder: "Search By Title, Message",
            value: filterData.search
        },
        {
            key: "user",
            type: "select",
            onChange: value => handleDateChange("fromUser", value),
            placeholder: "Select From User",
            options: durationOptions,
            value: filterData.fromUser,
            onCancelPress: () => { }
        },
        {
            key: "duration",
            type: "select",
            onChange: value => handleDateChange("duration", value),
            placeholder: "Select Duration",
            options: durationOptions,
            value: filterData.duration,
            onCancelPress: () => { }
        },
    ];
    const toTitleCase = (str: string) => str.replace(/_/g, " ").toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const notificationDataColumns: ColumnDef<any>[] = [
        {
            accessorKey: "user",
            header: "From User",
            cell: ({ row }) => (
                <div className="flex gap-3">
                    {row.original?.createdByData && (
                        <img
                            src={
                                row.original.createdByData.profileUrl ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    (row.original.createdByData.firstName + " " + row.original.createdByData.lastName)
                                )}`
                            }
                            alt={row.original.createdByData.fullName}
                            className="h-12 w-12 rounded-full object-cover"
                        />
                    )}
                    <span className="block my-auto">
                        {formatName(
                            getFullName(
                                row.original?.createdByData.firstName,
                                row.original?.createdByData?.lastName
                            )
                        )}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div>{row?.original?.title}</div>
            )
        },
        {
            accessorKey: "message",
            header: "Message",
            cell: ({ row }) => (
                <div>{row?.original?.body}</div>
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
                <div>{moment(row?.original?.createdDate).format("YYYY-MM-DD hh:mm A")}</div>
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