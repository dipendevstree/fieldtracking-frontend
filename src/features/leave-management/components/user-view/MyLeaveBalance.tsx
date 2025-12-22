import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CalendarView from "./components/CalendarView";
import { useLeaveStore } from "../../store/use-leave-store";
import { useGetAllLeaveTypes } from "@/features/leave-management/services/leave-type.action.hook";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ApplyLeave, ApplyLeaveSchema, HolidaySchema } from "../../data/schema";
import { Textarea } from "@/components/ui/textarea";
import { SimpleDatePicker } from "@/components/ui/datepicker";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { DateRangeFilter } from "@/features/reports/components/DateRangeFilter";

function LeaveBalanceCard({
  title,
  total,
  taken,
  balance,
  percentage,
  headerBg,
  titleColor,
  onApply,
}: any) {
  const indicatorColorClass = `[&>*]:${titleColor.replace("text-", "bg-")}`;
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden border-slate-200">
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 py-3",
          headerBg
        )}
      >
        <div className="space-y-0.5">
          <CardTitle className={cn("text-sm font-bold", titleColor)}>
            {title}
          </CardTitle>
          <p className="text-[10px] text-slate-600 font-medium">
            Balance for current year
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 bg-white/80 hover:bg-white border-none text-xs"
          onClick={onApply}
        >
          <Plus className="mr-1 h-3 w-3" /> Apply
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Total
            </p>
            <p className="font-bold text-lg">{total}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Taken
            </p>
            <p className="font-bold text-lg text-red-500">{taken}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Balance
            </p>
            <p className="font-bold text-lg text-green-600">{balance}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>Usage</span>
            <span>{percentage}%</span>
          </div>
          <Progress
            value={percentage}
            className={cn("h-1.5", indicatorColorClass)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyLeaveBalance() {
  const {
    holidayTemplates,
    addHolidayTemplate,
    addHolidayToTemplate,
    updateHolidayInTemplate,
    deleteHolidayFromTemplate,
    leaveRequests,
    addLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
  } = useLeaveStore();

  const { data: leaveTypes = [] } = useGetAllLeaveTypes();

  const [calendarMode, setCalendarMode] = useState<"holiday" | "leave">(
    "holiday"
  );
  const [viewDate, setViewDate] = useState(new Date());

  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);

  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [editingLeaveId, setEditingLeaveId] = useState<string | null>(null);

  const applyLeaveForm = useForm<ApplyLeave>({
    resolver: zodResolver(ApplyLeaveSchema),
  });
  const holidayForm = useForm<z.infer<typeof HolidaySchema>>({
    resolver: zodResolver(HolidaySchema) as any,
    defaultValues: { name: "", date: new Date(), type: "National" },
  });

  const onApplyLeaveSubmit = (data: ApplyLeave) => {
    if (editingLeaveId) {
      updateLeaveRequest(editingLeaveId, {
        leaveTypeId: data.leaveTypeId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      });
      toast.success("Leave request updated");
    } else {
      addLeaveRequest({
        id: crypto.randomUUID(),
        leaveTypeId: data.leaveTypeId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: "Pending",
        reason: data.reason,
      });
      toast.success("Leave request submitted");
    }
    setIsApplyLeaveOpen(false);
  };

  const handleDeleteLeave = () => {
    if (editingLeaveId) {
      deleteLeaveRequest(editingLeaveId);
      toast.success("Leave request deleted");
      setIsApplyLeaveOpen(false);
    }
  };

  const onHolidaySubmit = (data: z.infer<typeof HolidaySchema>) => {
    const templateId = holidayTemplates[0]?.id || "default";
    if (editingHolidayId) {
      updateHolidayInTemplate(templateId, editingHolidayId, data);
      toast.success("Holiday updated");
    } else {
      if (holidayTemplates.length === 0) {
        addHolidayTemplate({
          id: templateId,
          name: "General",
          region: "National",
          description: "Default",
          holidays: [{ ...data, id: crypto.randomUUID() }],
        });
      } else {
        addHolidayToTemplate(templateId, data);
      }
      toast.success("Holiday added");
    }
    setIsHolidayDialogOpen(false);
  };

  const handleDeleteHoliday = () => {
    if (editingHolidayId) {
      const templateId = holidayTemplates[0]?.id || "default";
      deleteHolidayFromTemplate(templateId, editingHolidayId);
      toast.success("Holiday deleted");
      setIsHolidayDialogOpen(false);
    }
  };

  const openApplyLeaveDialog = (leaveTypeId?: string) => {
    setEditingLeaveId(null);
    applyLeaveForm.reset({
      startDate: new Date(),
      endDate: new Date(),
      reason: "",
      leaveTypeId:
        leaveTypeId || (leaveTypes.length > 0 ? leaveTypes[0].id : ""),
    });
    setIsApplyLeaveOpen(true);
  };

  const openHolidayDialog = (date: Date) => {
    setEditingHolidayId(null);
    holidayForm.reset({ name: "", date: date, type: "National" });
    setIsHolidayDialogOpen(true);
  };

  const handleSlotSelect = (slotInfo: {
    start: Date;
    end: Date;
    action: string;
  }) => {
    if (isBefore(slotInfo.start, startOfDay(new Date()))) {
      toast.error("Cannot select past dates.");
      return;
    }
    if (calendarMode === "leave") {
      openApplyLeaveDialog();
      applyLeaveForm.setValue("startDate", slotInfo.start);
      applyLeaveForm.setValue("endDate", slotInfo.start);
    } else {
      openHolidayDialog(slotInfo.start);
    }
  };

  const handleEventSelect = (event: any) => {
    if (calendarMode === "holiday") {
      setEditingHolidayId(event.id);
      holidayForm.reset({
        name: event.title,
        date: event.start,
        type: event.resource.originalData.type || "National",
      });
      setIsHolidayDialogOpen(true);
    } else {
      setEditingLeaveId(event.id);
      const leaveData = event.resource.originalData;
      applyLeaveForm.reset({
        leaveTypeId: leaveData.leaveTypeId,
        startDate: new Date(leaveData.startDate),
        endDate: new Date(leaveData.endDate),
        reason: leaveData.reason,
      });
      setIsApplyLeaveOpen(true);
    }
  };

  const getCalendarEvents = () => {
    if (calendarMode === "holiday") {
      return holidayTemplates.flatMap((t) =>
        t.holidays.map((h: any) => ({
          id: h.id,
          title: h.name,
          start: new Date(h.date),
          end: new Date(h.date),
          allDay: true,
          resource: { type: h.type || "National", originalData: h },
        }))
      );
    } else {
      return leaveRequests.map((lr) => {
        const typeName =
          leaveTypes.find((t: any) => t.id === lr.leaveTypeId)?.name || "Leave";
        return {
          id: lr.id,
          title: `${typeName}`,
          start: new Date(lr.startDate),
          end: new Date(lr.endDate),
          allDay: true,
          resource: { type: "leave", originalData: lr },
        };
      });
    }
  };

  const events = getCalendarEvents();
  const currentMonthEvents = events
    .filter((e) => {
      const eDate = new Date(e.start);
      return (
        eDate.getMonth() === viewDate.getMonth() &&
        eDate.getFullYear() === viewDate.getFullYear()
      );
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const cardStyles = [
    { headerBg: "bg-blue-50", titleColor: "text-blue-700" },
    { headerBg: "bg-green-50", titleColor: "text-green-700" },
    { headerBg: "bg-purple-50", titleColor: "text-purple-700" },
    { headerBg: "bg-orange-50", titleColor: "text-orange-700" },
  ];

  const watchStartDate = applyLeaveForm.watch("startDate");
  const watchEndDate = applyLeaveForm.watch("endDate");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  useEffect(() => {
    if (watchStartDate) {
      setDateRange({
        from: watchStartDate,
        to: watchEndDate || watchStartDate,
      });
    }
  }, [watchStartDate, watchEndDate]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          My Leave Balance
        </h2>
        <Button
          className="ml-auto shadow-sm"
          onClick={() => openApplyLeaveDialog()}
        >
          <Plus className="mr-2 h-4 w-4" /> Apply for Leave
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Available
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">38 days</div>
            <p className="text-xs text-slate-500 mt-1">
              Across all leave types
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Leave Taken
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">28 days</div>
            <p className="text-xs text-slate-500 mt-1">Used this year</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Requests
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {leaveRequests.filter((l) => l.status === "Pending").length}{" "}
              requests
            </div>
            <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {leaveTypes.slice(0, 4).map((lt: any, index: number) => (
          <LeaveBalanceCard
            key={lt.id}
            title={lt.name}
            total={lt.leaveBalance}
            taken={5}
            balance={lt.leaveBalance - 5}
            percentage={40}
            headerBg={cardStyles[index % cardStyles.length].headerBg}
            titleColor={cardStyles[index % cardStyles.length].titleColor}
            onApply={() => openApplyLeaveDialog(lt.id)}
          />
        ))}
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
        <CardContent className="p-0">
          <CalendarView
            events={events}
            onSelectSlot={handleSlotSelect}
            onSelectEvent={handleEventSelect}
            defaultView="month"
            currentMode={calendarMode}
            onModeChange={setCalendarMode}
            date={viewDate}
            onNavigate={setViewDate}
          />

          <div className="bg-slate-50/50 border-t border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              {calendarMode === "holiday" ? "Holidays" : "Leaves"} this month
              <span className="ml-2 bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                {currentMonthEvents.length}
              </span>
            </h3>

            {currentMonthEvents.length > 0 ? (
              <div className="space-y-2">
                {currentMonthEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => handleEventSelect(evt)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-1 h-8 rounded-full",
                          evt.resource.type === "National"
                            ? "bg-blue-500"
                            : evt.resource.type === "Regional"
                              ? "bg-purple-500"
                              : evt.resource.type === "leave"
                                ? "bg-orange-500"
                                : "bg-green-500"
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                          {evt.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {evt.resource.type}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500 font-medium">
                      {format(evt.start, "MMMM d, yyyy")}
                    </span>
                  </div>
                ))}
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

      <div className="bg-muted border-l-4 border-blue-500 p-4 rounded-md flex items-start gap-3">
        <div className="text-sm text-900">
          <span className="font-bold">Note:</span> Leave balances are updated
          quarterly. Your next update will be on{" "}
          <span className="font-bold">January 1, 2026</span>. Click "Apply for
          Leave" on any leave type to submit a new request.
        </div>
      </div>

      <Dialog
        open={isHolidayDialogOpen}
        onOpenChange={(open) => {
          setIsHolidayDialogOpen(open);
          if (!open) {
            setTimeout(() => {
              setEditingHolidayId(null);
              holidayForm.reset();
            }, 200);
          }
        }}
      >
        <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {editingHolidayId ? "Edit Holiday" : "Add Holiday"}
            </DialogTitle>
            <DialogDescription>
              {editingHolidayId
                ? "Modify details or delete this holiday."
                : "Add a new holiday."}
            </DialogDescription>
          </DialogHeader>
          <Form {...holidayForm}>
            <form
              onSubmit={holidayForm.handleSubmit(onHolidaySubmit)}
              className="space-y-4"
            >
              <FormField
                control={holidayForm.control as any}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={holidayForm.control as any}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <SimpleDatePicker
                        className="w-full"
                        date={
                          field.value ? format(field.value, "yyyy-MM-dd") : ""
                        }
                        setDate={(dateString) => {
                          field.onChange(new Date(dateString));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={holidayForm.control as any}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={[
                          { value: "National", label: "National" },
                          { value: "Regional", label: "Regional" },
                          { value: "Festival", label: "Festival" },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2">
                {editingHolidayId && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteHoliday}
                  >
                    Delete
                  </Button>
                )}
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isApplyLeaveOpen}
        onOpenChange={(open) => {
          setIsApplyLeaveOpen(open);
          if (!open) {
            setTimeout(() => {
              setEditingLeaveId(null);
              applyLeaveForm.reset();
            }, 200);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[500px]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {editingLeaveId ? "Edit Leave" : "Apply for Leave"}
            </DialogTitle>
          </DialogHeader>
          <Form {...applyLeaveForm}>
            <form
              onSubmit={applyLeaveForm.handleSubmit(onApplyLeaveSubmit)}
              className="space-y-4"
            >
              <FormField
                control={applyLeaveForm.control}
                name="leaveTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={leaveTypes.map((type: any) => ({
                          value: type.id,
                          label: type.name,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select leave type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <FormLabel
                  className={cn(
                    applyLeaveForm.formState.errors.startDate &&
                      "text-destructive"
                  )}
                >
                  Duration
                </FormLabel>
                <DateRangeFilter
                  dateRange={dateRange}
                  disablePastDates={true}
                  allowClear={false}
                  setDateRange={(range) => {
                    const safeRange = range
                      ? { from: range.from, to: range.to }
                      : { from: undefined, to: undefined };

                    setDateRange(safeRange);

                    if (safeRange.from) {
                      applyLeaveForm.setValue("startDate", safeRange.from, {
                        shouldValidate: true,
                      });
                      applyLeaveForm.setValue(
                        "endDate",
                        safeRange.to || safeRange.from,
                        { shouldValidate: true }
                      );
                    }
                  }}
                  placeholder="Select duration"
                />
                {applyLeaveForm.formState.errors.startDate && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {applyLeaveForm.formState.errors.startDate.message?.toString()}
                  </p>
                )}
              </div>

              <FormField
                control={applyLeaveForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Reason..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2">
                {editingLeaveId && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteLeave}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                )}
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
