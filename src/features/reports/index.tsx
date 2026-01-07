import { Main } from "@/components/layout/main";
import ExpanseReport from "./components/expanseReport";
import { useReportSocketTracker } from "./hooks/useReportSocketTracker";
import { cn } from "@/lib/utils";

export default function Reports() {
  // Socket listeners
  useReportSocketTracker();

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <ExpanseReport />
    </Main>
  );
}
