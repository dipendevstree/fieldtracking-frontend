import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SimpleDatePickerProps {
  date: string;
  setDate: (date: string) => void;
}

export function SimpleDatePicker({ date, setDate }: SimpleDatePickerProps) {
  const [open, setOpen] = useState(false);
  const parsedDate = date ? new Date(date) : undefined;

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setDate(formattedDate);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[415px] pl-3 text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar mode="single" selected={parsedDate} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
