import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  MapPin,
  MoreHorizontal,
  Search,
  Eye,
  MessageSquare,
  Phone,
} from "lucide-react";
import { SalesRep, DashboardKPI } from "../type/type";
import { useGetCustomers } from "@/features/customers/services/Customers.hook";
import { useGetAllVisit } from "@/features/calendar/services/calendar-view.hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function Overview({ salesReps: _salesReps, kpis }: OverviewProps) {
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [scheduleStatusFilter, setScheduleStatusFilter] =
    useState("All Status");
  const [customerIndustryFilter, setCustomerIndustryFilter] =
    useState("All Industries");

  // Get customer data from API
  const { Customer: customers = [], isLoading: customersLoading } =
    useGetCustomers({
      page: 1,
      limit: 10,
      search: customerSearchTerm,
      sort: "desc",
    });

  // Get schedule/visit data from API
  const { allVisit: scheduleData = [], isLoading: scheduleLoading } =
    useGetAllVisit({
      page: 1,
      limit: 10,
      sort: "desc",
    });



  // Filter schedule data
  const filteredSchedule = scheduleData.filter(
    (visit: any) =>
      visit.salesRepresentativeName
        ?.toLowerCase()
        .includes(scheduleSearchTerm.toLowerCase()) ||
      visit.customerName
        ?.toLowerCase()
        .includes(scheduleSearchTerm.toLowerCase()) ||
      visit.purpose?.toLowerCase().includes(scheduleSearchTerm.toLowerCase()) ||
      visit.streetAddress
        ?.toLowerCase()
        .includes(scheduleSearchTerm.toLowerCase())
  );

  // Filter customers
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.CustomerName?.toLowerCase().includes(
        customerSearchTerm.toLowerCase()
      ) ||
      customer.adminData?.firstName
        ?.toLowerCase()
        .includes(customerSearchTerm.toLowerCase()) ||
      customer.adminData?.email
        ?.toLowerCase()
        .includes(customerSearchTerm.toLowerCase())
  );

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
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalSalesReps}</div>
            <p className="text-xs text-muted-foreground">
              {kpis.activeInField} active in field
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active in Field
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activeInField}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((kpis.activeInField / kpis.totalSalesReps) * 100)}% of
              total team
            </p>
          </CardContent>
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
                  value={scheduleSearchTerm}
                  onChange={(e) => setScheduleSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select
                value={scheduleStatusFilter}
                onValueChange={setScheduleStatusFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assigned Rep</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading schedule data...
                  </TableCell>
                </TableRow>
              ) : filteredSchedule.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No scheduled items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSchedule.map((visit: any) => (
                  <TableRow key={visit.visitId}>
                    <TableCell className="font-medium">
                      {visit.salesRepresentativeName || "Unassigned"}
                    </TableCell>
                    <TableCell>{visit.customerName || "N/A"}</TableCell>
                    <TableCell>{visit.purpose || "N/A"}</TableCell>
                    <TableCell>
                      {visit.date && visit.time
                        ? `${visit.date} ${visit.time}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>{visit.streetAddress || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          visit.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {visit.status || "Scheduled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select
                value={customerIndustryFilter}
                onValueChange={setCustomerIndustryFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Industries">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assigned Rep</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Email id</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.customerId}>
                    <TableCell className="font-medium">
                      {customer.adminData?.firstName || "Unassigned"}
                    </TableCell>
                    <TableCell>{customer.CustomerName}</TableCell>
                    <TableCell>
                      {customer.adminData?.firstName || "N/A"}
                    </TableCell>
                    <TableCell>
                      {customer.adminData?.phoneNumber || "N/A"}
                    </TableCell>
                    <TableCell>{customer.adminData?.email || "N/A"}</TableCell>
                    <TableCell>{customer.adminName || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.isActive ? "default" : "secondary"}
                      >
                        {customer.isActive ? "Complete" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
