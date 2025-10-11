import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ReportsHead from "./components/ReportsHead";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { columns } from "./components/all-reports-columns";
import { ColumnDef } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import {
  useExpenseReports,
  useReportGeneration,
} from "./hooks/use-reports-api";
import { type ReportFilter } from "./services/reports-api";
import { useGetAllUsers } from "../UserManagement/services/AllUsers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { useGetExpenseCategoriesDropDownList } from "../settings/Approvers/services/approvers.hook";
import { dummyReports } from "./data/all-reports-data";

interface Filters {
  expanseDateRange?: DateRange;
  createdDateRange?: DateRange;
  salesRep: string;
  category: string;
}

const AllReports: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    expanseDateRange: undefined,
    createdDateRange: undefined,
    salesRep: "",
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { generateReport, generating } = useReportGeneration();

  const { data: userListDropDownData = [] } = useGetAllUsers();
  const { expenseCategories: expenseCategoriesData } =
    useGetExpenseCategoriesDropDownList({ defaultCategory: true });

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

  // Convert filters to API format - memoized to prevent infinite re-renders
  const apiFilters: ReportFilter = useMemo(
    () => ({
      expanseDateRange: filters.expanseDateRange
        ? {
            from: filters.expanseDateRange.from!,
            to: filters.expanseDateRange.to!,
          }
        : undefined,
      createdDateRange: filters.createdDateRange
        ? {
            from: filters.createdDateRange.from!,
            to: filters.createdDateRange.to!,
          }
        : undefined,
      salesRep: filters.salesRep || undefined,
      category: filters.category || undefined,
    }),
    [
      filters.expanseDateRange?.from,
      filters.expanseDateRange?.to,
      filters.createdDateRange?.from,
      filters.createdDateRange?.to,
      filters.salesRep,
      filters.category,
    ]
  );

  const { reports, loading: reportsLoading } = useExpenseReports(apiFilters);

  // Triggered on any filter change
  const handleFilterChange = (updated: Partial<Filters>) => {
    const newFilters = { ...filters, ...updated };
    setFilters(newFilters);
  };

  // Handle generate report
  const handleGenerateReport = async () => {
    const result = await generateReport("expense-report", apiFilters);
    if (result.success) {
      console.log("Report generated:", result.reportId, apiFilters);
      // You could show a success message here
    }
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const filtersGlob: FilterConfig[] = [
    {
      key: "expanse-date-range",
      type: "date-range",
      placeholder: "Expanse Date Range",
      dateRangeValue: filters.expanseDateRange,
      onDateRangeChange: (range: any) =>
        handleFilterChange({ expanseDateRange: range }),
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "created-date-range",
      type: "date-range",
      placeholder: "Created Date Range",
      dateRangeValue: filters.createdDateRange,
      onDateRangeChange: (range: any) =>
        handleFilterChange({ createdDateRange: range }),
      dataRangeClassName: "w-full max-w-xs",
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
      key: "category",
      type: "searchable-select",
      onChange: (value: any) => handleFilterChange({ category: value }),
      placeholder: "Select Category",
      options: expenseCategoryOptions,
      value: filters.category,
      onCancelPress: () => handleFilterChange({ category: "" }),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
  ];

  return (
    <div>
      <Card className="p-4 gap-0">
        <ReportsHead
          title="Expense Report Generator"
          subtitle="Generate detailed expense reports with customizable filters."
        />
        <Separator className="my-4" />

        <GlobalFilterSection
          key={"reports-view-filters"}
          filters={filtersGlob}
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
          title="Expense Reports"
          subtitle="Expense report from 1 May to 2025"
        />
        {reportsLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading reports...</span>
          </div>
        ) : (
          <CustomDataTable
            paginationCallbacks={{ onPaginationChange }}
            data={dummyReports}
            currentPage={currentPage}
            columns={columns as ColumnDef<unknown>[]}
            totalCount={reports.length}
            defaultPageSize={pageSize}
          />
        )}
      </Card>
    </div>
  );
};

export default AllReports;
