import { ColumnDef } from "@tanstack/react-table";
import { Notification } from "../types";
import UserProfile from "./uesr-profile";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { Button } from "@/components/ui/button";
import { Check, SquareArrowOutUpRight } from "lucide-react";
import NotificationAction from "./notification-action";
import moment from "moment-timezone";

const toTitleCase = (str: string) =>
  str
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const getNotificationColumns = (
  markAsRead: (vars: { ids: string[] }) => void,
): ColumnDef<Notification>[] => [
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
        <div>
          {row?.original?.title.length > 25
            ? row?.original?.title.slice(0, 25) + "..."
            : row?.original?.title}
        </div>
      </CustomTooltip>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <CustomTooltip title={row?.original?.body}>
        <div>
          {row?.original?.body.length > 50
            ? row?.original?.body.slice(0, 50) + "..."
            : row?.original?.body}
        </div>
      </CustomTooltip>
    ),
  },
  {
    accessorKey: "messageType",
    header: "Type",
    cell: ({ row }) => (
      <div>{toTitleCase(row?.original?.messageType || "")}</div>
    ),
  },
  {
    accessorKey: "dateTime",
    header: "Date & Time",
    cell: ({ row }) => (
      <div>
        {moment(row?.original?.createdDate).format("DD-MM-YYYY hh:mm A")}
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 justify-center">
        <div className="w-8 flex justify-center">
          {!row.original.isRead && (
            <CustomTooltip title="Mark as Read">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead({ ids: [row.original.id] });
                }}
              >
                <Check size={18} />
              </Button>
            </CustomTooltip>
          )}
        </div>

        <div className="w-8 flex justify-center">
          <NotificationAction row={row} removeElementIfNoLink={true}>
            <SquareArrowOutUpRight
              size={18}
              className={
                !row.original.isRead ? "text-primary" : "text-muted-foreground"
              }
            />
          </NotificationAction>
        </div>
      </div>
    ),
  },
];
