import { createFileRoute, useRouter } from "@tanstack/react-router";
import ScheduleVisitForm from "@/features/calendar/components/ScheduleVisitForm";
import { Main } from "@/components/layout/main";

export const Route = createFileRoute("/_authenticated/calendar/schedule-visit")(
  {
    component: ScheduleVisitPage,
  }
);

function ScheduleVisitPage() {
  const router = useRouter();
  return (
    <Main>
      <ScheduleVisitForm onClose={() => router.navigate({ to: '/calendar' })} />
    </Main>
  );
}
