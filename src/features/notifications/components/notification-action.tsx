import { Link } from "@tanstack/react-router";
import { NOTIFICATION_TYPE } from "../data/notification.types";

interface Props {
  children?: React.ReactNode;
  row?: any;
  key?: number;
  removeElementIfNoLink?: boolean;
}

export default function NotificationAction({ children, row, key: _key, removeElementIfNoLink }: Props) {
  switch (row?.original?.messageType) {
    // chat messages are never come
    case NOTIFICATION_TYPE.CHAT_MESSAGE:
      break;

    case NOTIFICATION_TYPE.VIEW_VISIT:
    case NOTIFICATION_TYPE.VISIT_CHANGES:
      return (
        <Link to="/calendar/upcoming-visit" target="_blank">
          {children}
        </Link>
      );

    case NOTIFICATION_TYPE.EXPENSE_REVIEW:
    case NOTIFICATION_TYPE.EXPENSE_REJECT:
    case NOTIFICATION_TYPE.EXPENSE_APPROVAL:
    case NOTIFICATION_TYPE.EXPENSE_REQUEST:
      return (
        <Link
          to="/approvals/daily-expense-details/$id"
          params={{ id: String(row?.original?.extraData?.id) }}
          target="_blank"
        >
          {children}
        </Link>
      );

    case NOTIFICATION_TYPE.LATE_CHECKIN:
    case NOTIFICATION_TYPE.LATE_CHECKOUT:
    case NOTIFICATION_TYPE.IDLE_TIME:
      return <>{removeElementIfNoLink ? null : children}</>;
  }
  return <>{removeElementIfNoLink ? null : children}</>;
}
