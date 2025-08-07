import { createFileRoute } from "@tanstack/react-router";
import ScheduleVisitForm from "@/features/calendar/components/ScheduleVisitForm";
import { Main } from "@/components/layout/main";

export const Route = createFileRoute("/_authenticated/calendar/schedule-visit")(
  {
    component: ScheduleVisitPage,
  }
);

function ScheduleVisitPage() {
  return (
    <Main>
      <ScheduleVisitForm onClose={() => window.history.back()} />
    </Main>
  );
}
