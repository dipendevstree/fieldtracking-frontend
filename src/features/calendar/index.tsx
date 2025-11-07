// src/features/calendar/index.tsx
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import Analytics from "./components/Analytics";
import CalendarView from "./components/CalendarView";
import UpcomingVisits from "./components/UpcomingVisits";
import VisitReports from "./components/VisitReports";
import { usePermission } from "@/permissions/hooks/use-permission";

// Define valid tab values
export type TabValue =
  | "/calendar"
  | "/calendar/upcoming-visit"
  | "/calendar/visit-report"
  | "/calendar//calendar/task-assignment"
  | "/calendar/analytics";

const TAB_DEFINITIONS = [
  {
    key: "calender_view",
    value: "/calendar",
    label: "Calendar View",
    content: <CalendarView />,
  },
  {
    key: "upcoming_visits",
    value: "/calendar/upcoming-visit",
    label: "Upcoming Visits",
    content: <UpcomingVisits />,
  },
  {
    key: "visits_reports",
    value: "/calendar/visit-report",
    label: "Visit Reports",
    content: <VisitReports />,
  },
  {
    key: "analytic",
    value: "/calendar/analytics",
    label: "Analytics",
    content: <Analytics />,
  },
];

export default function CalendarPage() {
  const { latestLocation } = useRouter();
  const pathname = latestLocation.pathname;
  const [activeTab, setActiveTab] = useState<string>(pathname);
  const { hasAccess } = usePermission();

  const visibleTabs = useMemo(
    () => TAB_DEFINITIONS.filter((t) => hasAccess(t.key)),
    [hasAccess]
  );

  const visibleTabCount = visibleTabs.length || 1;

  useEffect(() => {
    if (visibleTabs.length === 0) return;
    const found = visibleTabs.find((t) => t.value === activeTab);
    if (!found) setActiveTab(visibleTabs[0].value);
  }, [visibleTabs, activeTab]);

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
        {visibleTabs.length <= 1 ? (
          visibleTabs[0] ? (
            <div className="space-y-4">{visibleTabs[0].content}</div>
          ) : null
        ) : (
          <>
            <TabsList
              className={cn(
                "grid w-full mb-2 h-10",
                `grid-cols-${visibleTabCount}`
              )}
            >
              {visibleTabs.map((t) => (
                <TabsTrigger key={t.key} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {visibleTabs.map((t) => (
              <TabsContent key={t.key} value={t.value} className="space-y-4">
                {t.content}
              </TabsContent>
            ))}
          </>
        )}

        {/* <TabsList className="grid w-full grid-cols-4 mb-2 h-10">
          <TabsTrigger value="/calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="/calendar/upcoming-visit">
            Upcoming Visits
          </TabsTrigger>
          <TabsTrigger value="/calendar/visit-report">
            Visit Reports
          </TabsTrigger>
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
        <TabsContent value="/calendar/analytics" className="space-y-4">
          <Analytics />
        </TabsContent> */}
      </Tabs>
    </Main>
  );
}
