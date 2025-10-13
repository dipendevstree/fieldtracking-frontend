import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ReportsHead from "./ReportsHead";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  REPORT_TYPE,
  ReportFormat,
} from "@/data/app.data";
import {
  useCustomReportGeneration,
  type ReportFilter,
} from "../services/reports-api";
import { useGetAllUsers } from "../../UserManagement/services/AllUsers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { useGetExpenseCategoriesDropDownList } from "../../settings/Approvers/services/approvers.hook";
import { customReportData } from "../data/all-reports-data";
import { CustomeReportFilter } from "../types";
import { formatDropDownLabel } from "@/utils/commonFunction";
import { customReportsColumns } from "./customReportsColumns";
import { useGetAllCustomer } from "@/features/calendar/services/calendar-view.hook";

const CustomReport: React.FC = () => {
  const [filters, setFilters] = useState<CustomeReportFilter>({
    dateRange: undefined,
    reportType: "",
    salesRep: "",
    customerId: "",
    category: "",
    format: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const apiFilters: ReportFilter = useMemo(
    () => ({
      dateRange: filters.dateRange
        ? {
            from: filters.dateRange.from!,
            to: filters.dateRange.to!,
          }
        : undefined,
      reportType: filters.reportType || undefined,
      salesRep: filters.salesRep || undefined,
      category: filters.category || undefined,
    }),
    [
      filters.dateRange?.from,
      filters.dateRange?.to,
      filters.reportType,
      filters.salesRep,
      filters.category,
    ]
  );

  const {
    reports,
    isLoading: generating,
    totalCount,
    refetch,
  } = useCustomReportGeneration(
    { ...apiFilters, page: currentPage, limit: pageSize },
    { enabled: false }
  );

  const { data: userListDropDownData = [] } = useGetAllUsers();
  const { expenseCategories: expenseCategoriesData } =
    useGetExpenseCategoriesDropDownList({ defaultCategory: true });
  const { data: customers } = useGetAllCustomer();

  const userListDropDownList = userListDropDownData?.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  const expenseCategoriesDropDownList = expenseCategoriesData || [];

  const usersOptions = useSelectOptions<any>({
    listData: userListDropDownList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const expenseCategoryOptions = useSelectOptions({
    listData: expenseCategoriesDropDownList,
    labelKey: "categoryName",
    valueKey: "expensesCategoryId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const customerOptions = useSelectOptions({
    listData: customers ?? [],
    labelKey: "companyName",
    valueKey: "customerId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const formatOptions = Object.entries(ReportFormat).map(([key, value]) => ({
    label: formatDropDownLabel(key),
    value,
  }));

  const reportTypeOptions = Object.entries(REPORT_TYPE).map(([key, value]) => ({
    label: formatDropDownLabel(key),
    value,
  }));

  // Triggered on any filter change
  const handleFilterChange = (updated: Partial<CustomeReportFilter>) => {
    // If the user changes report type, reset everything else
    if (updated.reportType !== undefined) {
      setFilters({
        dateRange: undefined,
        reportType: updated.reportType,
        salesRep: "",
        customerId: "",
        category: "",
        format: "",
        status: "",
      });
    } else {
      setFilters((prev) => ({ ...prev, ...updated }));
    }
  };

  // Handle generate report
  const handleGenerateReport = async () => {
    refetch();
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const filtersGlob: FilterConfig[] = [
    {
      key: "date-range",
      type: "date-range",
      placeholder: "Pick Date Range",
      dateRangeValue: filters.dateRange,
      onDateRangeChange: (range: any) =>
        handleFilterChange({ dateRange: range }),
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "report-type",
      type: "searchable-select",
      onChange: (value: any) => handleFilterChange({ reportType: value }),
      placeholder: "Select Report Type",
      options: reportTypeOptions,
      value: filters.reportType,
      onCancelPress: () => handleFilterChange({ reportType: "" }),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "salesRepresentativeUserId",
      type: "searchable-select",
      onChange: (value: any) => handleFilterChange({ salesRep: value }),
      placeholder: "Select Sales Rep",
      value: filters.salesRep,
      options: usersOptions,
      onCancelPress: () => handleFilterChange({ salesRep: "" }),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "customerId",
      type: "searchable-select",
      onChange: (value) => handleFilterChange({ customerId: value }),
      onCancelPress: () => handleFilterChange({ customerId: "" }),
      placeholder: "Select customer",
      value: filters.customerId,
      options: customerOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "category",
      type: "searchable-select",
      onChange: (value: any) => handleFilterChange({ category: value }),
      placeholder: "Select Category",
      options: expenseCategoryOptions,
      value: filters.category,
      onCancelPress: () => handleFilterChange({ category: "" }),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "format",
      type: "searchable-select",
      onChange: (value: any) => handleFilterChange({ format: value }),
      placeholder: "Select Format",
      options: formatOptions,
      value: filters.format,
      onCancelPress: () => handleFilterChange({ format: "" }),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "status",
      type: "searchable-select",
      onChange: (value: any) => handleFilterChange({ status: value }),
      placeholder: "Select Status",
      options: [
        { label: "Completed", value: "completed" },
        { label: "Pending", value: "pending" },
      ],
      value: filters.status,
      onCancelPress: () => handleFilterChange({ status: "" }),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
  ];

  const filterVisibilityMap: Record<string, string[]> = {
    [REPORT_TYPE.VISIT_REPORTS]: [
      "date-range",
      "salesRepresentativeUserId",
      "customerId",
      "status",
      "format",
    ],
    [REPORT_TYPE.PRODUCTIVITY_REPORT]: [
      "date-range",
      "salesRepresentativeUserId",
      "format",
    ],
    [REPORT_TYPE.CUSTOMER_REPORT]: ["date-range", "customerId", "format"],
    [REPORT_TYPE.FIELD_ACTIVITY_REPORT]: [
      "date-range",
      "salesRepresentativeUserId",
      "format",
    ],
  };

  const visibleFilterKeys =
    filterVisibilityMap[filters.reportType as REPORT_TYPE] || [];

  const visibleFilters = filtersGlob.filter((f) =>
    visibleFilterKeys.includes(f.key)
  );

  const visibleFiltersWithReportType = [
    filtersGlob.find((f) => f.key === "report-type")!,
    ...visibleFilters,
  ];

  return (
    <div>
      <Card className="p-4 gap-0">
        <ReportsHead
          title="Custom Report Generator"
          subtitle="Generate detailed custom reports with customizable filters."
        />
        <Separator className="my-4" />

        <GlobalFilterSection
          key={"reports-view-filters"}
          filters={visibleFiltersWithReportType}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleGenerateReport}
            disabled={generating}
            className="min-w-[120px]"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-4 mt-4 gap-2">
        <ReportsHead
          title="Custom Reports"
          subtitle="Custom report from 1 May to 2025"
        />
        {generating ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading reports...</span>
          </div>
        ) : (
          <CustomDataTable
            paginationCallbacks={{ onPaginationChange }}
            data={customReportData ?? reports}
            currentPage={currentPage}
            columns={customReportsColumns as ColumnDef<unknown>[]}
            totalCount={totalCount}
            defaultPageSize={pageSize}
          />
        )}
      </Card>
    </div>
  );
};

export default CustomReport;
