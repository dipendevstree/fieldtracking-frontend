import { useEffect, useState, useMemo, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimePickerProps {
  /** The value in "HH:mm" (24-hour) format */
  value?: string;
  /** Callback when the time changes (returns "HH:mm" 24h format) */
  onChange: (value: string) => void;
  /** If true, disables past times based on current system time when selectedDate is today */
  disablePast?: boolean;
  /** Time format: "12h" (AM/PM) or "24h" */
  format?: "12h" | "24h";
  className?: string;
  /** Optional: the date this time belongs to (used for disablePast logic) */
  selectedDate?: Date;
}

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
  disablePast = false,
  format = "12h",
  className,
  selectedDate,
}: TimePickerProps) {
  // Confirmed state (what's actually applied)
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Pending state (temporary selection before Apply)
  const [pendingHour, setPendingHour] = useState<string>("");
  const [pendingMinute, setPendingMinute] = useState<string>("");
  const [pendingPeriod, setPendingPeriod] = useState<"AM" | "PM">("AM");

  const [isOpen, setIsOpen] = useState(false);

  const hourRef = useRef<HTMLButtonElement>(null);
  const minuteRef = useRef<HTMLButtonElement>(null);
  const periodRef = useRef<HTMLButtonElement>(null);

  // Parse incoming value into confirmed state
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

  // Initialize pending state when popover opens
  useEffect(() => {
    if (isOpen) {
      setPendingHour(hour);
      setPendingMinute(minute);
      setPendingPeriod(period);

      // Scroll to active value after state is set
      setTimeout(
        () => hourRef.current?.scrollIntoView({ block: "center" }),
        50
      );
      setTimeout(
        () => minuteRef.current?.scrollIntoView({ block: "center" }),
        50
      );
      setTimeout(
        () => periodRef.current?.scrollIntoView({ block: "center" }),
        50
      );
    }
  }, [isOpen, hour, minute, period]);

  // System time (used for disablePast)
  const { currentHour24, currentMinute } = useMemo(() => {
    const now = new Date();
    return {
      currentHour24: now.getHours(),
      currentMinute: now.getMinutes(),
    };
  }, []);

  const handleApply = () => {
    if (pendingHour && pendingMinute) {
      let hour24 = parseInt(pendingHour, 10);
      if (format === "12h") {
        if (pendingPeriod === "PM" && hour24 < 12) hour24 += 12;
        if (pendingPeriod === "AM" && hour24 === 12) hour24 = 0;
      }
      const newValue = `${String(hour24).padStart(2, "0")}:${pendingMinute}`;

      // Update confirmed state
      setHour(pendingHour);
      setMinute(pendingMinute);
      setPeriod(pendingPeriod);

      // Emit change
      onChange(newValue);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Revert to confirmed state
    setPendingHour(hour);
    setPendingMinute(minute);
    setPendingPeriod(period);
    setIsOpen(false);
  };

  const displayValue =
    value && hour && minute
      ? format === "12h"
        ? `${hour}:${minute} ${period}`
        : `${hour}:${minute}`
      : "Select A Time...";

  const hourList = format === "12h" ? hours12 : hours24;

  // Check if selected date is today
  const isToday = useMemo(() => {
    if (!selectedDate) return false;
    const now = new Date();
    return selectedDate.toDateString() === now.toDateString();
  }, [selectedDate]);

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
        <div className="flex flex-col">
          <div className="flex items-start gap-x-2 p-2">
            {/* Hour Column */}
            <div
              className="flex h-48 flex-col gap-1 overflow-y-auto pr-2"
              onWheel={(e) => {
                e.stopPropagation();
              }}
            >
              {hourList.map((h) => (
                <Button
                  key={h}
                  ref={pendingHour === h ? hourRef : null}
                  variant={pendingHour === h ? "default" : "ghost"}
                  onClick={() => setPendingHour(h)}
                  disabled={
                    disablePast &&
                    isToday &&
                    (() => {
                      const selectedHour24 =
                        format === "12h"
                          ? pendingPeriod === "PM"
                            ? (parseInt(h, 10) % 12) + 12
                            : parseInt(h, 10) % 12
                          : parseInt(h, 10);
                      return selectedHour24 < currentHour24;
                    })()
                  }
                >
                  {h}
                </Button>
              ))}
            </div>

            {/* Minute Column */}
            <div
              className="flex h-48 flex-col gap-1 overflow-y-auto pr-2"
              onWheel={(e) => {
                e.stopPropagation();
              }}
            >
              {minutes.map((m) => (
                <Button
                  key={m}
                  ref={pendingMinute === m ? minuteRef : null}
                  variant={pendingMinute === m ? "default" : "ghost"}
                  onClick={() => setPendingMinute(m)}
                  disabled={
                    disablePast &&
                    isToday &&
                    (() => {
                      const selectedHour24 =
                        format === "12h"
                          ? pendingPeriod === "PM"
                            ? (parseInt(pendingHour, 10) % 12) + 12
                            : parseInt(pendingHour, 10) % 12
                          : parseInt(pendingHour, 10);
                      return (
                        selectedHour24 === currentHour24 &&
                        parseInt(m, 10) < currentMinute
                      );
                    })()
                  }
                >
                  {m}
                </Button>
              ))}
            </div>

            {/* Period Column (12h only) */}
            {format === "12h" && (
              <div className="flex h-48 flex-col gap-1 pr-2">
                {periods.map((p) => (
                  <Button
                    key={p}
                    ref={pendingPeriod === p ? periodRef : null}
                    variant={pendingPeriod === p ? "default" : "ghost"}
                    onClick={() => setPendingPeriod(p as "AM" | "PM")}
                    disabled={
                      disablePast &&
                      isToday &&
                      (() => {
                        const now = new Date();
                        const currentPeriod =
                          now.getHours() >= 12 ? "PM" : "AM";
                        if (currentPeriod === "PM" && p === "AM") return true;
                        return false;
                      })()
                    }
                  >
                    {p}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 border-t p-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={!pendingHour || !pendingMinute}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
