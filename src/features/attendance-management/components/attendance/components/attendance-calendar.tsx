import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ATTENDANCE_STATUS } from "@/data/app.data";
import { LegendItem } from "@/components/ui/legend-item";

const localizer = momentLocalizer(moment);

export interface AttendanceEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    status: ATTENDANCE_STATUS;
    checkIn?: string;
    checkOut?: string;
    [key: string]: any;
  };
}

interface AttendanceCalendarProps {
  events: AttendanceEvent[];
  date: Date;
  onNavigate: (date: Date) => void;
  onSelectEvent?: (event: AttendanceEvent) => void;
}

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
      }; // Distinct Amber
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
    <div className="flex flex-col items-center justify-center h-full w-full space-y-1.5 pt-1">
      <span
        className={cn(
          "text-[10px] px-2 py-0.5 rounded text-white font-semibold shadow-sm",
          styles.badge
        )}
      >
        {formatStatus(status)}
      </span>

      {(checkIn || checkOut) && (
        <div className="flex flex-col items-center text-[10px] leading-tight text-slate-600 font-medium">
          <span>
            {checkIn || "--:--"} - {checkOut || "--:--"}
          </span>
        </div>
      )}
    </div>
  );
};

const CustomToolbar = ({ onNavigate, label }: any) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 px-1">
      <div className="flex items-center gap-2 self-start md:self-auto">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Attendance Calendar
          </h2>
          <p className="text-xs text-slate-500">
            View check-ins and work patterns
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2  p-1 rounded-lg border border-slate-200">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onNavigate("PREV")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold w-32 text-center text-slate-700">
          {label}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onNavigate("NEXT")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
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
}: AttendanceCalendarProps) {
  const dayPropGetter = useCallback(
    (currentDate: Date) => {
      const daysEvent = events.find((evt) => isSameDay(evt.start, currentDate));
      const status = daysEvent?.resource?.status as ATTENDANCE_STATUS;
      const styles = getStatusStyles(status);

      return {
        className: cn(
          styles.bg,
          "transition-colors hover:brightness-95 cursor-pointer"
        ),
        style: { margin: 0 },
      };
    },
    [events]
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
    []
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <style>{`
        .rbc-month-view { border-radius: 0.75rem; border: 1px solid #e2e8f0; overflow: hidden; }
        .rbc-header { padding: 12px 0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; background: #fff; border-bottom: 1px solid #e2e8f0; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
        .rbc-month-row { border-top: 1px solid #e2e8f0; min-height: 110px; }
        .rbc-off-range-bg { background-color: #f9fafb !important; opacity: 0.5; }
        .rbc-date-cell { padding-right: 0; text-align: center; padding-top: 8px; }
        .rbc-date-cell > a { font-size: 0.85rem; font-weight: 600; color: #334155; pointer-events: none; }
        .rbc-today { background-color: transparent !important; }
        .rbc-now .rbc-button-link { background-color: #e2e8f0; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; }
        .rbc-event-content { pointer-events: auto; }
      `}</style>

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
        selectable={true}
        onSelectEvent={onSelectEvent}
        components={{ toolbar: CustomToolbar, event: AttendanceEventComponent }}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        style={{ height: 750 }}
      />

      <div className="mt-2  py-3 flex flex-wrap gap-4 text-xs text-slate-600">
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
