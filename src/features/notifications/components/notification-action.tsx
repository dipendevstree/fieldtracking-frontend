import { Link } from "@tanstack/react-router";
import { useMarkAsRead } from "../services/notifications.hook";
import React from "react";
import { NOTIFICATION_TYPE } from "../types";

interface Props {
  children?: React.ReactNode;
  row?: any;
  removeElementIfNoLink?: boolean;
  onClick?: () => void;
}

export function toUrl(row: any) {
  switch (row?.original?.messageType) {
    // chat messages are never come
    case NOTIFICATION_TYPE.CHAT_MESSAGE:
      break;

    case NOTIFICATION_TYPE.VIEW_VISIT:
    case NOTIFICATION_TYPE.VISIT_CHANGES:
      return {
        to: "/calendar/upcoming-visit",
      };

    case NOTIFICATION_TYPE.EXPENSE_REVIEW:
    case NOTIFICATION_TYPE.EXPENSE_REJECT:
    case NOTIFICATION_TYPE.EXPENSE_APPROVAL:
    case NOTIFICATION_TYPE.EXPENSE_REQUEST:
      return {
        to: "/approvals/daily-expense-details/$id",
        params: { id: String(row?.original?.extraData?.id) },
      };

    case NOTIFICATION_TYPE.LATE_CHECKIN:
    case NOTIFICATION_TYPE.LATE_CHECKOUT:
    case NOTIFICATION_TYPE.IDLE_TIME:
      return null;

    case NOTIFICATION_TYPE.LEAVE_REQUEST:
      return {
        to: "/leave-management/leave-request",
      };

    case NOTIFICATION_TYPE.LEAVE_APPROVED:
    case NOTIFICATION_TYPE.LEAVE_REJECTED:
      return {
        to: "/leave-management/my-leave",
      };
  }
}

export default function NotificationAction({
  children,
  row,
  removeElementIfNoLink,
  onClick,
}: Props) {
  const url = toUrl(row);
  const { mutate: markAsRead } = useMarkAsRead();

  const handleClick = () => {
    if (row?.original?.id && !row?.original?.isRead) {
      markAsRead({ ids: [row.original.id] });
    }
    if (onClick) onClick();
  };

  if (url && url?.to) {
    return (
      <Link
        {...url}
        target="_blank"
        onClick={handleClick}
        className="w-full block"
      >
        {children}
      </Link>
    );
  }
  return (
    <div onClick={handleClick} className="w-full cursor-pointer">
      {removeElementIfNoLink ? null : children}
    </div>
  );
}
