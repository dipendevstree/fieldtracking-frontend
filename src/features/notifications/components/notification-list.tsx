import { IconBell } from "@tabler/icons-react";
import API from "@/config/api/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { useGetNotifications } from "../services/notifications.hook";
import { useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import InfiniteScroll from "react-infinite-scroll-component";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Notification from "./notification";
import NotificationAction, { toUrl } from "./notification-action";
import { useFcm } from "@/hooks/use-fcm";
import { toast } from "sonner";
import { BellRing } from "lucide-react";
import { NOTIFICATION_TYPE } from "../types";
import { useQueryClient } from "@tanstack/react-query";

export function NotificationList() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    isMobile: false,
    sort: "desc",
  });
  const notifications = useGetNotifications(pagination);
  const unreadCount = notifications.unreadCount;
  const notificationData = notifications.allData ?? [];
  const { newNotification: _newNotification } = useFcm((notification) => {
    if (notification) {
      if (
        notification?.extraData?.messageType &&
        ["", NOTIFICATION_TYPE.CHAT_MESSAGE].includes(
          notification?.extraData?.messageType,
        )
      ) {
        return;
      }
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
          duration: 5000,
          position: "top-center",
        },
      );
      queryClient.invalidateQueries({
        queryKey: [API.notifications.list],
      });
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
          <IconBell className="!w-6 !h-6" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 h-4 w-fit rounded-full bg-black text-xs font-medium text-white">
              {unreadCount > 100 ? "99+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-100" align="end">
        <DropdownMenuLabel className="flex justify-between items-center mb-2 border-b">
          Notifications
          <div className="flex items-center">
            <Link to={"/notifications"} onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10 transition-colors flex gap-1.5 items-center font-semibold"
              >
                View All
              </Button>
            </Link>
          </div>
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
                      className="flex items-center justify-between mt-0 m-2  outline-none"
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
