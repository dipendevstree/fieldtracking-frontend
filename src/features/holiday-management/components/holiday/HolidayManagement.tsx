import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, isSameDay, addDays } from "date-fns";
import { Plus, Loader2 } from "lucide-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import StatusBadge, {
  statusColors,
} from "@/components/shared/common-status-badge";
import { cn } from "@/lib/utils";
import { HolidayActionDialog } from "./components/holiday-action-dialog";

import {
  useGetAllHolidays,
  useDeleteHoliday,
} from "@/features/holiday-management/services/holiday.action.hook";
import { useGetAllLeaves } from "@/features/leave-management/services/leave-action.hook";
import CalendarView from "@/features/leave-management/components/user-view/components/CalendarView";
import { Main } from "@/components/layout/main";

// --- LOGIC HELPER ---
const getEventStatusKey = (isHoliday: boolean, text: string, date: Date) => {
  const lowerText = text?.toLowerCase() || "";

  if (!isHoliday) {
    return lowerText; // return 'pending', 'approved', etc.
  }

  // Holiday Priorities
  if (lowerText.includes("national")) return "national";
  if (lowerText.includes("festival")) return "festival";
  if (lowerText.includes("regional")) return "regional";
  if (lowerText.includes("optional")) return "optional";

  // Check for Weekend
  if (date.getDay() === 0 || lowerText.includes("sunday")) return "weekend";

  return "national"; // Default fallback
};

export default function HolidayManagement() {
  const [calendarMode, setCalendarMode] = useState<"holiday" | "leave">(
    "holiday"
  );
  const [viewDate, setViewDate] = useState(new Date());

  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<any | null>(null);

  const calendarQueryParams = useMemo(
    () => ({
      startDate: format(startOfMonth(viewDate), "yyyy-MM-dd"),
      endDate: format(endOfMonth(viewDate), "yyyy-MM-dd"),
    }),
    [viewDate]
  );

  const {
    data: holidays = [],
    isLoading: isLoadingHolidays,
    weekOffDays,
  } = useGetAllHolidays(calendarQueryParams);

  const { data: allLeavesList = [], isLoading: isLoadingLeaves } =
    useGetAllLeaves(calendarQueryParams);

  const { mutate: deleteHoliday } = useDeleteHoliday(
    holidayToDelete?.id || "",
    () => {
      setIsDeleteDialogOpen(false);
      setHolidayToDelete(null);
    }
  );

  // Calendar Logic
  const events = useMemo(() => {
    if (calendarMode === "holiday") {
      return holidays.map((h: any) => {
        const typeName = h.holidayType?.holidayTypeName || h.type || "National";
        const statusKey = getEventStatusKey(true, typeName, new Date(h.date));

        return {
          id: h.id,
          title: h.name,
          start: new Date(h.date),
          end: new Date(h.date),
          allDay: true,
          resource: {
            type: typeName,
            originalData: h,
            statusKey: statusKey,
          },
        };
      });
    } else {
      return allLeavesList.map((lr: any) => {
        const typeName = lr.leaveType?.name || "Leave";
        const status = lr.status?.toLowerCase() || "pending";

        // Calculate status key
        const statusKey = getEventStatusKey(
          false,
          status,
          new Date(lr.startDate)
        );

        const start = new Date(lr.startDate);
        let end = new Date(lr.endDate);
        if (!lr.halfDay) end = addDays(end, 1);

        return {
          id: lr.id,
          title: typeName,
          start,
          end,
          allDay: !lr.halfDay,
          resource: { type: "leave", originalData: lr, statusKey },
        };
      });
    }
  }, [calendarMode, holidays, allLeavesList]);

  const currentMonthEvents = events
    .filter((e: any) => {
      const eDate = new Date(e.start);
      return (
        eDate.getMonth() === viewDate.getMonth() &&
        eDate.getFullYear() === viewDate.getFullYear()
      );
    })
    .sort((a: any, b: any) => a.start.getTime() - b.start.getTime());

  // Handlers
  const openAddDialog = () => {
    setEditingHoliday(null);
    setIsActionDialogOpen(true);
  };

  const openEditDialog = (holiday: any) => {
    setEditingHoliday(holiday);
    setIsActionDialogOpen(true);
  };

  const openDeleteDialog = (holiday: any) => {
    setHolidayToDelete(holiday);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Main className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Holiday Calendar
        </h2>
        <Button className="ml-auto shadow-sm" onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Holiday
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
        <CardContent className="p-0">
          {isLoadingHolidays || isLoadingLeaves ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <CalendarView
              events={events}
              defaultView="month"
              currentMode={calendarMode}
              onModeChange={setCalendarMode}
              date={viewDate}
              onNavigate={setViewDate}
              weekOffDays={weekOffDays}
            />
          )}

          <div className="bg-slate-50/50 border-t border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              {calendarMode === "holiday" ? "Holidays" : "Leaves"} this month
              <span className="ml-2 bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                {currentMonthEvents.length}
              </span>
            </h3>

            {currentMonthEvents.length > 0 ? (
              <div className="space-y-2">
                {currentMonthEvents.map((evt: any) => {
                  const originalData = evt.resource.originalData;
                  const isHoliday = evt.resource.type !== "leave";

                  // Get status key from resource
                  const statusKey = evt.resource.statusKey;

                  // Get styles
                  const styles = statusColors[statusKey] ||
                    statusColors["default"] || { dot: "bg-slate-400" };

                  return (
                    <div
                      key={evt.id}
                      className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center gap-3 flex-1 cursor-default">
                        <div
                          className={cn("w-1 h-9 rounded-full", styles.dot)}
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-800">
                              {evt.title}
                            </p>
                            <StatusBadge status={statusKey} />
                          </div>
                          <span className="text-xs text-slate-500">
                            {isSameDay(evt.start, evt.end)
                              ? format(evt.start, "PPP")
                              : `${format(evt.start, "PPP")} - ${format(evt.end, "PPP")}`}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS: Only for Holidays now */}
                      {isHoliday && (
                        <div className="flex items-center space-x-2">
                          <CustomTooltip title="Edit">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(originalData);
                              }}
                            >
                              <IconEdit size={16} />
                            </Button>
                          </CustomTooltip>
                          <CustomTooltip title="Delete">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(originalData);
                              }}
                            >
                              <IconTrash size={16} />
                            </Button>
                          </CustomTooltip>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm italic">
                No {calendarMode === "holiday" ? "holidays" : "leaves"} found
                for {format(viewDate, "MMMM yyyy")}.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <HolidayActionDialog
        open={isActionDialogOpen}
        onOpenChange={setIsActionDialogOpen}
        holidayToEdit={editingHoliday}
      />

      {holidayToDelete && (
        <DeleteModal
          open={isDeleteDialogOpen}
          currentRow={holidayToDelete}
          itemIdentifier="name"
          itemName="Holiday"
          onDelete={() => deleteHoliday()}
          onOpenChange={setIsDeleteDialogOpen}
        />
      )}
    </Main>
  );
}
