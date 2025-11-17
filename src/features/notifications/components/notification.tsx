import moment from "moment-timezone";
import React from "react";

export default function Notification({
  notification,
  ref = null,
}: {
  notification: any;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className={`flex items-center gap-3`} ref={ref}>
      <div className={`truncate`}>
        {notification?.createdByData && (
          <img
            src={
              notification.createdByData.profileUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                notification.createdByData.firstName +
                  " " +
                  notification.createdByData.lastName
              )}`
            }
            alt={notification.createdByData.fullName}
            className="h-8 w-8 rounded-full object-cover"
          />
        )}
      </div>
      <div className="w-80 truncate">
        <span className="flex justify-between">
          <span>
            {notification.title.length > 25
              ? notification.title.slice(0, 25) + "..."
              : notification.title}
          </span>
          <span className="text-xs">
            {moment(notification.createdDate).format("DD-MM-YYYY")}
          </span>
        </span>
        <div className="flex justify-between items-center font-light">
          <span className="text-xs">
            {notification.body.length > 25
              ? notification.body.slice(0, 25) + "..."
              : notification.body}
          </span>
          <span className="text-xs">
            {moment(notification.createdDate).format("hh:mm A")}
          </span>
        </div>
      </div>
    </div>
  );
}
