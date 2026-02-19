import { useCallback, useState, useMemo } from "react";
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
import { ATTENDANCE_STATUS } from "@/data/app.data";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LegendItem } from "@/components/ui/legend-item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDropDownLabel } from "@/utils/commonFunction";
import {
  AttendanceEvent,
  TeamAttendanceCalendarProps,
} from "@/features/attendance-management/types";

// --- 1. CONFIG & TYPES ---
const localizer = momentLocalizer(moment);

// --- 2. HELPERS ---
const getStatusStyles = (status: ATTENDANCE_STATUS) => {
  switch (status) {
    case ATTENDANCE_STATUS.PRESENT:
      return "bg-green-500 text-white";
    case ATTENDANCE_STATUS.LATE:
      return "bg-yellow-500 text-white";
    case ATTENDANCE_STATUS.HALF_DAY:
      return "bg-blue-500 text-white";
    case ATTENDANCE_STATUS.ABSENT:
      return "bg-red-500 text-white";
    case ATTENDANCE_STATUS.EARLY_EXIT:
      return "bg-amber-500 text-white";
    case ATTENDANCE_STATUS.LEAVE:
      return "bg-orange-500 text-white"; // Match legend "leave" color
    case ATTENDANCE_STATUS.HOLIDAY:
      return "bg-slate-300 text-white"; // Changed to match legend "week off / holiday" color
    case ATTENDANCE_STATUS.WEEK_OFF:
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
      getStatusStyles(event.resource.status),
    )}
  >
    {event.title}
  </div>
);

// --- CUSTOM TOOLBAR (Matching Reference) ---
const CustomToolbar = (toolbar: ToolbarProps & { date?: Date }) => {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToCurrent = () => toolbar.onNavigate("TODAY");

  // Check if viewing current or future month
  const isCurrentOrFutureMonth = () => {
    if (!toolbar.date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the first day of the NEXT month (where Next button would navigate to)
    const firstDayOfNextMonth = new Date(
      toolbar.date.getFullYear(),
      toolbar.date.getMonth() + 1,
      1,
    );
    firstDayOfNextMonth.setHours(0, 0, 0, 0);

    // Disable next if navigating to next month would go into the future
    return firstDayOfNextMonth > today;
  };

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
          disabled={isCurrentOrFutureMonth()}
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
  holidays = [],
  weekOffDays = [],
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
    [],
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
      // Prevent selecting future dates from manual calendar cell clicks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(slotInfo.start);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        toast.warning("Cannot select future dates");
        return;
      }

      onNavigate(slotInfo.start);
    },
    [onNavigate],
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
    [],
  );

  // Custom day styling to highlight selected date, holidays, and week-off days
  const dayPropGetter = useCallback(
    (calendarDate: Date) => {
      const isSelected =
        calendarDate.getDate() === date.getDate() &&
        calendarDate.getMonth() === date.getMonth() &&
        calendarDate.getFullYear() === date.getFullYear();

      // Check if date is a holiday
      const holiday = holidays.find((holiday: any) => {
        const holidayDate = new Date(holiday.date);
        return (
          holidayDate.getDate() === calendarDate.getDate() &&
          holidayDate.getMonth() === calendarDate.getMonth() &&
          holidayDate.getFullYear() === calendarDate.getFullYear()
        );
      });

      // Check if date is a week-off day
      const isWeekOff = weekOffDays.includes(calendarDate.getDay());

      let className = "";
      let title = "";

      if (isSelected) {
        className += " selected-date";
      }

      if (holiday) {
        className += " holiday-date";
        title = `${holiday.name}${holiday.description ? ` - ${holiday.description}` : ""}`;
      } else if (isWeekOff) {
        className += " weekoff-date";
        title = "Week Off";
      }

      return {
        className: className.trim(),
        title: title,
      };
    },
    [date, holidays, weekOffDays],
  );

  const { components } = useMemo(
    () => ({
      components: {
        month: {
          dateHeader: ({ date, label }: any) => {
            // Check if date is a holiday
            const holiday = holidays.find((holiday: any) => {
              const holidayDate = new Date(holiday.date);
              return (
                holidayDate.getDate() === date.getDate() &&
                holidayDate.getMonth() === date.getMonth() &&
                holidayDate.getFullYear() === date.getFullYear()
              );
            });

            // Check if date is a week-off day
            const isWeekOff = weekOffDays.includes(date.getDay());

            return (
              <div className="flex flex-col items-center">
                <span className="rbc-button-link">{label}</span>
                {holiday && (
                  <>
                    <span className="text-[10px] sm:text-xs text-emerald-600 font-bold truncate max-w-[95%] block mt-1 px-1">
                      {holiday.name}
                    </span>
                  </>
                )}
                {!holiday && isWeekOff && (
                  <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block mt-1">
                    Week Off
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
    <div className={cn("w-full bg-white", className)}>
      {/* CSS Injection for exact visual match */}
      <style>{`
        .rbc-month-view { border-radius: 0.75rem; border: 1px solid #e2e8f0; overflow: hidden; background: white; }
        .rbc-header { padding: 12px 0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; background: #fff; border-bottom: 1px solid #e2e8f0; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
        .rbc-month-row { border-bottom: 1px solid #e2e8f0; min-height: 120px; }
        .rbc-date-cell { padding-top: 8px; text-align: left; font-size: 0.9rem; font-weight: 600; color: #334155; }
        .rbc-today { background-color: transparent !important; }
        .selected-date { border: 2px solid #3b82f6 !important; }
        .holiday-date { background-color: #f1f5f9 !important; position: relative; }
        .holiday-date .rbc-date-cell { color: #059669 !important; font-weight: 700 !important; }
        .weekoff-date { background-color: #f8fafc !important; position: relative; }
        .weekoff-date .rbc-date-cell { color: #64748b !important; font-weight: 600 !important; }
        .rbc-event { min-height: 0; }
        .rbc-row-segment { padding: 2px 4px !important; }
        .rbc-row-content .rbc-row { display: flex; flex-wrap: wrap; gap: 4px; padding-left: 6px; }
      `}</style>

      {/* CALENDAR */}
      <div className="h-[750px]">
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
            toolbar: ((props: any) => (
              <CustomToolbar {...props} date={date} />
            )) as any,
            event: EventComponent,
            ...components,
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
                    getStatusStyles(event.resource.status).split(" ")[0],
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
                      {event.resource.leaveType && (
                        <span className="ml-1 text-gray-500">
                          - {event.resource.leaveType}
                          {event.resource.halfDay &&
                            ` (${formatDropDownLabel(event.resource.halfDayType || "Half Day")})`}
                        </span>
                      )}
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
