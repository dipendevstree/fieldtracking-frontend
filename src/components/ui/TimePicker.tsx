import { useEffect, useState, useMemo, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isToday as checkIsToday } from "date-fns";
import { Clock } from "lucide-react";

interface TimePickerProps {
  /** The value in "HH:mm" (24-hour) format */
  value?: string;
  /** Callback function when the time changes, returns "HH:mm" format */
  onChange: (value: string) => void;
  /** The date for which the time is being selected */
  date?: string | Date;
  /** If true, disables past time selection for the current day */
  disablePast?: boolean;
  /** Time format: "12h" (AM/PM) or "24h" */
  format?: "12h" | "24h";
  className?: string;
}

// Generate arrays for hours, minutes, and periods
const hours12 = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const hours24 = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);
const periods = ["AM", "PM"];

export function TimePicker({
  value,
  onChange,
  date,
  disablePast = false,
  format = "12h", // ✅ Default to 12-hour format
  className,
}: TimePickerProps) {
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [isOpen, setIsOpen] = useState(false);

  const hourRef = useRef<HTMLButtonElement>(null);
  const minuteRef = useRef<HTMLButtonElement>(null);
  const periodRef = useRef<HTMLButtonElement>(null);

  // Parse the incoming "HH:mm" value into hour, minute, and period
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      const hour24 = parseInt(h, 10);

      if (format === "12h") {
        const newPeriod = hour24 >= 12 ? "PM" : "AM";
        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;
        setHour(String(hour12).padStart(2, "0"));
        setPeriod(newPeriod);
      } else {
        setHour(String(hour24).padStart(2, "0"));
      }

      setMinute(m);
    } else {
      setHour("");
      setMinute("");
      setPeriod("AM");
    }
  }, [value, format]);

  // When local state changes, combine into "HH:mm" format and call onChange
  useEffect(() => {
    if (hour && minute) {
      let hour24 = parseInt(hour, 10);

      if (format === "12h") {
        if (period === "PM" && hour24 < 12) hour24 += 12;
        if (period === "AM" && hour24 === 12) hour24 = 0;
      }

      const newValue = `${String(hour24).padStart(2, "0")}:${minute}`;
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  }, [hour, minute, period, format, onChange, value]);

  // Memoize current time details for disabling past times
  const { isToday, currentHour12, currentMinute, currentPeriod } =
    useMemo(() => {
      if (!disablePast || !date) {
        return {
          isToday: false,
          currentHour12: -1,
          currentMinute: -1,
          currentPeriod: "AM",
        };
      }
      const now = new Date();
      const selectedDate = new Date(date);
      const isToday = checkIsToday(selectedDate);

      return {
        isToday,
        currentHour12: now.getHours() % 12 || 12,
        currentMinute: now.getMinutes(),
        currentPeriod: now.getHours() >= 12 ? "PM" : "AM",
      };
    }, [date, disablePast]);

  // Scroll to selected values when the popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => hourRef.current?.scrollIntoView({ block: "center" }), 0);
      setTimeout(
        () => minuteRef.current?.scrollIntoView({ block: "center" }),
        0
      );
      setTimeout(
        () => periodRef.current?.scrollIntoView({ block: "center" }),
        0
      );
    }
  }, [isOpen]);

  const displayValue =
    value && hour && minute
      ? format === "12h"
        ? `${hour}:${minute} ${period}`
        : `${hour}:${minute}`
      : "Select a time...";

  const hourList = format === "12h" ? hours12 : hours24;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <div className="flex items-start gap-x-2 p-2">
          {/* Hour Column */}
          <div className="flex h-48 flex-col gap-1 overflow-y-auto pr-2">
            {hourList.map((h) => (
              <Button
                key={h}
                ref={hour === h ? hourRef : null}
                variant={hour === h ? "default" : "ghost"}
                onClick={() => setHour(h)}
                disabled={
                  isToday &&
                  format === "12h" &&
                  ((currentPeriod === "PM" && period === "AM") ||
                    (period === currentPeriod &&
                      parseInt(h, 10) < currentHour12))
                }
              >
                {h}
              </Button>
            ))}
          </div>

          {/* Minute Column */}
          <div className="flex h-48 flex-col gap-1 overflow-y-auto pr-2">
            {minutes.map((m) => (
              <Button
                key={m}
                ref={minute === m ? minuteRef : null}
                variant={minute === m ? "default" : "ghost"}
                onClick={() => setMinute(m)}
                disabled={
                  isToday &&
                  format === "12h" &&
                  period === currentPeriod &&
                  parseInt(hour, 10) === currentHour12 &&
                  parseInt(m, 10) < currentMinute
                }
              >
                {m}
              </Button>
            ))}
          </div>

          {/* Period Column (only for 12h mode) */}
          {format === "12h" && (
            <div className="flex h-48 flex-col gap-1 pr-2">
              {periods.map((p) => (
                <Button
                  key={p}
                  ref={period === p ? periodRef : null}
                  variant={period === p ? "default" : "ghost"}
                  onClick={() => setPeriod(p as "AM" | "PM")}
                  disabled={isToday && currentPeriod === "PM" && p === "AM"}
                >
                  {p}
                </Button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
