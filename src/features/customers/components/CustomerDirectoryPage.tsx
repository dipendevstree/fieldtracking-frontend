import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCustomers } from "@/features/customers/services/Customers.hook";
import { useCustomersStore } from "../store/customers.store";
import CustomersTable from "./table";
import { CustomersActionModal } from "./action-form-modal";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { ErrorPage } from "@/components/shared/custom-error";

// Define error response type
interface ErrorResponse {
  response?: {
    data?: {
      statusCode?: number;
      message?: string;
    };
  };
}

export const CustomerDirectoryPage = () => {
  const navigate = useNavigate();
  const { filters, setFilters, setCurrentRow, setOpen } = useCustomersStore();
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER || 1,
    limit: DEFAULT_PAGE_SIZE || 10,
    sort: "desc",
  });

  // Get customer data
  const {
    Customer: customers = [],
    totalCount = 0,
    isLoading,
    error,
  } = useGetCustomers(pagination);

  // Show loading state
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  // Show error state with proper error page
  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data;
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode || 500}
        message={
          errorResponse?.message ||
          "Failed to load customers. Please try again later."
        }
      />
    );
  }

  const handleAddCustomerClick = () => {
    navigate({ to: "/customers/add-customer" });
  };

  const handleEditCustomer = (customerId: string) => {
    navigate({ to: `/customers/edit-customer/${customerId}` });
    // Find the customer data
    const customerToEdit = customers.find(
      (customer) => customer.customerId === customerId
    );
    if (customerToEdit) {
      // Set the current row in store for the modal
      setCurrentRow(customerToEdit);
      setOpen("edit");
    }
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, limit: pageSize, sort: "desc" });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight ">
          Customer Directory
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleAddCustomerClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer List Section */}
      <Card className="relative">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Customer List</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your customer database and relationships.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-5">
            <div className="relative w-[260px]">
              <Input
                placeholder="Search customers..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="pl-4"
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ status: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {["All Status", "Active", "Inactive", "Draft"].map(
                    (option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Select
                value={filters.customerTypeId}
                onValueChange={(value) => setFilters({ customerTypeId: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "All Types",
                    "Technology",
                    "Manufacturing",
                    "Healthcare",
                    "Finance",
                    "Retail",
                    "Consulting",
                    "Education",
                  ].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <CustomersTable
              data={customers}
              totalCount={totalCount}
              loading={isLoading}
              currentPage={pagination.page}
              paginationCallbacks={{ onPaginationChange }}
              onEdit={handleEditCustomer}
            />
          </div>

          {/* Action Modals */}
          <CustomersActionModal />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDirectoryPage;
