import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ReportsHead from "./ReportsHead";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { expanseReportsColumns } from "./expanseReportsColumns";
import { ColumnDef } from "@tanstack/react-table";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  EXPENSE_STATUS,
  REPORT_FORMAT,
} from "@/data/app.data";
import {
  useCustomReportGeneration,
  useGetExpanseReport,
} from "../services/reports-api";
import { useGetAllUsers } from "../../UserManagement/services/AllUsers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { useGetExpenseCategoriesDropDownList } from "../../settings/Approvers/services/approvers.hook";
import { formatDropDownLabel } from "@/utils/commonFunction";
import { format } from "date-fns";
import { ExpanseReportFilterState } from "../types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const todayStr = format(new Date(), "yyyy-MM-dd");

const ExpanseReport: React.FC = () => {
  const [filters, setFilters] = useState<ExpanseReportFilterState>({
    startDate: undefined,
    endDate: undefined,
    createdStartDate: todayStr,
    createdEndDate: todayStr,
    salesRepresentativeUserId: "",
    expenseCategory: "",
    isWebAdminSide: true,
    sort: "desc",
    status: "",
    type: "Expenses Report",
    format: "",
  });

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { reports, isLoading, totalCount } = useGetExpanseReport({
    ...filters,
    page: currentPage,
    limit: pageSize,
  });

  const { mutate: generateReport, isPending: isGenerating } =
    useCustomReportGeneration();

  const { data: userListDropDownData = [] } = useGetAllUsers();
  const { expenseCategories: expenseCategoriesData } =
    useGetExpenseCategoriesDropDownList({ defaultCategory: true });

  // Prepare dropdowns
  const userListDropDownList = userListDropDownData.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  const usersOptions = useSelectOptions<any>({
    listData: userListDropDownList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const expenseCategoryOptions = useSelectOptions({
    listData: expenseCategoriesData || [],
    labelKey: "categoryName",
    valueKey: "categoryName",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const expanseStatusOptions = Object.entries(EXPENSE_STATUS).map(
    ([key, value]) => ({
      label: formatDropDownLabel(key),
      value,
    })
  );

  const filtersGlob: FilterConfig[] = [
    {
      key: "expanse-date-range",
      type: "date-range",
      placeholder: "Expanse Date Range",
      dateRangeValue: {
        from: filters.startDate ? new Date(filters.startDate) : undefined,
        to: filters.endDate ? new Date(filters.endDate) : undefined,
      },
      onDateRangeChange: (range) => handleDateRangeChange("expanse", range),
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "created-date-range",
      type: "date-range",
      placeholder: "Created Date Range",
      dateRangeValue: {
        from: filters.createdStartDate
          ? new Date(filters.createdStartDate)
          : undefined,
        to: filters.createdEndDate
          ? new Date(filters.createdEndDate)
          : undefined,
      },
      onDateRangeChange: (range) => handleDateRangeChange("created", range),
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "salesRepresentativeUserId",
      type: "searchable-select",
      onChange: (value: any) =>
        handleFilterChange("salesRepresentativeUserId", value),
      placeholder: "Select Sales Rep",
      value: filters.salesRepresentativeUserId,
      options: usersOptions,
      onCancelPress: () => handleFilterChange("salesRepresentativeUserId", ""),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "expenseCategory",
      type: "searchable-select",
      onChange: (value: any) => handleFilterChange("expenseCategory", value),
      placeholder: "Select Category",
      options: expenseCategoryOptions,
      value: filters.expenseCategory,
      onCancelPress: () => handleFilterChange("expenseCategory", ""),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "status",
      type: "searchable-select",
      onChange: (value: any) => handleFilterChange("status", value),
      placeholder: "Select Status",
      options: expanseStatusOptions,
      value: filters.status,
      onCancelPress: () => handleFilterChange("status", ""),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
  ];

  // Handle date range change
  const handleDateRangeChange = (
    key: "expanse" | "created",
    range: { from?: Date; to?: Date } | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      ...(key === "expanse"
        ? {
            startDate: range?.from
              ? format(range.from, "yyyy-MM-dd")
              : undefined,
            endDate: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
          }
        : {
            createdStartDate: range?.from
              ? format(range.from, "yyyy-MM-dd")
              : undefined,
            createdEndDate: range?.to
              ? format(range.to, "yyyy-MM-dd")
              : undefined,
          }),
    }));
    setCurrentPage(1);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.dateRange;
      return newErrors;
    });
  };

  // Handle other filters
  const handleFilterChange = (
    key: keyof ExpanseReportFilterState,
    value?: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  // ✅ Validation logic
  const validateFilters = () => {
    const newErrors: Record<string, string> = {};
    if (!filters.startDate || !filters.endDate) {
      newErrors.dateRange = "Expense date range is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Generate report based on selected format
  const handleGenerateReport = (formatType: string) => {
    setErrors({});
    if (!validateFilters()) return;
    generateReport({ ...filters, format: formatType });
  };

  // Pagination
  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const formatOptions = Object.entries(REPORT_FORMAT).map(([key, value]) => ({
    label: formatDropDownLabel(key),
    value,
  }));

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

        {Object.keys(errors).length > 0 && (
          <div className="text-sm text-red-600 space-y-1">
            {Object.entries(errors).map(([key, msg]) => (
              <div key={key}>• {msg}</div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isGenerating} className="min-w-[150px]">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate Report</>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {formatOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => handleGenerateReport(opt.value)}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <Card className="p-4 mt-4 gap-2">
        <ReportsHead
          title="Expense Reports"
          subtitle="Expense report results"
        />
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading reports...</span>
          </div>
        ) : (
          <CustomDataTable
            paginationCallbacks={{ onPaginationChange }}
            data={reports}
            currentPage={currentPage}
            columns={expanseReportsColumns as ColumnDef<unknown>[]}
            totalCount={totalCount}
            defaultPageSize={pageSize}
          />
        )}
      </Card>
    </div>
  );
};

export default ExpanseReport;
