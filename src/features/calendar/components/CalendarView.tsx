import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  Priority,
} from "@/data/app.data";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import debounce from "lodash.debounce";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { useSelectOptions } from "@/hooks/use-select-option";
import { DateRange } from "react-day-picker";
import moment from "moment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// UI and Data Imports
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
// Feature-specific Hooks and Services
import { useGetAllRolesForDropdown } from "@/features/UserManagement/services/Roles.hook";
import { useGetUsersForDropdown } from "@/features/buyers/services/users.hook";
import {
  useDeleteVisits,
  useGetAllCustomer,
  useGetAllVisit,
  useGetAnalytics,
} from "../services/calendar-view.hook";
import { formatDropDownLabel } from "@/utils/commonFunction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Analytics,
  DeleteVisitDialogProps,
  FormData,
  MappedVisit,
  Visit,
} from "../type/type";
import StatusBadge from "@/components/ui/status-badge";

function DeleteVisitDialog({ visit, isOpen, onClose }: DeleteVisitDialogProps) {
  // Important: guard first to avoid calling hook with undefined
  if (!visit) return null;

  const { mutate: deleteVisit, isPending: isLoading } = useDeleteVisits(
    visit.id,
    onClose,
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the visit
            for <strong>{visit.purpose}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteVisit()}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function CalendarView() {
  const navigate = useNavigate();
  const initialTodayDate = moment().format("YYYY-MM-DD");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  // Calculate isToday dynamically to ensure fresh comparison
  const isToday = useMemo(() => {
    const todayDate = moment().format("YYYY-MM-DD");
    const fromDate = dateRange?.from
      ? moment(dateRange.from).format("YYYY-MM-DD")
      : null;
    const toDate = dateRange?.to
      ? moment(dateRange.to).format("YYYY-MM-DD")
      : null;
    return fromDate === todayDate && toDate === todayDate;
  }, [dateRange]);
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: initialTodayDate,
    endDate: initialTodayDate,
    searchFor: "",
    roleId: "",
    salesRepresentativeUserId: "",
    customerId: "",
    status: "",
  });

  // State to manage which visit is targeted for deletion
  const [visitToDelete, setVisitToDelete] = useState<MappedVisit | null>(null);

  const { watch, setValue } = useForm<FormData>({
    defaultValues: { roleId: "", salesRep: "", search: "", status: "" },
  });

  const roleId = watch("roleId");
  const selectedRep = watch("salesRep");
  const customerId = watch("customerId");
  const priority = watch("priority");
  const status = watch("status");

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      roleId,
      salesRepresentativeUserId: selectedRep,
      customerId,
      priority,
      status,
    }));
  }, [roleId, selectedRep, customerId, priority, status]);

  const { data: analytics } = useGetAnalytics({
    startDate: pagination.startDate,
    endDate: pagination.endDate,
    byOrganization: true,
  }) as {
    data: Analytics | undefined;
  };

  const { data: visits, isLoading, error } = useGetAllVisit(pagination);

  const upcomingVisits: MappedVisit[] =
    visits?.map((visit: Visit) => ({
      id: visit.id || visit.visitId || "",
      rep:
        `${visit.salesRepresentativeUser.firstName} ${visit.salesRepresentativeUser.lastName}`.trim() ||
        "Unknown",
      firstName: visit.salesRepresentativeUser.firstName,
      lastName: visit.salesRepresentativeUser.lastName,
      salesRepId: visit.salesRepresentativeUser.id || "",
      roleId: visit.salesRepresentativeUser.roleId || "",
      customer:
        typeof visit.customer === "string"
          ? visit.customer
          : visit.customer?.companyName || "Unknown",
      contact: visit.contact || "N/A",
      date: new Date(visit.date).toISOString().split("T")[0],
      time: visit.time,
      purpose: visit.purpose,
      location: visit.location || "N/A",
      status:
        visit.status.charAt(0).toUpperCase() +
        visit.status.slice(1).toLowerCase(),
      priority: visit.priority,
      originalVisit: visit,
      checkInImageUrl: visit.checkInImageUrl || "",
      profileUrl: visit.salesRepresentativeUser.profileUrl,
    })) || [];

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setPagination((prev) => ({
        ...prev,
        startDate: moment(range.from).format("YYYY-MM-DD"),
        endDate: moment(range.to).format("YYYY-MM-DD"),
      }));
    } else if (range?.from) {
      // If only 'from' is selected, use it for both start and end
      const dateStr = moment(range.from).format("YYYY-MM-DD");
      setPagination((prev) => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr,
      }));
    } else {
      // If range is cleared, reset to today
      const today = moment().format("YYYY-MM-DD");
      setPagination((prev) => ({
        ...prev,
        startDate: today,
        endDate: today,
      }));
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({
        ...prev,
        searchFor: value,
      }));
    }, 800),
    [],
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    setValue("search", searchValue);
    debouncedSearch(searchValue);
  };

  const { data: allRoles } = useGetAllRolesForDropdown();
  const roles = useSelectOptions({
    listData: allRoles ?? [],
    labelKey: "roleName",
    valueKey: "roleId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const { data: userList = [] } = useGetUsersForDropdown({
    roleId,
    enabled: true,
  });
  const enhancedUserList = userList.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));
  const users = useSelectOptions({
    listData: enhancedUserList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const { data: customers } = useGetAllCustomer();
  const customerOptions = useSelectOptions({
    listData: customers ?? [],
    labelKey: "companyName",
    valueKey: "customerId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const priorityOptions = Object.entries(Priority).map(([key, value]) => ({
    label: formatDropDownLabel(key),
    value,
  }));

  const Status = {
    PENDING: "pending",
    CHECKIN: "checkin",
    COMPLETED: "completed",
    CANCEL: "cancel",
    PARTIAL_COMPLETED: "partial_completed",
  };

  const statusOptions = Object.entries(Status).map(([key, value]) => ({
    label: formatDropDownLabel(key),
    value,
  }));

  const filters: FilterConfig[] = [
    {
      key: "date",
      type: "date-range",
      dateRangeValue: dateRange,
      onDateRangeChange: handleDateRangeChange,
      placeholder: "Select Date Range",
      allowClear: false,
      dataRangeClassName: "w-full max-w-[350px]",
    },
    {
      key: "search",
      type: "search",
      onChange: handleGlobalSearchChange,
      placeholder: "Search Visits...",
      value: watch("search"),
    },
    {
      key: "role",
      type: "searchable-select",
      onChange: (value) => setValue("roleId", value ?? ""),
      onCancelPress: () => setValue("roleId", ""),
      placeholder: "Select Role",
      value: roleId,
      options: roles,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "salesRep",
      type: "searchable-select",
      onChange: (value) => setValue("salesRep", value ?? ""),
      onCancelPress: () => setValue("salesRep", ""),
      placeholder: "Select Sales Rep",
      value: selectedRep,
      options: users,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "customerId",
      type: "searchable-select",
      onChange: (value) => setValue("customerId", value ?? ""),
      onCancelPress: () => setValue("customerId", ""),
      placeholder: "Select Customer",
      value: customerId,
      options: customerOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "priority",
      type: "searchable-select",
      onChange: (value) => setValue("priority", value ?? ""),
      onCancelPress: () => setValue("priority", ""),
      placeholder: "Select Priority",
      value: priority,
      options: priorityOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "status",
      type: "searchable-select",
      onChange: (value) => setValue("status", value ?? ""),
      onCancelPress: () => setValue("status", ""),
      placeholder: "Select Status",
      value: status,
      options: statusOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
  ];

  return (
    <>
      <div className="grid gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isToday ? "Today's" : ""} Total Visits
            </CardTitle>
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalVisits || 0}
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer"
          onClick={() => navigate({ to: "/calendar/upcoming-visit" })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isToday ? "Today's" : ""} Pending Visits
            </CardTitle>
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.pending || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isToday ? "Today's" : ""} Completed Visits
            </CardTitle>
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.completed || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isToday ? "Today's" : ""} Cancelled Visits
            </CardTitle>
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.cancel || 0}</div>
          </CardContent>
        </Card>
      </div>

      <GlobalFilterSection key={"calender-view-filters"} filters={filters} />
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {isToday ? "Today's" : "Visits"} Schedule{isToday ? "" : "d"}
            </CardTitle>
            {isToday && (
              <CardDescription>Visits scheduled for today</CardDescription>
            )}
          </div>
          <PermissionGate requiredPermission="calender_view" action="add">
            <Button
              onClick={() => navigate({ to: "/calendar/schedule-visit" })}
            >
              Schedule New Visit
            </Button>
          </PermissionGate>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading visits...</p>}
          {error && (
            <p className="text-red-500">
              Error fetching visits: {error.message}
            </p>
          )}
          {!isLoading && !error && upcomingVisits.length === 0 && (
            <p>No visits scheduled for this date.</p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {upcomingVisits
              .filter(
                (visit) =>
                  (!roleId || visit.roleId === roleId) &&
                  (!selectedRep || visit.salesRepId === selectedRep),
              )
              .map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center space-x-4 rounded-lg border p-2"
                >
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={visit.checkInImageUrl || visit.profileUrl || ""}
                        alt="Visit Image"
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {visit.firstName?.[0]}
                        {visit.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{visit.time}</p>
                      <StatusBadge status={visit.status} />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {visit.customer} - {visit.purpose}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Rep: {visit.rep}
                    </p>
                    <div>
                      <span className="text-muted-foreground text-sm">
                        Priority:{" "}
                      </span>
                      <StatusBadge status={visit.priority} showDot={false} />
                    </div>
                  </div>
                  {visit.status === "Pending" && (
                    <div className="flex space-x-2">
                      {/* <PermissionGate
                      requiredPermission="calender_view"
                      action="viewOwn"
                    >
                      <Button
                        className="h-8 w-8 p-0"
                        variant="outline"
                        size="sm"
                        aria-label={`View details for visit ${visit.id}`}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </PermissionGate> */}
                      <PermissionGate
                        requiredPermission="calender_view"
                        action="edit"
                      >
                        <Button
                          variant="outline"
                          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                          size="sm"
                          onClick={() =>
                            navigate({
                              to: `/calendar/schedule-visit/${visit.id}`,
                            })
                          }
                          aria-label={`Edit visit ${visit.id}`}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </PermissionGate>
                      <PermissionGate
                        requiredPermission="calender_view"
                        action="delete"
                      >
                        <Button
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          variant="outline"
                          size="sm"
                          onClick={() => setVisitToDelete(visit)}
                          aria-label={`Delete visit ${visit.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </PermissionGate>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
      <DeleteVisitDialog
        visit={visitToDelete}
        isOpen={!!visitToDelete}
        onClose={() => setVisitToDelete(null)}
      />
    </>
  );
}
