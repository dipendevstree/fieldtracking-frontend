// src/features/calendar/index.tsx
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import Analytics from "./components/Analytics";
import CalendarView from "./components/CalendarView";
import UpcomingVisits from "./components/UpcomingVisits";
import VisitReports from "./components/VisitReports";

// Define valid tab values
export type TabValue =
  | "/calendar"
  | "/calendar/upcoming-visit"
  | "/calendar/visit-report"
  | "/calendar//calendar/task-assignment"
  | "/calendar/analytics";

export default function CalendarPage() {
  const { latestLocation } = useRouter();
  console.log("router", latestLocation.pathname);
  const pathname = latestLocation.pathname;
  const [activeTab, setActiveTab] = useState<string>(pathname);
  console.log("activeTab", activeTab);

  const handleTabChange = (value: string) => {
    console.log("value", value);
    setActiveTab(value as TabValue);
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className=" space-y-5"
      >
        <TabsList className="grid w-full grid-cols-4 mb-2 h-10">
          <TabsTrigger value="/calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="/calendar/upcoming-visit">
            Upcoming Visits
          </TabsTrigger>
          <TabsTrigger value="/calendar/visit-report">
            Visit Reports
          </TabsTrigger>
          {/* <TabsTrigger value='/calendar/task-assignment'>
            Task Assignment
          </TabsTrigger> */}
          <TabsTrigger value="/calendar/analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="/calendar" className="space-y-4">
          <CalendarView />
        </TabsContent>
        <TabsContent value="/calendar/upcoming-visit" className="space-y-4">
          <UpcomingVisits />
        </TabsContent>
        <TabsContent value="/calendar/visit-report" className="space-y-4">
          <VisitReports />
        </TabsContent>
        {/* <TabsContent value='/calendar/task-assignment' className='space-y-4'>
          <TaskAssignment />
        </TabsContent> */}
        <TabsContent value="/calendar/analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
