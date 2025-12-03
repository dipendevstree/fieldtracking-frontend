import { IconBell } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { useGetNotifications, useGetUnreadCount } from "../services/notifications.hook";
import { useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import InfiniteScroll from "react-infinite-scroll-component";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Notification from "./notification";
import NotificationAction, { toUrl } from "./notification-action";
import { useFcm } from "@/hooks/use-fcm";
import { toast } from "sonner";
import { BellRing } from "lucide-react";

export function NotificationList() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    isMobile: false,
    sort: "desc",
    showUnreadCount: true,
  });
  const notifications = useGetNotifications(pagination);
  const { data: unreadCount } = useGetUnreadCount(pagination);
  const notificationData = notifications.allData ?? [];
  const { newNotification: _newNotification } = useFcm((notification) => {
    if (notification && window.document.visibilityState === "visible") {
      const url = toUrl({
        original: {
          ...notification,
          messageType: notification?.extraData?.messageType,
        },
      });
      const id = toast.success(
        <div
          onClick={() => {
            if (url) navigate({ to: url.to, params: url.params });
            toast.dismiss(id);
          }}
        >
          {notification?.extraData?.title
            ? notification?.extraData?.title
            : "New Message"}
        </div>,
        {
          icon: <BellRing className="w-5 h-5" />,
          description: (
            <div
              onClick={() =>
                url ? navigate({ to: url.to, params: url.params }) : null
              }
            >
              {notification?.extraData?.body
                ? notification?.extraData?.body
                : "You have received a new message."}
            </div>
          ),
          duration: 8000,
          position: "top-center",
        }
      );
      notifications.refetch();
    }
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent/20 relative"
        >
          <IconBell className="!w-7 !h-7" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 h-4 w-fit rounded-full bg-black text-xs font-medium text-white">
              {unreadCount > 100 ? "99+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-100" align="end">
        <DropdownMenuLabel className="flex justify-between mb-2 border-b">
          Notifications
          <Link to={"/notifications"} onClick={() => setOpen(false)}>
            <span>View All</span>
          </Link>
        </DropdownMenuLabel>

        <div id="scrollArea" className="max-h-72 overflow-y-auto">
          <InfiniteScroll
            scrollableTarget="scrollArea"
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
                  <NotificationAction
                    key={key}
                    row={{ original: notification }}
                  >
                    <DropdownMenuItem
                      key={key}
                      ref={
                        key === notificationData.length - 1
                          ? notifications.lastPostRef
                          : null
                      }
                      className="flex items-center justify-between mt-0 m-2 my-4 outline-none"
                    >
                      <Notification key={key} notification={notification} />
                    </DropdownMenuItem>
                  </NotificationAction>
                ))
              ) : (
                <DropdownMenuLabel>Notification not found</DropdownMenuLabel>
              )}
            </DropdownMenuGroup>
          </InfiniteScroll>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
