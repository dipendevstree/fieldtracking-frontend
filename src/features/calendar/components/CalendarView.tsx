import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import debounce from "lodash.debounce";
import { CalendarIcon, Clock, Edit, Eye, Trash2 } from "lucide-react";
import { useSelectOptions } from "@/hooks/use-select-option";
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
import { Badge } from "@/components/ui/badge";
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
  useGetAllVisit,
  useGetAnalytics,
} from "../services/calendar-view.hook";

interface Visit {
  id: string;
  visitId?: string;
  salesRepresentativeUser: {
    id: string;
    firstName: string;
    lastName: string;
    roleId?: string;
  };
  customer: { companyName: string } | string;
  contact: string;
  date: string;
  time: string;
  purpose: string;
  location: string;
  status: string;
  priority: string;
}

interface Analytics {
  totalVisits: number;
  pending: number;
  completed: number;
  cancel: number;
}

export interface FormData {
  roleId: string;
  salesRep: string;
  search: string;
  territoryId: string;
  customerId: string;
  priority: string;
}

type MappedVisit = {
  id: string;
  rep: string;
  salesRepId: string;
  roleId?: string;
  customer: string;
  contact: string;
  date: string;
  time: string;
  purpose: string;
  location: string;
  status: string;
  priority: string;
  originalVisit: Visit;
};

interface DeleteVisitDialogProps {
  visit: MappedVisit | null;
  isOpen: boolean;
  onClose: () => void;
}

function DeleteVisitDialog({ visit, isOpen, onClose }: DeleteVisitDialogProps) {
  // Important: guard first to avoid calling hook with undefined
  console.log("visit11", visit);
  if (!visit) return null;

  const { mutate: deleteVisit, isPending: isLoading } = useDeleteVisits(
    visit.id,
    onClose
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
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    searchFor: "",
    roleId: "",
    salesRepresentativeUserId: "",
  });

  // State to manage which visit is targeted for deletion
  const [visitToDelete, setVisitToDelete] = useState<MappedVisit | null>(null);

  const [analyticsPagination] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    byOrganization: true,
  });

  const { watch, setValue } = useForm<FormData>({
    defaultValues: { roleId: "", salesRep: "", search: "" },
  });

  const roleId = watch("roleId");
  const selectedRep = watch("salesRep");

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      roleId,
      salesRepresentativeUserId: selectedRep,
    }));
  }, [roleId, selectedRep]);

  const { data: analytics } = useGetAnalytics(analyticsPagination) as {
    data: Analytics | undefined;
  };
  const { data: visits, isLoading, error } = useGetAllVisit(pagination);
  console.log("visits", visits);
  const upcomingVisits: MappedVisit[] =
    visits?.map((visit: Visit) => ({
      id: visit.id || visit.visitId || "",
      rep:
        `${visit.salesRepresentativeUser.firstName} ${visit.salesRepresentativeUser.lastName}`.trim() ||
        "Unknown",
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
    })) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Confirmed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
      Completed: "bg-blue-100 text-blue-800",
      "In-progress": "bg-purple-100 text-purple-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };
    return variants[priority] || "bg-gray-100 text-gray-800";
  };

  const handleDateChange = (newDate?: string) => {
    const value = newDate ?? new Date().toISOString().split("T")[0];
    setSelectedDate(value);
    setPagination((prev) => ({ ...prev, startDate: value, endDate: value }));
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({
        ...prev,
        searchFor: value,
      }));
    }, 800),
    []
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

  const filters: FilterConfig[] = [
    {
      key: "date",
      type: "date",
      onChange: handleDateChange,
      placeholder: "Select date",
      value: selectedDate,
    },
    {
      key: "search",
      type: "search",
      onChange: handleGlobalSearchChange,
      placeholder: "Search visits...",
      value: watch("search"),
    },
    {
      key: "role",
      type: "select",
      onChange: (value) => setValue("roleId", value ?? ""),
      placeholder: "Select role",
      value: roleId,
      options: roles,
    },
    {
      key: "salesRep",
      type: "select",
      onChange: (value) => setValue("salesRep", value ?? ""),
      placeholder: "Select salesRep",
      value: selectedRep,
      options: users,
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Visits
            </CardTitle>
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalVisits || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Pending Visits
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
              Today's Completed Visits
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
              Today's Cancelled Visits
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
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Visits scheduled for today</CardDescription>
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
                  visit.date === selectedDate &&
                  (!roleId || visit.roleId === roleId) &&
                  (!selectedRep || visit.salesRepId === selectedRep)
              )
              .map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center space-x-4 rounded-lg border p-2"
                >
                  <div className="flex-shrink-0">
                    <Clock className="text-muted-foreground h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{visit.time}</p>
                      <Badge className={getPriorityBadge(visit.priority)}>
                        {visit.priority}
                      </Badge>
                      <Badge className={getStatusBadge(visit.status)}>
                        {visit.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {visit.customer} - {visit.purpose}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Rep: {visit.rep}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <PermissionGate
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
                    </PermissionGate>
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
