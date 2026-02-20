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
      return "bg-orange-500 text-white";
    case ATTENDANCE_STATUS.HOLIDAY:
      return "bg-slate-300 text-white";
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
      "w-5 h-5 sm:w-6 sm:h-6 text-[9px] sm:text-[10px] font-bold rounded-sm flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 hover:opacity-90 transition-all",
      getStatusStyles(event.resource.status),
    )}
  >
    {event.title}
  </div>
);

// --- CUSTOM TOOLBAR ---
const CustomToolbar = (toolbar: ToolbarProps & { date?: Date }) => {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToCurrent = () => toolbar.onNavigate("TODAY");

  const isCurrentOrFutureMonth = () => {
    if (!toolbar.date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfNextMonth = new Date(
      toolbar.date.getFullYear(),
      toolbar.date.getMonth() + 1,
      1,
    );
    firstDayOfNextMonth.setHours(0, 0, 0, 0);

    return firstDayOfNextMonth > today;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 px-1">
      <div className="self-start md:self-auto">
        <h2 className="text-lg font-bold text-slate-900">
          Attendance Calendar
        </h2>
        <p className="text-xs text-slate-500">
          View check-ins and work patterns
        </p>
      </div>

      <div className="flex items-center gap-2 p-1 rounded-lg border border-slate-200 bg-white shadow-sm w-full md:w-auto justify-between md:justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={goToBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold w-32 sm:w-40 text-center text-slate-700 select-none truncate">
          {toolbar.label}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={goToNext}
          disabled={isCurrentOrFutureMonth()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 self-end md:self-auto hidden md:flex">
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

  const handleShowMore = useCallback(
    (events: AttendanceEvent[], date: Date) => {
      setModalEvents(events);
      setModalDate(date);
      setShowModal(true);
    },
    [],
  );

  const handleEventClick = useCallback((event: AttendanceEvent) => {
    setModalEvents([event]);
    setModalDate(event.start);
    setShowModal(true);
  }, []);

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date }) => {
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

  const eventPropGetter = useCallback(
    () => ({
      style: { display: "none" },
    }),
    [],
  );

  const dayPropGetter = useCallback(
    (calendarDate: Date) => {
      const isSelected =
        calendarDate.getDate() === date.getDate() &&
        calendarDate.getMonth() === date.getMonth() &&
        calendarDate.getFullYear() === date.getFullYear();

      const holiday = holidays.find((holiday: any) => {
        const holidayDate = new Date(holiday.date);
        return (
          holidayDate.getDate() === calendarDate.getDate() &&
          holidayDate.getMonth() === calendarDate.getMonth() &&
          holidayDate.getFullYear() === calendarDate.getFullYear()
        );
      });

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
            const holiday = holidays.find((holiday: any) => {
              const holidayDate = new Date(holiday.date);
              return (
                holidayDate.getDate() === date.getDate() &&
                holidayDate.getMonth() === date.getMonth() &&
                holidayDate.getFullYear() === date.getFullYear()
              );
            });

            const isWeekOff = weekOffDays.includes(date.getDay());

            const dayEvents = events.filter((e) => {
              const eDate = new Date(e.start);
              return (
                eDate.getDate() === date.getDate() &&
                eDate.getMonth() === date.getMonth() &&
                eDate.getFullYear() === date.getFullYear()
              );
            });

            //  Max 6 boxes total. (5 events + 1 count box)
            const MAX_TOTAL_BOXES = 6;
            let visibleEvents = dayEvents;
            let hiddenCount = 0;

            if (dayEvents.length > MAX_TOTAL_BOXES) {
              visibleEvents = dayEvents.slice(0, MAX_TOTAL_BOXES - 1);
              hiddenCount = dayEvents.length - (MAX_TOTAL_BOXES - 1);
            }

            return (
              <div className="flex flex-col items-center w-full pb-1">
                <span className="rbc-button-link">{label}</span>
                {holiday && (
                  <span className="text-[9px] sm:text-[12px] text-emerald-600 font-bold truncate max-w-[95%] block mt-0.5 px-1">
                    {holiday.name}
                  </span>
                )}
                {!holiday && isWeekOff && (
                  <span className="text-[9px] sm:text-[12px] text-slate-500 font-semibold block mt-0.5">
                    Week Off
                  </span>
                )}

                {dayEvents.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mt-1.5 px-0.5 w-full max-w-[85px]">
                    {visibleEvents.map((event, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        <EventComponent event={event} />
                      </div>
                    ))}

                    {/* The "+X" Count Box */}
                    {hiddenCount > 0 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowMore(dayEvents, date);
                        }}
                        title={`View ${hiddenCount} more events`}
                        className="w-5 h-5 sm:w-6 sm:h-6 text-[9px] sm:text-[10px] font-bold rounded-sm flex items-center justify-center cursor-pointer shadow-sm transition-all bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 hover:scale-105"
                      >
                        {hiddenCount}+
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          },
        },
      },
    }),
    [holidays, weekOffDays, events, handleEventClick, handleShowMore],
  );

  return (
    <div
      className={cn(
        "w-full bg-white rounded-xl shadow-sm border border-slate-100 p-2 sm:p-4",
        className,
      )}
    >
      <style>{`
        .rbc-month-view { border-radius: 0.5rem; border: 1px solid #e2e8f0; overflow: hidden; background: white; }
        .rbc-header { padding: 8px 0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
        .rbc-month-row { border-bottom: 1px solid #e2e8f0; min-height: 110px; }
        .rbc-date-cell { padding-top: 4px; text-align: left; font-size: 0.85rem; font-weight: 600; color: #334155; }
        .rbc-today { background-color: transparent !important; }
        .selected-date { border: 2px solid #3b82f6 !important; }
        .holiday-date { background-color: #f1f5f9 !important; }
        .holiday-date .rbc-date-cell { color: #059669 !important; font-weight: 700 !important; }
        .weekoff-date { background-color: #f8fafc !important; }
        .weekoff-date .rbc-date-cell { color: #64748b !important; font-weight: 600 !important; }
        
        /* Hide default RBC overlapping event rows */
        .rbc-month-view .rbc-row-content .rbc-row:nth-child(n+2) { display: none !important; }
        .rbc-month-view .rbc-show-more { display: none !important; }

        /* Custom Elegant Scrollbar for smaller screens */
        .calendar-scroll-container::-webkit-scrollbar { height: 8px; }
        .calendar-scroll-container::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 8px; }
        .calendar-scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .calendar-scroll-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/*
        overflow-x-auto allows horizontal scrolling ONLY when the screen is smaller than 768px.
      */}
      <div className="w-full overflow-x-auto calendar-scroll-container pb-4">
        <div className="h-[650px] sm:h-[750px] min-w-[768px]">
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
      </div>

      {/* Modal for Event Details */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {modalDate
                ? modalDate.toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Event Details"}
              {modalEvents.length > 1 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({modalEvents.length} users)
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {modalEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-md shrink-0 ring-2 ring-white shadow-sm",
                    getStatusStyles(event.resource.status).split(" ")[0],
                  )}
                />
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-800 bg-white px-3 py-1 rounded-md border-2 border-gray-200 min-w-[40px] text-center shadow-sm">
                    {event.title}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {event.resource.name}
                    </div>
                    <div className="text-xs text-gray-600 capitalize font-medium mt-0.5">
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

      {/* Legends */}
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
