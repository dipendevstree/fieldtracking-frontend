import { useState, useMemo } from "react";
import { MapPin } from "lucide-react";
import { format } from "date-fns";

import {
  getWorkDaySession,
  userDetailsById,
  useVisitAnalytics,
} from "./services/live-tracking-services";

import GlobalFilterSection from "@/components/global-table-filter-section";
import { FilterConfig } from "@/components/global-filter-section";

interface UserTrackingTimelineProps {
  userId: string;
}

const UserTrackingTimeline = ({ userId }: UserTrackingTimelineProps) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { user } = userDetailsById(userId ?? "");
  const { userSession } = getWorkDaySession(userId ?? "", selectedDate);
  const { analytics } = useVisitAnalytics(userId, selectedDate, selectedDate);

  const handleDateChange = (newDate?: string) => {
    const value = newDate ?? new Date().toISOString().split("T")[0];
    setSelectedDate(value);
  };

  const filters: FilterConfig[] = [
    {
      key: "date",
      type: "date",
      onChange: handleDateChange,
      placeholder: "Select date",
      value: selectedDate,
    },
  ];

  // Dynamic timeline formatter
  const formatTimelineData = (sessions: any[]) => {
    if (!sessions || sessions.length === 0) return [];

    // Use flatMap to process each session and add a separator between them
    return sessions.flatMap((session, index) => {
      const timeline: any[] = [];

      // Punch In
      timeline.push({
        id: session.workDaySessionId + "_in",
        type: "punch_in",
        title: "Punch In",
        location: "Location not provided",
        time: format(new Date(session.startTime), "hh:mm a"),
        color: "bg-teal-500",
      });

      // Tasks (if any)
      if (session.tasks && session.tasks.length > 0) {
        session.tasks.forEach((task: any) => {
          timeline.push({
            id: task.id,
            type: "task",
            title: `Task - ${task.title}`,
            description: task.description,
            time: task.startTime
              ? format(new Date(task.startTime), "hh:mm a")
              : undefined,
            color: "bg-gray-400",
          });
        });
      }

      // Breaks
      if (session.breaks && session.breaks.length > 0) {
        session.breaks.forEach((brk: any) => {
          const start = format(new Date(brk.breakStartTime), "hh:mm a");
          const end = brk.breakEndTime
            ? format(new Date(brk.breakEndTime), "hh:mm a")
            : "Ongoing";
          timeline.push({
            id: brk.workBreakSessionId,
            type: "break",
            title: "Break",
            subtitle: brk.breakType,
            description: `${start} - ${end}`,
            color: "bg-yellow-400",
          });
        });
      }

      // Punch Out
      if (session.endTime) {
        timeline.push({
          id: session.workDaySessionId + "_out",
          type: "punch_out",
          title: "Punch Out",
          location: "Location not provided",
          time: format(new Date(session.endTime), "hh:mm a"),
          color: "bg-red-500",
        });
      }

      // Add a separator after the session's events, but not for the last session
      if (index < sessions.length - 1) {
        timeline.push({
          id: `separator_${session.workDaySessionId}`,
          type: "separator",
        });
      }

      return timeline;
    });
  };

  const timelineData = useMemo(
    () => formatTimelineData(userSession?.sessions || []),
    [userSession?.sessions]
  );

  return (
    <div className="bg-gray-50 p-4">
      <div className="[&_*]:overflow-visible [&_*]:max-w-full [&_*]:w-full">
        <GlobalFilterSection key={"calendar-view-filters"} filters={filters} />
      </div>

      {/* Stats Cards */}
      <div className="py-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div className="mb-2 text-xs text-gray-500">Total Visit</div>
            <div className="font-bold text-gray-900">
              {/* Corrected: Show totalVisits here */}
              {analytics?.statusCounts?.totalVisits ?? 0}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div className="mb-2 text-xs text-gray-500">Completed</div>
            <div className="font-bold text-gray-900">
              {/* Corrected: Show completed here */}
              {analytics?.statusCounts?.completed ?? 0}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div className="mb-2 text-xs text-gray-500">Distance</div>
            <div className="font-bold text-gray-900">
              {userSession?.stats?.distance ?? "0 km"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* User Info */}
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 font-bold text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                {`${user?.firstName} ${user?.lastName}`}
              </div>
              <div className="text-sm text-gray-500">
                {user?.role?.roleName}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                <span className="text-sm text-gray-600">100%</span>
              </div>
            </div>
            <span
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                userSession?.isDayStarted
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  userSession?.isDayStarted ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {userSession?.isDayStarted ? "Active" : "Offline"}
            </span>
          </div>
        </div>

        <div className="border-b border-gray-100 p-4">
          <div className="relative pl-2">
            {timelineData.map((item, index) => {
              // Conditionally render the separator
              if (item.type === "separator") {
                return (
                  <div key={item.id} className="py-4">
                    <div className="border-t border-dashed border-gray-300" />
                  </div>
                );
              }

              // Render the original timeline item
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 pb-8 last:pb-0 relative"
                >
                  {/* Vertical line from current dot to next (except last) */}
                  {index < timelineData.length - 1 && (
                    <div className="absolute left-[5px] top-[12px] h-full w-0.5 bg-gray-200" />
                  )}

                  {/* Dot */}
                  <div
                    className={`relative z-10 mt-1 h-3 w-3 flex-shrink-0 rounded-full ${item.color}`}
                  />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="mt-1 text-sm text-gray-600">
                            {item.description}
                          </div>
                        )}
                        {item.subtitle && (
                          <div className="mt-1 text-sm text-gray-500">
                            {item.subtitle}
                          </div>
                        )}
                        {item.location && (
                          <div className="mt-2 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {item.location}
                            </span>
                          </div>
                        )}
                        {item.time && (
                          <div className="mt-1 text-sm text-gray-500">
                            {item.time}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nearest Location */}
        <div className="p-4">
          <div className="mb-3 font-semibold text-gray-900">
            Nearest Location
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            <div className="text-sm leading-relaxed text-gray-600">
              {userSession?.nearestLocation?.address ??
                "No location info available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrackingTimeline;
