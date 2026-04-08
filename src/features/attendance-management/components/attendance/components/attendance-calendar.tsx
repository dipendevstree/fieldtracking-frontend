import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ATTENDANCE_STATUS } from "@/data/app.data";
import { LegendItem } from "@/components/ui/legend-item";
import { toast } from "sonner";
import { IconInfoCircle } from "@tabler/icons-react";
import {
  AttendanceCalendarProps,
  AttendanceEvent,
} from "@/features/attendance-management/types";

const localizer = momentLocalizer(moment);

// --- HELPER: BE Enum -> Tailwind Styles ---
const getStatusStyles = (status: ATTENDANCE_STATUS) => {
  switch (status) {
    case ATTENDANCE_STATUS.PRESENT:
      return {
        bg: "bg-green-50",
        badge: "bg-green-500",
        text: "text-green-700",
      };
    case ATTENDANCE_STATUS.LATE:
      return {
        bg: "bg-yellow-50",
        badge: "bg-yellow-500",
        text: "text-yellow-700",
      };
    case ATTENDANCE_STATUS.EARLY_EXIT:
      return {
        bg: "bg-amber-50",
        badge: "bg-amber-600",
        text: "text-amber-800",
      };
    case ATTENDANCE_STATUS.HALF_DAY:
      return { bg: "bg-blue-50", badge: "bg-blue-500", text: "text-blue-700" };
    case ATTENDANCE_STATUS.LEAVE:
      return {
        bg: "bg-orange-50",
        badge: "bg-orange-500",
        text: "text-orange-700",
      };
    case ATTENDANCE_STATUS.ABSENT:
      return { bg: "bg-red-50", badge: "bg-red-500", text: "text-red-700" };
    case ATTENDANCE_STATUS.WEEK_OFF:
    case ATTENDANCE_STATUS.HOLIDAY:
      return {
        bg: "bg-slate-50",
        badge: "bg-slate-300",
        text: "text-slate-500",
      };
    default:
      return { bg: "bg-white", badge: "bg-slate-400", text: "text-slate-600" };
  }
};

// Helper to format Enum text (e.g. "EARLY_EXIT" -> "Early Exit")
const formatStatus = (status: string) => {
  return status?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const AttendanceEventComponent = ({ event }: { event: AttendanceEvent }) => {
  const { status, checkIn, checkOut } = event.resource;
  const styles = getStatusStyles(status);

  // Minimal view for Week Off / Holiday
  if (
    status === ATTENDANCE_STATUS.WEEK_OFF ||
    status === ATTENDANCE_STATUS.HOLIDAY
  ) {
    return (
      <div className="h-full w-full flex items-center justify-center pt-2">
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          {formatStatus(status)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-1 sm:space-y-1.5 pt-1">
      <span
        className={cn(
          "text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded text-white font-semibold shadow-sm",
          styles.badge,
        )}
      >
        {formatStatus(status)}
      </span>

      {(checkIn || checkOut) && (
        <div className="flex flex-col items-center text-[9px] sm:text-[10px] leading-tight text-slate-600 font-medium">
          <span>
            {checkIn || "--:--"} - {checkOut || "--:--"}
          </span>
        </div>
      )}
    </div>
  );
};

const CustomToolbar = ({ onNavigate, label, date, isSelectable }: any) => {
  // Check if viewing current or future month
  const isCurrentOrFutureMonth = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the first day of the NEXT month
    const firstDayOfNextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1,
    );
    firstDayOfNextMonth.setHours(0, 0, 0, 0);

    return firstDayOfNextMonth > today;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 px-1">
      <div className="flex items-center gap-2 self-start md:self-auto">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Attendance Calendar
          </h2>
          {isSelectable && (
            <p className="text-[11px] sm:text-xs text-blue-600 flex items-center gap-1.5 mt-0.5 bg-blue-50 py-1 px-2 rounded-md border border-blue-100">
              <IconInfoCircle size={14} className="shrink-0" />
              Click on a date to request an attendance correction.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 p-1 rounded-lg border border-slate-200 bg-white shadow-sm w-full md:w-auto justify-between md:justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => onNavigate("PREV")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold w-32 sm:w-40 text-center text-slate-700 truncate">
          {label}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => onNavigate("NEXT")}
          disabled={isCurrentOrFutureMonth()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 self-end md:self-auto hidden md:flex">
        <Button variant="outline" size="sm" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
      </div>
    </div>
  );
};

export default function AttendanceCalendarView({
  events,
  date,
  onNavigate,
  onSelectEvent,
  onSelectSlot,
  holidays = [],
  weekOffDays = [],
  isSelectable,
  className,
}: AttendanceCalendarProps & { className?: string }) {
  const dayPropGetter = useCallback(
    (currentDate: Date) => {
      const daysEvent = events.find((evt) => isSameDay(evt.start, currentDate));
      const status = daysEvent?.resource?.status as ATTENDANCE_STATUS;
      const styles = getStatusStyles(status);

      return {
        className: cn(
          styles.bg,
          "transition-colors hover:brightness-95 cursor-pointer",
        ),
        style: { margin: 0 },
      };
    },
    [events],
  );

  const eventPropGetter = useCallback(
    () => ({
      style: {
        backgroundColor: "transparent",
        padding: 0,
        border: "none",
        outline: "none",
        height: "100%",
      },
    }),
    [],
  );

  const { components } = useMemo(
    () => ({
      components: {
        month: {
          dateHeader: ({ date: cellDate, label }: any) => {
            // Check if date is a holiday
            const holiday = holidays.find((holiday: any) => {
              const holidayDate = new Date(holiday.date);
              return (
                holidayDate.getDate() === cellDate.getDate() &&
                holidayDate.getMonth() === cellDate.getMonth() &&
                holidayDate.getFullYear() === cellDate.getFullYear()
              );
            });

            return (
              <div className="flex flex-col items-center">
                <span className="rbc-button-link">{label}</span>
                {holiday && (
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold truncate max-w-[95%] block mt-0.5 px-1">
                    {holiday.name}
                  </span>
                )}
              </div>
            );
          },
        },
      },
    }),
    [holidays, weekOffDays],
  );

  return (
    <div
      className={cn(
        "w-full bg-white rounded-xl shadow-sm border border-slate-100 p-2 sm:p-4 md:p-6",
        className,
      )}
    >
      <style>{`
        .rbc-month-view { border-radius: 0.5rem; border: 1px solid #e2e8f0; overflow: hidden; background: white; }
        .rbc-header { padding: 8px 0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
        .rbc-month-row { border-top: 1px solid #e2e8f0; min-height: 110px; }
        .rbc-off-range-bg { background-color: #f9fafb !important; opacity: 0.5; }
        .rbc-date-cell { padding-right: 0; text-align: center; padding-top: 8px; }
        .rbc-date-cell > a { font-size: 0.85rem; font-weight: 600; color: #334155; pointer-events: none; }
        .rbc-today { background-color: transparent !important; }
        .rbc-now .rbc-button-link { background-color: #e2e8f0; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; }
        .rbc-event-content { pointer-events: auto; }

        /* Custom Elegant Scrollbar for horizontal scrolling on mobile */
        .calendar-scroll-container::-webkit-scrollbar { height: 8px; }
        .calendar-scroll-container::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 8px; }
        .calendar-scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .calendar-scroll-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* Horizontal scroll wrapper for screens under 768px */}
      <div className="w-full overflow-x-auto calendar-scroll-container pb-4">
        <div className="h-[650px] sm:h-[750px] min-w-[768px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={Views.MONTH}
            onView={() => {}}
            date={date}
            onNavigate={onNavigate}
            toolbar={true}
            selectable={isSelectable}
            onSelectEvent={onSelectEvent}
            onSelectSlot={
              onSelectSlot
                ? (slotInfo) => {
                    // Prevent selecting future dates
                    const selectedDate = new Date(slotInfo.start);
                    const today = new Date();
                    selectedDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate > today) {
                      toast.warning("Cannot select future dates");
                      return;
                    }

                    // Call the parent's onSelectSlot handler
                    onSelectSlot(slotInfo);
                  }
                : undefined
            }
            components={{
              toolbar: (props) => (
                <CustomToolbar
                  {...props}
                  date={date}
                  isSelectable={isSelectable}
                />
              ),
              event: AttendanceEventComponent,
              ...components,
            }}
            dayPropGetter={dayPropGetter}
            eventPropGetter={eventPropGetter}
          />
        </div>
      </div>

      {/* Legends aligned responsively */}
      <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
        <LegendItem label="present" />
        <LegendItem label="late" />
        <LegendItem label="early exit" />
        <LegendItem label="half day" />
        <LegendItem label="leave" />
        <LegendItem label="absent" />
        <LegendItem label="week off / holiday" />
      </div>
    </div>
  );
}
