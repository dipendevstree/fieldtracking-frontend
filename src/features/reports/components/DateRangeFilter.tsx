import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  label?: string;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  label = "Date Range",
  dateRange,
  setDateRange,
}) => {
  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal pr-10" // space for clear icon
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span className="text-muted-foreground">Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {dateRange?.from || dateRange?.to ? (
        <button
          type="button"
          onClick={() => setDateRange(undefined)}
          className="absolute right-2 top-[38px] text-gray-400 hover:text-red-500"
          title="Clear date range"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
};
