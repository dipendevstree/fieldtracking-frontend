import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const localizer = momentLocalizer(moment);

// Base style common to all events
const BASE_EVENT_STYLE: React.CSSProperties = {
  borderLeftWidth: "4px",
  borderLeftStyle: "solid",
  fontSize: "0.75rem",
  fontWeight: 600,
  padding: "2px 6px",
  borderRadius: "4px",
  marginBottom: "2px",
  outline: "none",
  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  cursor: "pointer",
  color: "#374151",
};

// --- STYLE CONFIGURATION ---
const EVENT_STYLES: Record<string, React.CSSProperties> = {
  // Leaves
  approved: {
    borderLeftColor: "#22c55e",
    backgroundColor: "#f0fdf4",
    color: "#15803d",
  },
  pending: {
    borderLeftColor: "#f97316",
    backgroundColor: "#fff7ed",
    color: "#c2410c",
  },
  rejected: {
    borderLeftColor: "#ef4444",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
  },

  // Holidays
  national: {
    borderLeftColor: "#3b82f6",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
  },
  festival: {
    borderLeftColor: "#a855f7",
    backgroundColor: "#faf5ff",
    color: "#7e22ce",
  },
  regional: {
    borderLeftColor: "#a855f7", // Purple
    backgroundColor: "#faf5ff",
    color: "#7e22ce",
  },
  optional: {
    borderLeftColor: "#10b981",
    backgroundColor: "#ecfdf5",
    color: "#047857",
  },
  weekend: {
    borderLeftColor: "#f97316",
    backgroundColor: "#fff7ed",
    color: "#c2410c",
  },

  // Default
  default: {
    borderLeftColor: "#6b7280",
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },
};

interface CalendarViewProps {
  events?: any[];
  onSelectEvent?: (event: any) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date; action: string }) => void;
  defaultView?: View;
  currentMode: "holiday" | "leave";
  onModeChange: (mode: "holiday" | "leave") => void;
  date: Date;
  onNavigate: (date: Date) => void;
  weekOffDays?: number[];
}

export default function CalendarView({
  events = [],
  onSelectEvent,
  onSelectSlot,
  defaultView = Views.MONTH,
  currentMode,
  onModeChange,
  date,
  onNavigate,
  weekOffDays = [],
}: CalendarViewProps) {
  const [view, setView] = useState<View>(defaultView);

  const onView = useCallback((newView: View) => setView(newView), []);

  // Optimized Event Prop Getter
  const eventPropGetter = useCallback((event: any) => {
    // Look up based on passed status key
    const statusKey = event.resource?.statusKey?.toLowerCase();

    // Find style or fallback
    const specificStyle = EVENT_STYLES[statusKey] || EVENT_STYLES.default;

    return {
      style: {
        ...BASE_EVENT_STYLE,
        ...specificStyle,
      },
    };
  }, []);

  const dayPropGetter = useCallback(
    (date: Date) => {
      const day = date.getDay();
      if (weekOffDays.includes(day)) {
        return {
          className: "bg-slate-100", // Increased contrast from slate-50
          style: {
            backgroundColor: "#f1f5f9", // slate-100
          },
        };
      }
      return {};
    },
    [weekOffDays]
  );

  return (
    <div className="space-y-4">
      <style>{`
        /* Header Styling */
        .rbc-header { background-color: #f8fafc; padding: 12px 0 !important; font-size: 0.85rem; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        
        /* Grid Borders & Radius */
        .rbc-month-view { border-radius: 0.75rem; overflow: hidden; border: 1px solid #e2e8f0; }
        .rbc-month-row { border-top: 1px solid #e2e8f0; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
        .rbc-off-range-bg { background-color: #f9fafb; }
        
        /* Highlight Today */
        .rbc-today { background-color: #eff6ff !important; } 
        
        /* Reset default event styles */
        .rbc-event { 
            background-color: transparent; 
            border: none; 
            padding: 0;
            border-radius: 0;
        }
        .rbc-event:focus { outline: none; }
      `}</style>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        view={view}
        date={date}
        onNavigate={onNavigate}
        onView={onView}
        popup
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              currentMode={currentMode}
              onModeChange={onModeChange}
            />
          ),
          month: {
            dateHeader: (props) => (
              <div className="p-2 text-sm font-medium text-gray-500 flex justify-between">
                <span>{props.label}</span>
              </div>
            ),
          },
        }}
        className="bg-white p-6 rounded-lg"
      />

      {/* Legend - Manual for Simplicity */}
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start px-6 pb-2 border-t pt-4">
        {currentMode === "holiday" ? (
          <>
            <LegendItem color="bg-blue-500" label="National Holiday" />
            <LegendItem color="bg-purple-500" label="Festival/Regional" />
            <LegendItem color="bg-emerald-500" label="Optional" />
            <LegendItem color="bg-slate-300" label="Weekend" />
          </>
        ) : (
          <>
            <LegendItem color="bg-green-500" label="Approved" />
            <LegendItem color="bg-orange-500" label="Pending" />
            <LegendItem color="bg-red-500" label="Rejected" />
            <LegendItem color="bg-slate-300" label="Weekend" />
          </>
        )}
      </div>
    </div>
  );
}

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <span
      className={cn("w-3 h-3 rounded-full ring-1 ring-slate-200", color)}
    ></span>
    <span className="text-sm text-slate-600 font-medium">{label}</span>
  </div>
);

const CustomToolbar = ({
  date,
  onNavigate,
  label,
  currentMode,
  onModeChange,
}: any) => {
  const currentDate = moment(date);
  const goToBack = () => onNavigate("PREV");
  const goToNext = () => onNavigate("NEXT");
  const goToToday = () => onNavigate("TODAY");
  const handleMonthChange = (value: string) =>
    onNavigate("DATE", currentDate.clone().month(parseInt(value)).toDate());
  const handleYearChange = (value: string) =>
    onNavigate("DATE", currentDate.clone().year(parseInt(value)).toDate());

  return (
    <div className="flex flex-col gap-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">
              {currentMode === "holiday"
                ? "Holiday Calendar"
                : "Leave Calendar"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            View upcoming {currentMode === "holiday" ? "holidays" : "leaves"}{" "}
            for the selected period
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={currentDate.month().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[140px] bg-white border-slate-200 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {moment().month(i).format("MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentDate.year().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px] bg-white border-slate-200 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }).map((_, i) => {
                const year = moment().year() - 2 + i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="bg-slate-100 p-1 rounded-lg inline-flex items-center">
          <button
            onClick={() => onModeChange("holiday")}
            className={cn(
              "px-6 py-2 text-sm font-semibold rounded-md transition-all",
              currentMode === "holiday"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Holiday Calendar
          </button>
          <button
            onClick={() => onModeChange("leave")}
            className={cn(
              "px-6 py-2 text-sm font-semibold rounded-md transition-all",
              currentMode === "leave"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Leave Calendar
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-slate-200 text-slate-500 hover:text-slate-900 bg-white"
          onClick={goToBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-baseline gap-4">
          <h2 className="text-xl font-bold text-slate-900">{label}</h2>
          <button
            onClick={goToToday}
            className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            Today
          </button>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-slate-200 text-slate-500 hover:text-slate-900 bg-white"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
