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
  REPORT_FORMAT,
  VISIT_STATUS,
} from "@/data/app.data";
import {
  useCustomReportGeneration,
  useGetCustomReports,
  type ReportFilter,
} from "../services/reports-api";
import { useGetAllUsers } from "../../UserManagement/services/AllUsers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { useGetExpenseCategoriesDropDownList } from "../../settings/Approvers/services/approvers.hook";
import { CustomeReportFilter } from "../types";
import { formatDropDownLabel } from "@/utils/commonFunction";
import { useGetAllCustomer } from "@/features/calendar/services/calendar-view.hook";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ProductivityReportsColumns } from "./productivityReportsColumns";
import { CustomerReportColumns } from "./CustomerReportColumns";
import { VisitReportColumns } from "./visitReportColumns";
import { Main } from "@/components/layout/main";

const normalizeOptions = (options: any[]) =>
  options.map((o) => ({ ...o, value: String(o.value) }));

const CustomReport: React.FC = () => {
  // -------------------- State --------------------
  const [filters, setFilters] = useState<CustomeReportFilter>({
    dateRange: undefined,
    reportType: REPORT_TYPE.VISIT_REPORTS,
    salesRep: "",
    customerId: "",
    category: "",
    format: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // -------------------- API Hooks --------------------
  const { data: userListDropDownData = [] } = useGetAllUsers();
  const { expenseCategories: expenseCategoriesData } =
    useGetExpenseCategoriesDropDownList({ defaultCategory: true });
  const { data: customers } = useGetAllCustomer();

  const userListDropDownList = userListDropDownData.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  // -------------------- Select Options --------------------
  const usersOptions = normalizeOptions(
    useSelectOptions({
      listData: userListDropDownList,
      labelKey: "fullName",
      valueKey: "id",
    })
  );

  const expenseCategoryOptions = normalizeOptions(
    useSelectOptions({
      listData: expenseCategoriesData || [],
      labelKey: "categoryName",
      valueKey: "expensesCategoryId",
    })
  );

  const customerOptions = normalizeOptions(
    useSelectOptions({
      listData: customers ?? [],
      labelKey: "companyName",
      valueKey: "customerId",
    })
  );

  const reportTypeOptions = Object.entries(REPORT_TYPE).map(([key, value]) => ({
    label: formatDropDownLabel(key),
    value,
  }));

  const visitStatusOptions = Object.entries(VISIT_STATUS).map(
    ([key, value]) => ({
      label: formatDropDownLabel(key),
      value,
    })
  );

  // -------------------- Filters & API Params --------------------
  const apiFilters: ReportFilter = useMemo(() => {
    const type = filters.reportType || undefined;

    const startDate =
      filters.dateRange?.from instanceof Date
        ? format(filters.dateRange.from, "yyyy-MM-dd")
        : undefined;

    const endDate =
      filters.dateRange?.to instanceof Date
        ? format(filters.dateRange.to, "yyyy-MM-dd")
        : undefined;

    const baseFilters: any = {
      type,
      format: filters.format || undefined,
      startDate,
      endDate,
    };

    const reportSpecificFilters: Record<string, any> = {
      [REPORT_TYPE.VISIT_REPORTS]: {
        salesRep: filters.salesRep || undefined,
        customer: filters.customerId || undefined,
        status: filters.status || undefined,
      },
      [REPORT_TYPE.PRODUCTIVITY_REPORT]: {
        salesRep: filters.salesRep || undefined,
      },
      [REPORT_TYPE.CUSTOMER_REPORT]: {
        customer: filters.customerId || undefined,
      },
    };

    if (type) {
      Object.assign(baseFilters, reportSpecificFilters[type] || {});
    }

    return baseFilters;
  }, [
    filters.reportType,
    filters.dateRange?.from,
    filters.dateRange?.to,
    filters.salesRep,
    filters.customerId,
    filters.status,
  ]);

  const { reports, isLoading, totalCount } = useGetCustomReports({
    ...apiFilters,
    page: currentPage,
    limit: pageSize,
  });

  const { mutate: generateReport, isPending: isGenerating } =
    useCustomReportGeneration();

  // -------------------- Handlers --------------------
  const handleFilterChange = (updated: Partial<CustomeReportFilter>) => {
    if (updated.reportType !== undefined) {
      // reset filters if report type changes
      setFilters({
        dateRange: undefined,
        reportType: updated.reportType,
        salesRep: "",
        customerId: "",
        category: "",
        format: "",
        status: "",
      });
      setErrors({});
    } else {
      setFilters((prev) => ({ ...prev, ...updated }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        for (const key of Object.keys(updated)) delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateFilters = () => {
    const newErrors: Record<string, string> = {};

    if (!filters.reportType) {
      setErrors({ reportType: "Report type is required" });
      return false;
    }

    if (!filters.dateRange?.from || !filters.dateRange?.to) {
      newErrors.dateRange = "Date range is required";
    }

    if (filters.reportType === REPORT_TYPE.PRODUCTIVITY_REPORT) {
      visibleFiltersWithReportType.forEach(({ key, placeholder }) => {
        if (["report-type", "date-range", "format"].includes(key)) return;

        const value =
          key === "salesRepresentativeUserId"
            ? filters.salesRep
            : key === "customerId"
              ? filters.customerId
              : (filters as any)[key];

        if (!value)
          newErrors[key] =
            `${placeholder?.replace("Select ", "") || "Field"} is required`;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateReport = async (selectedFormat?: string) => {
    setErrors({});
    const formatToUse = selectedFormat || filters.format;
    if (!formatToUse) {
      setErrors({ format: "Format is required" });
      return;
    }

    const finalFilters = { ...apiFilters, format: formatToUse };

    if (!validateFilters()) return;
    generateReport(finalFilters);
  };

  const onPaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // -------------------- Filter Config --------------------
  const filtersGlob: FilterConfig[] = useMemo(
    () => [
      {
        key: "date-range",
        type: "date-range",
        placeholder: "Pick Date Range",
        dateRangeValue: filters.dateRange,
        onDateRangeChange: (range) => handleFilterChange({ dateRange: range }),
        dataRangeClassName: "w-full max-w-xs",
      },
      {
        key: "report-type",
        type: "searchable-select",
        onChange: (v) => handleFilterChange({ reportType: v }),
        placeholder: "Select Report Type",
        options: reportTypeOptions,
        value: filters.reportType,
        // onCancelPress: () => handleFilterChange({ reportType: "" }),
        searchableSelectClassName: "w-full max-w-[180px]",
      },
      {
        key: "salesRepresentativeUserId",
        type: "searchable-select",
        onChange: (v) => handleFilterChange({ salesRep: v }),
        placeholder: "Select Sales Rep",
        value: filters.salesRep,
        options: usersOptions,
        onCancelPress: () => handleFilterChange({ salesRep: "" }),
        searchableSelectClassName: "w-full max-w-[180px]",
      },
      {
        key: "customerId",
        type: "searchable-select",
        onChange: (v) => handleFilterChange({ customerId: v }),
        onCancelPress: () => handleFilterChange({ customerId: "" }),
        placeholder: "Select Customer",
        value: filters.customerId,
        options: customerOptions,
        searchableSelectClassName: "w-full max-w-[180px]",
      },
      {
        key: "category",
        type: "searchable-select",
        onChange: (v) => handleFilterChange({ category: v }),
        placeholder: "Select Category",
        options: expenseCategoryOptions,
        value: filters.category,
        onCancelPress: () => handleFilterChange({ category: "" }),
        searchableSelectClassName: "w-full max-w-[180px]",
      },
      {
        key: "status",
        type: "searchable-select",
        onChange: (v) => handleFilterChange({ status: v }),
        placeholder: "Select Status",
        options: visitStatusOptions,
        value: filters.status,
        onCancelPress: () => handleFilterChange({ status: "" }),
        searchableSelectClassName: "w-full max-w-[180px]",
      },
    ],
    [filters, usersOptions, expenseCategoryOptions, customerOptions]
  );

  const filterVisibilityMap: Record<string, string[]> = {
    [REPORT_TYPE.VISIT_REPORTS]: [
      "date-range",
      "salesRepresentativeUserId",
      "customerId",
      "status",
    ],
    [REPORT_TYPE.PRODUCTIVITY_REPORT]: [
      "date-range",
      "salesRepresentativeUserId",
    ],
    [REPORT_TYPE.CUSTOMER_REPORT]: ["date-range", "customerId"],
  };

  const visibleFilterKeys =
    filterVisibilityMap[filters.reportType as REPORT_TYPE] || [];

  const visibleFilters = filtersGlob.filter((f) =>
    visibleFilterKeys.includes(f.key)
  );

  const visibleFiltersWithReportType = useMemo(
    () => [
      filtersGlob.find((f) => f.key === "report-type")!,
      ...visibleFilters,
    ],
    [filters.reportType, visibleFilters]
  );

  //---------------------columns --------------------
  const reportColumnsMap: Record<REPORT_TYPE, ColumnDef<any>[]> = {
    [REPORT_TYPE.VISIT_REPORTS]: VisitReportColumns,
    [REPORT_TYPE.CUSTOMER_REPORT]: CustomerReportColumns,
    [REPORT_TYPE.PRODUCTIVITY_REPORT]: ProductivityReportsColumns,
  };

  const columns = useMemo<ColumnDef<any>[]>(() => {
    return reportColumnsMap[filters.reportType as REPORT_TYPE] || [];
  }, [filters.reportType, reportColumnsMap]);

  // -------------------- UI --------------------
  return (
    <Main>
      <Card className="p-4 gap-0">
        <ReportsHead
          title="Custom Report Generator"
          subtitle="Generate detailed custom reports with customizable filters."
        />
        <Separator className="my-4" />

        <GlobalFilterSection
          key="reports-view-filters"
          filters={visibleFiltersWithReportType}
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
              <Button
                disabled={
                  isGenerating || isLoading || !reports || reports.length === 0
                }
                className="min-w-[150px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(REPORT_FORMAT).map(([key, value]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => {
                    handleGenerateReport(value);
                  }}
                >
                  {formatDropDownLabel(key)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <Card className="p-4 mt-4 gap-2">
        <ReportsHead
          title="Custom Reports"
          subtitle="Custom report results generated based on your filters."
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
            columns={columns as ColumnDef<unknown>[]}
            totalCount={totalCount}
            defaultPageSize={pageSize}
          />
        )}
      </Card>
    </Main>
  );
};

export default CustomReport;
