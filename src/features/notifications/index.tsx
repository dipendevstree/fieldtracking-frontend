import { Main } from "@/components/layout/main";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetNotifications } from "./services/notifications.hook";
import { useState } from "react";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { FilterConfig } from "@/components/global-filter-section";
import Notification from "./components/notification";

export default function Notifications() {
    const [filterData, setFilterData] = useState<Record<string, string>>({})
    const [pagination, setPagination] = useState({
        page: DEFAULT_PAGE_NUMBER,
        limit: DEFAULT_PAGE_SIZE,
        isMobile: false
    });
    const notifications = useGetNotifications(pagination);
    const notificationData = notifications.allData ?? [];
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
    const handleDateChange = (value: string | undefined) => {
        setFilterData((prev) => ({
            ...prev,
            duration: value || ""
        }));
    }

    const filters: FilterConfig[] = [
        {
            key: "duration",
            type: "select",
            onChange: handleDateChange,
            placeholder: "Select Duration",
            options: durationOptions,
            value: filterData.duration,
            onCancelPress: () => { }
        }
    ];
    return (
        <Main className={cn("flex flex-col p-4")}>
            <div className='flex items-center justify-between space-y-2'>
                <h2 className='text-3xl font-bold tracking-tight'>
                    Notifications
                </h2>
            </div>
            <GlobalFilterSection key={"calender-view-filters"} filters={filters} className="mt-4 space-y-5" />
            <Card className="mt-4 space-y-5">
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <InfiniteScroll
                        loader={<p className='text-center text-sm text-gray-500'>Loading more data...</p>}
                        dataLength={notificationData.length}
                        next={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        hasMore={notifications.totalCount < notificationData.length}
                    >
                        <div className='space-y-6'>
                            {notificationData.map((notification: any, key: number) => (
                                <Notification key={key} notification={notification}/>
                            ))}
                        </div>
                    </InfiniteScroll>
                </CardContent>
            </Card>
        </Main>
    )
}