import { Link } from "@tanstack/react-router";
import { NOTIFICATION_TYPE } from "../data/notification.types";

interface Props {
  children?: React.ReactNode;
  row?: any;
  removeElementIfNoLink?: boolean;
}

export function toUrl(row: any) {
  switch (row?.original?.messageType) {
    // chat messages are never come
    case NOTIFICATION_TYPE.CHAT_MESSAGE:
      break;

    case NOTIFICATION_TYPE.VIEW_VISIT:
    case NOTIFICATION_TYPE.VISIT_CHANGES:
      return {
        to: "/calendar/upcoming-visit"
      }

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
  }
}

export default function NotificationAction({
  children,
  row,
  removeElementIfNoLink,
}: Props) {
  const url = toUrl(row);

  if (url && url?.to) {
    return (
      <Link
        {...url}
        target="_blank"
      >
        {children}
      </Link>
    );
  }
  return <>{removeElementIfNoLink ? null : children}</>;
}
