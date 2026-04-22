import { createFileRoute, useRouter } from "@tanstack/react-router";
import ScheduleVisitForm from "@/features/calendar/components/ScheduleVisitForm";
import { Main } from "@/components/layout/main";
import { z } from "zod";

const searchSchema = z.object({
  salesRepId: z.string().optional(),
  customerId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/calendar/schedule-visit")(
  {
    validateSearch: (search: Record<string, unknown>) =>
      searchSchema.parse(search),
    component: ScheduleVisitPage,
  },
);

function ScheduleVisitPage() {
  const router = useRouter();
  return (
    <Main>
      <ScheduleVisitForm onClose={() => router.navigate({ to: "/calendar" })} />
    </Main>
  );
}
