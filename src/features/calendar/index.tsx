// src/features/calendar/index.tsx
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import CalendarView from "./components/CalendarView";

export default function CalendarPage() {
  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <CalendarView />
    </Main>
  );
}
