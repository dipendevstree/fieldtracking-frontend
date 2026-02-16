export interface Notification {
  id: string;
  title: string;
  body: string;
  messageType: string;
  isRead: boolean;
  createdDate: string;
  createdByData?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    profileUrl?: string;
  };
  extraData?: any;
}

export const NOTIFICATION_TYPE = {
  CHAT_MESSAGE: "CHAT_MESSAGE",
  VIEW_VISIT: "VIEW_VISIT",
  EXPENSE_APPROVAL: "EXPENSE_APPROVAL",
  EXPENSE_REQUEST: "EXPENSE_REQUEST",
  VISIT_CHANGES: "VISIT_CHANGES",
  EXPENSE_REVIEW: "EXPENSE_REVIEW",
  EXPENSE_REJECT: "EXPENSE_REJECT",
  LATE_CHECKIN: "LATE_CHECKIN",
  LATE_CHECKOUT: "LATE_CHECKOUT",
  IDLE_TIME: "IDLE_TIME",
  LEAVE_REQUEST: "LEAVE_REQUEST",
  LEAVE_APPROVED: "LEAVE_APPROVED",
  LEAVE_REJECTED: "LEAVE_REJECTED",
};
