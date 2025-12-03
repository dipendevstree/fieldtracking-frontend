import { useCallback, useMemo, useState } from "react";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  useGetCustomerFilter,
  useGetCustomers,
  useGetIndustry,
} from "@/features/customers/services/Customers.hook";
import { useCustomersStore } from "../store/customers.store";
import CustomersTable from "./table";
import { CustomersActionModal } from "./action-form-modal";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { ErrorPage } from "@/components/shared/custom-error";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import debounce from "lodash.debounce";
import GlobalFilterSection from "@/components/global-table-filter-section";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExportFile } from "@/hooks/useExportFile";
import API from "@/config/api/api";
import { Main } from "@/components/layout/main";
import { PermissionGate } from "@/permissions/components/PermissionGate";

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

  const queryParams = useMemo(
    () => ({
      ...pagination,
      searchFor: filters.search || "",
      industryId: filters.industryId || "",
      customerTypeId: filters.customerTypeId || "",
    }),
    [pagination, filters]
  );

  const exportQueryParams = useMemo(
    () => ({
      searchFor: filters.search || "",
      industryId: filters.industryId || "",
      customerTypeId: filters.customerTypeId || "",
      sort: "desc",
    }),
    [filters]
  );

  // Get customer data
  const {
    Customer: customers = [],
    totalCount = 0,
    isLoading,
    error,
  } = useGetCustomers(queryParams);

  const { data: industryList = [] } = useGetIndustry();
  const { data: customerList = [] } = useGetCustomerFilter();
  const { exportFile, isLoading: isExportLoading } = useExportFile();

  const industryOptions = useSelectOptions({
    listData: industryList ?? [],
    labelKey: "industryName",
    valueKey: "industryId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const customerOptions = useSelectOptions({
    listData: customerList ?? [],
    labelKey: "typeName",
    valueKey: "customerTypeId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters({ search: value });
    }, 800),
    []
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    debouncedSearch(searchValue);
  };

  const filtersConfig: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search Customers...",
      value: filters.search,
      onChange: handleGlobalSearchChange,
    },
    {
      key: "customerId",
      type: "searchable-select",
      placeholder: "Customer Type",
      value: filters.customerTypeId,
      onChange: (value) => setFilters({ customerTypeId: value ?? "" }),
      onCancelPress: () => setFilters({ customerTypeId: "" }),
      options: customerOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "industryId",
      type: "searchable-select",
      placeholder: "Industry Type",
      value: filters.industryId,
      onChange: (value) => setFilters({ industryId: value ?? "" }),
      onCancelPress: () => setFilters({ industryId: "" }),
      options: industryOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
  ];

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
    <Main>
      {/* Customer List Section */}
      <Card className="px-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Customer Directory</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your customer database and relationships.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    exportFile({
                      url: API.customerMain.exportCsv,
                      type: "csv",
                      queryParams: exportQueryParams,
                      filename: "customers",
                    })
                  }
                  disabled={isExportLoading}
                >
                  Export Csv
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportFile({
                      url: API.customerMain.exportExcel,
                      type: "xlsx",
                      queryParams: exportQueryParams,
                      filename: "customers",
                    })
                  }
                  disabled={isLoading}
                >
                  Export Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <PermissionGate
              requiredPermission="customer_directory"
              action="add"
            >
              <Button onClick={handleAddCustomerClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </PermissionGate>
          </div>
        </div>
      </Card>

      <GlobalFilterSection
        key="customer-directory-filters"
        filters={filtersConfig}
        className={"mb-0 mt-4"}
      />
      {/* Table */}
      <CustomersTable
        data={customers}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
        onEdit={handleEditCustomer}
      />
      {/* Action Modals */}
      <CustomersActionModal />
    </Main>
  );
};

export default CustomerDirectoryPage;
