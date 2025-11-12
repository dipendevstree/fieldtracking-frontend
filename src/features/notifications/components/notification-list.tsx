import { IconBell } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useGetNotifications } from "../services/notifications.hook";
import { useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import InfiniteScroll from "react-infinite-scroll-component";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Notification from "./notification";
import NotificationAction from "./notification-action";

export function NotificationList() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    isMobile: false,
    sort: "desc",
  });
  const notifications = useGetNotifications(pagination);
  const notificationData = notifications.allData ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent/20 relative"
        >
          <IconBell className="!w-5 !h-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-100 max-h-150" align="end">
        <DropdownMenuLabel className="flex justify-between">
          Notifications
          <Link to={"/notifications"}>
            <span>View All</span>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <InfiniteScroll
          loader={
            <p className="text-center text-sm text-gray-500">
              Loading more data...
            </p>
          }
          dataLength={notificationData.length}
          next={() =>
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          hasMore={notifications.totalCount < notificationData.length}
        >
          <DropdownMenuGroup>
            {notificationData.length > 0 ? (
              notificationData.map((notification: any, key: number) => (
                <NotificationAction key={key} row={{ original: notification }}>
                  <DropdownMenuItem
                    key={key}
                    ref={
                      key === notificationData.length - 1
                        ? notifications.lastPostRef
                        : null
                    }
                    className="flex items-center justify-between m-2 my-4 outline-none"
                  >
                    <Notification key={key} notification={notification} />
                  </DropdownMenuItem>
                </NotificationAction>
              ))
            ) : (
              <DropdownMenuLabel className="flex items-center justify-between">
                Notification not found
              </DropdownMenuLabel>
            )}
          </DropdownMenuGroup>
        </InfiniteScroll>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
