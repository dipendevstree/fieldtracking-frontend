import { useEffect, useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import AllUsersTable from "../UserManagement/components/table";
import { useGetAllUsers } from "../UserManagement/services/AllUsers.hook";
import { ErrorResponse } from "../merchants/types";
import { CustomersActionModal } from "./components/action-form-modal";
import CustomersTable from "./components/table";
import {
  useGetCustomers,
  useCustomerStatusCounts,
} from "./services/Customers.hook";
import { useCustomersStore } from "./store/customers.store";

const Customers = () => {
  const [selectedTab, setSelectedTab] = useState("customers");
  const [titleObj, setTitleObj] = useState({
    title: "Customers",
    description: "Manage all customers in the system",
  });

  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  // Customers data
  const {
    totalCount: customersTotalCount = 0,
    data: Customer,
    isLoading: customersLoading,
    error: customersError,
  } = useGetCustomers(pagination);
  console.log("Customer:", Customer);
  // All users data
  const {
    totalCount: allUsersTotalCount = 0,
    allUsers = [],
    isLoading: allUsersLoading,
    error: allUsersError,
  } = useGetAllUsers(pagination);

  // User status counts
  const { customerStatusCounts, totalCustomers } =
    useCustomerStatusCounts() || {
      userStatusCounts: {},
      totalCustomers: 0,
    };

  const { setOpen, open } = useCustomersStore();

  // Consolidated error handling
  const error = customersError || allUsersError;
  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data;
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    );
  }

  const handleAddMerchant = () => {
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const getTitleObj = (tab: string) => ({
    title:
      tab === "customers"
        ? "Customers"
        : tab === "system-logs"
          ? "All Users"
          : "Pending Admins",
    description:
      tab === "customers"
        ? "Manage all customers in the system"
        : tab === "system-logs"
          ? "Monitor all users"
          : "Manage pending admin approvals",
  });

  useEffect(() => {
    setTitleObj(getTitleObj(selectedTab));
  }, [selectedTab]);

  // Helper function to calculate total users safely
  const getTotalUsers = () => {
    if (!customerStatusCounts) return 0;
    return (
      (customerStatusCounts.created || 0) +
      (customerStatusCounts.verified || 0) +
      (customerStatusCounts.rejected || 0)
    );
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <div className="mt-2 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Customer Directory
          </h2>
          <p className="text-muted-foreground">
            Manage customers and approve admin registrations
          </p>
        </div>
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Building2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalUsers()}</div>
            <p className="text-muted-foreground text-xs">
              Across all customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Customers
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerStatusCounts?.verified || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Across all customers
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="mt-4 space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 h-10">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="pending-admins">Pending Admins</TabsTrigger>
          <TabsTrigger value="system-logs">All Users</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <TablePageLayout
            title={titleObj?.title}
            description={titleObj?.description}
            onAddButtonClick={handleAddMerchant}
            moduleAction="add"
            modulePermission="customers"
            showActionButton={true}
          >
            <CustomersTable
              data={Customer?.list ?? []}
              totalCount={customersTotalCount}
              loading={customersLoading}
              currentPage={pagination.page}
              paginationCallbacks={{ onPaginationChange }}
            />
          </TablePageLayout>
        </TabsContent>

        <TabsContent value="system-logs" className="space-y-4">
          <TablePageLayout
            title={titleObj?.title}
            description={titleObj?.description}
            onAddButtonClick={handleAddMerchant}
            showActionButton={false}
          >
            <AllUsersTable
              data={allUsers}
              totalCount={allUsersTotalCount}
              loading={allUsersLoading}
              currentPage={pagination.page}
              paginationCallbacks={{ onPaginationChange }}
              hideActions={true}
            />
          </TablePageLayout>
        </TabsContent>
      </Tabs>

      {open && <CustomersActionModal key={"customers-action-modal"} />}
    </Main>
  );
};

export default Customers;
