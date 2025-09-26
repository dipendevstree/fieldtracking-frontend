import { useState, useMemo, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { socket } from "../../socket/socket";

import {
  getWorkDaySession,
  useFetchLiveTrackingData,
  userDetailsById,
  useVisitAnalytics,
} from "./services/live-tracking-services";

import GlobalFilterSection from "@/components/global-table-filter-section";
import { FilterConfig } from "@/components/global-filter-section";
import { getHaversineDistance } from "./data/commonFunction";
import moment from "moment-timezone";
import { getFormattedAddress } from "@/utils/commonFunction";
import { useGetAllVisit } from "../calendar/services/calendar-view.hook";

interface UserTrackingTimelineProps {
  userId: any;
  setPath: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }[]>>;
  setCurrentPosition: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  onBack?: () => void;
}

const UserTrackingTimeline = ({
  userId,
  setPath,
  setCurrentPosition,
  setMapCenter,
  // onBack,
}: UserTrackingTimelineProps) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [totalDistance, setTotalDistance] = useState(0);
  const [nearestAddress, setNearestAddress] = useState<string | null>(
    "No location info available"
  );

  // Destructure isLoading state from custom hooks
  const { user, isLoading: isUserLoading } = userDetailsById(userId ?? "");
  const { data: visits } = useGetAllVisit({
    startDate: selectedDate,
    endDate: selectedDate,
    status: "completed",
    salesRepresentativeUserId: userId ?? "",
  });

  const { userSession, isLoading: isSessionLoading } = getWorkDaySession(
    userId ?? "",
    selectedDate
  );
  const { analytics, isLoading: isAnalyticsLoading } = useVisitAnalytics(
    userId,
    selectedDate,
    selectedDate
  );

  const { data: trackingData, isFetched } = useFetchLiveTrackingData(
    userId,
    selectedDate,
    selectedDate
  );

  // Combine loading states
  const isLoading = isUserLoading || isSessionLoading || isAnalyticsLoading;

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
  const fetchAddress = async () => {
    if (trackingData && trackingData.length > 0) {
      const lastPoint = trackingData[0];
      const lat = parseFloat(lastPoint.lat);
      const lng = parseFloat(lastPoint.long);

      const address = await getFormattedAddress(lat, lng);
      setNearestAddress(address || "No location info available");
    } else {
      setNearestAddress("No location info available");
    }
  };
  // Fetch address for the last tracking data point
  useEffect(() => {
    fetchAddress();
  }, [trackingData]);

  useEffect(() => {
    if (isFetched) {
      if (trackingData && trackingData.length > 0) {
        const path = [...trackingData].reverse().map((item: any) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.long),
        }));
        setPath(path);
        setCurrentPosition(path[path.length - 1]);
        setMapCenter(path[0]);

        // --- Distance Calculation for Historical Data ---
        let calculatedDistance = 0;
        if (path.length > 1) {
          for (let i = 1; i < path.length; i++) {
            const prevPoint = path[i - 1];
            const currentPoint = path[i];
            calculatedDistance += getHaversineDistance(
              prevPoint.lat,
              prevPoint.lng,
              currentPoint.lat,
              currentPoint.lng
            );
          }
        }
        setTotalDistance(calculatedDistance);
        // --- End Distance Calculation ---
      } else {
        // Reset everything if no data for the selected date
        setPath([]);
        setCurrentPosition(null);
        setTotalDistance(0); // IMPORTANT: Reset distance
        setMapCenter({
          lat: 23.0225,
          lng: 72.5714,
        });
      }
    }
  }, [selectedDate, isFetched, trackingData.length]); // Dependencies are complete

  // MODIFIED: Socket effect now efficiently updates the distance.
  useEffect(() => {
    if (!socket || !userId) return;

    const handleConnect = () => {
      socket.emit("track_user", { userId });
    };

    const handleLiveLocation = (event: any) => {
      console.log(
        "event123456",
        event,
        moment(event.date).format("YYYY-MM-DD"),
        selectedDate
      );

      if (
        event?.lat &&
        event?.long &&
        moment(event.date).format("YYYY-MM-DD") === selectedDate &&
        event.userId === userId
      ) {
        const newPoint = {
          lat: parseFloat(event.lat),
          lng: parseFloat(event.long),
        };
        // This updater function ensures we always have the latest path and distance
        setPath((prevPath) => {
          const lastPoint = prevPath[prevPath.length - 1];
          if (lastPoint) {
            const increment = getHaversineDistance(
              lastPoint.lat,
              lastPoint.lng,
              newPoint.lat,
              newPoint.lng
            );
            setTotalDistance((prev) => prev + increment);
          }
          return [...prevPath, newPoint];
        });

        setCurrentPosition(newPoint);
        setMapCenter(newPoint);
      }
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }
    socket.on("live_location", handleLiveLocation);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("live_location", handleLiveLocation);
    };
  }, [socket, userId, selectedDate]); // Added props to dependency array

  // Dynamic timeline formatter (no changes needed here)
  const formatTimelineData = (sessions: any[]) => {
    if (!sessions || sessions.length === 0) return [];

    return sessions.flatMap((session, index) => {
      const timeline: any[] = [];
      // Punch In
      timeline.push({
        id: session.workDaySessionId + "_in",
        type: "punch_in",
        title: "Punch In",
        location: session.dayStartAddress ?? "Location not provided",
        time: format(new Date(session.startTime), "hh:mm a"),
        color: "bg-teal-500",
      });

      // Tasks (if any)
      if (visits && visits.length > 0) {
        visits.forEach((task: any) => {
          const visitTime = new Date(task.visitCheckOutTime);
          const sessionStart = new Date(session.startTime);
          const sessionEnd = session.endTime
            ? new Date(session.endTime)
            : new Date();
          if (visitTime >= sessionStart && visitTime <= sessionEnd) {
            timeline.push({
              id: task.visitId,
              type: "task",
              title: `Visit - ${task.purpose}`,
              description: task?.customer?.companyName,
              location: task?.checkoutAddress,
              time: task.visitCheckOutTime
                ? format(new Date(task.visitCheckOutTime), "hh:mm a")
                : undefined,
              color: "bg-gray-400",
            });
          }
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
          location: session.dayEndAddress ?? "Location not provided",
          time: format(new Date(session.endTime), "hh:mm a"),
          color: "bg-red-500",
        });
      }

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
    () => formatTimelineData((userSession?.sessions ?? []).slice().reverse()),
    [userSession?.sessions, visits]
  );

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-gray-50 p-4">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-[4px]">
      {/* <div className="mb-4">
        <button
          onClick={onBack}
          className="text-sm text-teal-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>
      </div> */}
      <div className="[&_*]:overflow-visible [&_*]:max-w-full [&_*]:w-full">
        <GlobalFilterSection
          key={"calendar-view-filters"}
          filters={filters}
          className=""
        />
      </div>

      {/* Stats Cards */}
      <div className="py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div className="mb-2 text-xs text-gray-500">Total Visit</div>
            <div className="font-bold text-gray-900">
              {analytics?.statusCounts?.totalVisits ?? 0}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div className="mb-2 text-xs text-gray-500">Completed</div>
            <div className="font-bold text-gray-900">
              {analytics?.statusCounts?.completed ?? 0}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div className="mb-2 text-xs text-gray-500">Distance</div>
            <div className="font-bold text-gray-900">
              {totalDistance > 0 ? `${totalDistance.toFixed(2)} km` : "0 km"}
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
              {/* Gracefully handle user initials */}
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                {/* Handle case where user is not yet loaded */}
                {user
                  ? `${user.firstName} ${user.lastName}`
                  : "Loading user..."}
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
          <div
            className="relative pl-2 "
            style={{ maxHeight: "30vh", overflow: "auto" }}
          >
            {/* Handle Empty State for Timeline */}
            {timelineData.length > 0 ? (
              timelineData.map((item, index) => {
                if (item.type === "separator") {
                  return (
                    <div key={item.id} className="py-4">
                      <div className="border-t border-dashed border-gray-300" />
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="relative flex items-start gap-4 pb-8 last:pb-0"
                  >
                    {index < timelineData.length - 1 && (
                      <div className="absolute left-[5px] top-[12px] h-full w-0.5 bg-gray-200" />
                    )}
                    <div
                      className={`relative z-10 mt-1 h-3 w-3 flex-shrink-0 rounded-full ${item.color}`}
                    />
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
              })
            ) : (
              <div className="py-10 text-center text-sm text-gray-500">
                No activity recorded for this day.
              </div>
            )}
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
              {nearestAddress ?? "No location info available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrackingTimeline;
