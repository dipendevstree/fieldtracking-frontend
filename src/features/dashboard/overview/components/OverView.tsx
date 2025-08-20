import { useState, useCallback } from "react";
import { ColumnDef } from '@tanstack/react-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MapPin,
  Search,
} from "lucide-react";
import { SalesRep, DashboardKPI } from "../type/type";
import { useGetCustomers } from "@/features/customers/services/Customers.hook";
import { useGetAllVisit } from "@/features/calendar/services/calendar-view.hook";
import { useGetIndustry } from "@/features/customers/services/Customers.hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import debounce from "lodash.debounce";
import { CustomDataTable } from "@/components/shared/custom-data-table";


interface OverviewProps {
  salesReps: SalesRep[];
  kpis: DashboardKPI;
  loading?: boolean;
}

// Mock data for recent activities
const mockData = {
  recentActivities: [
    {
      id: 1,
      user: "Alice Johnson",
      action: "completed a visit to",
      target: "TechCorp Solutions",
      time: "2 minutes ago",
      type: "visit",
    },
    {
      id: 2,
      user: "Bob Smith",
      action: "submitted expense report for",
      target: "Travel & Meals",
      time: "15 minutes ago",
      type: "expense",
    },
    {
      id: 3,
      user: "Carol Davis",
      action: "started route to",
      target: "Downtown District",
      time: "1 hour ago",
      type: "route",
    },
    {
      id: 4,
      user: "David Wilson",
      action: "updated status to",
      target: "On Break",
      time: "2 hours ago",
      type: "status",
    },
    {
      id: 5,
      user: "Eva Martinez",
      action: "logged in from",
      target: "Mobile App",
      time: "3 hours ago",
      type: "login",
    },
  ],
};

export default function Overview({ salesReps: _salesReps }: OverviewProps) {
  // Pagination state for Today's Schedule with proper API params
  const [schedulePagination, setSchedulePagination] = useState({
    page: 1,
    limit: 5,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    searchFor: "",
    sort: "desc",
    status: "",
  });

  // Pagination state for Customer List
  const [customerPagination, setCustomerPagination] = useState({
    page: 1,
    limit: 5,
    searchFor: "",
    sort: "desc",
    industryId: "",
    customerTypeId: "",
  });

  // Get customer data from API with proper parameters
  const { 
    data: customersResponse = { list: [], totalCount: 0 }, 
    isLoading: customersLoading, 
    totalCount: customerTotalCount = 0 
  } = useGetCustomers(customerPagination);

  // Extract customers list from response
  const customers = customersResponse?.list || [];

  // Get schedule/visit data from API with proper parameters
  const { data: scheduleData = [], isLoading: scheduleLoading, totalCount: scheduleTotalCount = 0 } =
    useGetAllVisit(schedulePagination);

  // Utility function to truncate location text
  const truncateLocation = (location: string, maxLength: number = 50) => {
    if (!location) return "N/A";
    if (location.length <= maxLength) return location;
    return location.substring(0, maxLength) + "...";
  };

  // Debounced search for schedule
  const debouncedScheduleSearch = useCallback(
    debounce((value: string) => {
      setSchedulePagination(prev => ({
        ...prev,
        searchFor: value,
        page: 1 // Reset to first page when searching
      }));
    }, 800),
    []
  );

  const handleScheduleSearchChange = useCallback((value: string) => {
    debouncedScheduleSearch(value);
  }, [debouncedScheduleSearch]);

  // Status filter handler
  const handleStatusFilterChange = (value: string) => {
    setSchedulePagination(prev => ({
      ...prev,
      status: value === "All Status" ? "" : value.toLowerCase(),
      page: 1 // Reset to first page when filtering
    }));
  };

  // Debounced search for customers
  const debouncedCustomerSearch = useCallback(
    debounce((value: string) => {
      setCustomerPagination(prev => ({
        ...prev,
        searchFor: value,
        page: 1 // Reset to first page when searching
      }));
    }, 800),
    []
  );

  const handleCustomerSearchChange = useCallback((value: string) => {
    debouncedCustomerSearch(value);
  }, [debouncedCustomerSearch]);

  // Industry filter handler
  const handleIndustryFilterChange = (value: string) => {
    const selectedIndustry = industryList.find(industry => industry.industryName === value);
    setCustomerPagination(prev => ({
      ...prev,
      industryId: value === "All Industries" ? "" : selectedIndustry?.industryId || "",
      page: 1 // Reset to first page when filtering
    }));
  };

  // Map schedule data to proper format (API handles filtering)
  const mappedScheduleData = scheduleData.map((visit: any) => ({
    ...visit,
    salesRepName: visit.salesRepresentativeUser ? 
      `${visit.salesRepresentativeUser.firstName || ""} ${visit.salesRepresentativeUser.lastName || ""}`.trim() || "Unassigned"
      : visit.salesRepresentativeName || "Unassigned",
    customerName: visit.customer?.companyName || visit.customerName || "N/A",
    formattedDateTime: visit.date && visit.time ? 
      `${new Date(visit.date).toLocaleDateString()} ${visit.time}` : "N/A",
    displayStatus: visit.status ? 
      visit.status.charAt(0).toUpperCase() + visit.status.slice(1) : "Scheduled",
    displayPriority: visit.priority || "Medium",
    location: visit.streetAddress || visit.location || "N/A"
  }));

  // Get industry data for filter
  const { data: industryList = [] } = useGetIndustry();

  // Get current industry filter display value
  const getCurrentIndustryFilterValue = () => {
    if (!customerPagination.industryId) return "All Industries";
    const selectedIndustry = industryList.find(industry => industry.industryId === customerPagination.industryId);
    return selectedIndustry?.industryName || "All Industries";
  };

  // Define column types for schedule data
  const scheduleColumns: ColumnDef<unknown>[] = [
    {
      accessorKey: 'salesRepName',
      header: 'Sales Rep',
      cell: ({ row }) => (
        <div className="font-medium">{(row.original as any).salesRepName}</div>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => <div>{(row.original as any).customerName}</div>,
    },
    {
      accessorKey: 'formattedDateTime',
      header: 'Date & Time',
      cell: ({ row }) => <div>{(row.original as any).formattedDateTime}</div>,
    },
    {
      accessorKey: 'purpose',
      header: 'Purpose',
      cell: ({ row }) => <div>{(row.original as any).purpose || "N/A"}</div>,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <div title={(row.original as any).location}>
          {truncateLocation((row.original as any).location)}
        </div>
      ),
    },
    {
      accessorKey: 'displayStatus',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={
            (row.original as any).displayStatus.toLowerCase() === "completed" ? "default" : "secondary"
          }
        >
          {(row.original as any).displayStatus}
        </Badge>
      ),
    },
    {
      accessorKey: 'displayPriority',
      header: 'Priority',
      cell: ({ row }) => (
        <Badge variant="outline">
          {(row.original as any).displayPriority}
        </Badge>
      ),
    },
  ];

  // Define column types for customer data
  const customerColumns: ColumnDef<unknown>[] = [
    {
      accessorKey: 'companyName',
      header: 'Company Name',
      cell: ({ row }) => (
        <div className="font-medium">
          {(row.original as any).companyName || (row.original as any).CustomerName || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: 'customerType.typeName',
      header: 'Customer Type',
      cell: ({ row }) => (
        <div>{(row.original as any).customerType?.typeName || "N/A"}</div>
      ),
    },
    {
      accessorKey: 'streetAddress',
      header: 'Location',
      cell: ({ row }) => (
        <div title={(row.original as any).streetAddress || (row.original as any).adminName || "N/A"}>
          {truncateLocation((row.original as any).streetAddress || (row.original as any).adminName || "N/A")}
        </div>
      ),
    },
    {
      accessorKey: 'industry.industryName',
      header: 'Industry',
      cell: ({ row }) => (
        <div>{(row.original as any).industry?.industryName || "N/A"}</div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales Reps
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          {/* <CardContent>
            <div className="text-2xl font-bold">{kpis.totalSalesReps}</div>
            <p className="text-xs text-muted-foreground">
              {kpis.activeInField} active in field
            </p>
          </CardContent> */}
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active in Field
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          {/* <CardContent>
            <div className="text-2xl font-bold">{kpis.activeInField}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((kpis.activeInField / kpis.totalSalesReps) * 100)}% of
              total team
            </p>
          </CardContent> */}
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Manage your customer database and relationships.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  onChange={(e) => handleScheduleSearchChange(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select
                value={schedulePagination.status ? 
                  schedulePagination.status.charAt(0).toUpperCase() + schedulePagination.status.slice(1) : "All Status"}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CustomDataTable
            data={mappedScheduleData}
            columns={scheduleColumns}
            totalCount={scheduleTotalCount}
            currentPage={schedulePagination.page}
            paginationCallbacks={{
              onPaginationChange: (page: number, pageSize: number) => {
                setSchedulePagination(prev => ({
                  ...prev,
                  page,
                  limit: pageSize
                }));
              }
            }}
            loading={scheduleLoading}
            key="schedule-table"
          />
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                Manage your customer database and relationships.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={customerPagination.searchFor}
                  onChange={(e) => handleCustomerSearchChange(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select
                value={getCurrentIndustryFilterValue()}
                onValueChange={handleIndustryFilterChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Industries">All Industries</SelectItem>
                  {industryList.map((industry) => (
                    <SelectItem key={industry.industryId} value={industry.industryName}>
                      {industry.industryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CustomDataTable
            data={customers}
            columns={customerColumns}
            totalCount={customerTotalCount}
            currentPage={customerPagination.page}
            paginationCallbacks={{
              onPaginationChange: (page: number, pageSize: number) => {
                setCustomerPagination(prev => ({
                  ...prev,
                  page,
                  limit: pageSize
                }));
              }
            }}
            loading={customersLoading}
            key="customer-table"
          />
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest team activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}