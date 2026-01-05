import { useCallback, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  Views,
  ToolbarProps,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LegendItem } from "@/components/ui/legend-item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- 1. CONFIG & TYPES ---

const localizer = momentLocalizer(moment);

export enum ATTENDANCE_STATUS {
  PRESENT = "PRESENT",
  LATE = "LATE",
  HALF_DAY = "HALF_DAY",
  WFH = "WFH",
  ON_LEAVE = "ON_LEAVE",
  HOLIDAY = "HOLIDAY",
  WEEKEND = "WEEKEND",
}

export interface AttendanceEvent {
  id: string;
  title: string; // Initials (e.g., "JS")
  start: Date;
  end: Date;
  resource: {
    status: ATTENDANCE_STATUS;
    name: string;
  };
}

export interface EmployeeData {
  id: string;
  name: string;
}

interface TeamAttendanceCalendarProps {
  events: AttendanceEvent[];
  date: Date;
  onNavigate: (date: Date) => void;
  className?: string;
}

// --- 2. HELPERS ---

const getStatusStyles = (status: ATTENDANCE_STATUS) => {
  switch (status) {
    case ATTENDANCE_STATUS.PRESENT:
      return "bg-green-500 text-white";
    case ATTENDANCE_STATUS.LATE:
      return "bg-yellow-500 text-white";
    case ATTENDANCE_STATUS.HALF_DAY:
      return "bg-blue-500 text-white";
    case ATTENDANCE_STATUS.WFH:
      return "bg-purple-500 text-white";
    case ATTENDANCE_STATUS.ON_LEAVE:
      return "bg-red-500 text-white"; // Changed to match legend "absent" color
    case ATTENDANCE_STATUS.HOLIDAY:
      return "bg-slate-300 text-white"; // Changed to match legend "week off / holiday" color
    case ATTENDANCE_STATUS.WEEKEND:
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-slate-300 text-white";
  }
};

// --- 3. SUB-COMPONENTS ---

const EventComponent = ({ event }: { event: AttendanceEvent }) => (
  <div
    title={`${event.resource.name} - ${event.resource.status}`}
    className={cn(
      "w-6 h-6 md:w-7 md:h-7 text-[10px] md:text-xs font-semibold rounded-sm flex items-center justify-center cursor-pointer shadow-sm hover:opacity-80 transition-opacity",
      getStatusStyles(event.resource.status)
    )}
  >
    {event.title}
  </div>
);

// --- CUSTOM TOOLBAR (Matching Reference) ---
const CustomToolbar = (toolbar: ToolbarProps) => {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToCurrent = () => toolbar.onNavigate("TODAY");

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 px-1">
      {/* LEFT: Name */}
      <div className="self-start md:self-auto">
        <h2 className="text-lg font-bold text-slate-900">
          Attendance Calendar
        </h2>
        <p className="text-xs text-slate-500">
          View check-ins and work patterns
        </p>
      </div>

      {/* MIDDLE: Date & Arrows */}
      <div className="flex items-center gap-2 p-1 rounded-lg border border-slate-200 bg-white">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={goToBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold w-40 text-center text-slate-700 select-none">
          {toolbar.label}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* RIGHT: Today Button */}
      <div className="flex gap-2 self-end md:self-auto">
        <Button variant="outline" size="sm" onClick={goToCurrent}>
          Today
        </Button>
      </div>
    </div>
  );
};

// --- 4. MAIN COMPONENT ---

export function TeamAttendanceCalendar({
  events,
  date,
  onNavigate,
  className,
}: TeamAttendanceCalendarProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<AttendanceEvent[]>([]);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  // Handle show more events - show in modal
  const handleShowMore = useCallback(
    (events: AttendanceEvent[], date: Date) => {
      setModalEvents(events);
      setModalDate(date);
      setShowModal(true);
    },
    []
  );

  // Handle individual event click
  const handleEventClick = useCallback((event: AttendanceEvent) => {
    setModalEvents([event]);
    setModalDate(event.start);
    setShowModal(true);
  }, []);

  // Handle date slot selection (clicking on a date)
  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date }) => {
      onNavigate(slotInfo.start);
    },
    [onNavigate]
  );

  // Style overrides logic
  const eventPropGetter = useCallback(
    () => ({
      style: {
        backgroundColor: "transparent",
        padding: 0,
        border: "none",
        outline: "none",
        width: "fit-content",
        display: "inline-block",
        marginRight: "4px",
        marginBottom: "2px",
      },
    }),
    []
  );

  // Custom day styling to highlight selected date
  const dayPropGetter = useCallback(
    (calendarDate: Date) => {
      const isSelected =
        calendarDate.getDate() === date.getDate() &&
        calendarDate.getMonth() === date.getMonth() &&
        calendarDate.getFullYear() === date.getFullYear();

      if (isSelected) {
        return {
          className: "selected-date",
        };
      }
      return {};
    },
    [date]
  );

  return (
    <div className={cn("w-full bg-white", className)}>
      {/* CSS Injection for exact visual match */}
      <style>{`
        .rbc-month-view { border-radius: 0.75rem; border: 1px solid #e2e8f0; overflow: hidden; background: white; }
        .rbc-header { padding: 12px 0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; background: #fff; border-bottom: 1px solid #e2e8f0; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
        .rbc-month-row { border-bottom: 1px solid #e2e8f0; min-height: 120px; }
        .rbc-date-cell { padding: 8px; text-align: left; font-size: 0.9rem; font-weight: 600; color: #334155; }
        .rbc-today { background-color: transparent !important; }
        .selected-date { border: 2px solid #3b82f6 !important; }
        .rbc-event { min-height: 0; }
        .rbc-row-segment { padding: 2px 4px !important; }
        .rbc-row-content .rbc-row { display: flex; flex-wrap: wrap; gap: 4px; padding-left: 6px; }
      `}</style>

      {/* CALENDAR */}
      <div className="h-[700px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH]}
          defaultView={Views.MONTH}
          date={date}
          onNavigate={onNavigate}
          onSelectSlot={handleSelectSlot}
          onShowMore={handleShowMore}
          onSelectEvent={handleEventClick}
          popup={false}
          components={{
            toolbar: CustomToolbar as any,
            event: EventComponent,
          }}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          selectable
        />
      </div>

      {/* Modal for Event Details */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {modalDate ? modalDate.toLocaleDateString() : "Event Details"}
              {modalEvents.length > 1 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({modalEvents.length} users)
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {modalEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-md shrink-0 ring-2 ring-white shadow-sm",
                    getStatusStyles(event.resource.status).split(" ")[0]
                  )}
                />
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-800 bg-white px-3 py-1 rounded-md border-2 border-gray-200 min-w-[40px] text-center shadow-sm">
                    {event.title}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {event.resource.name}
                    </div>
                    <div className="text-xs text-gray-600 capitalize font-medium">
                      {event.resource.status.toLowerCase().replace("_", " ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
