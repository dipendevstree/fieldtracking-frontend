import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ReportsHead from "./components/ReportsHead";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { columns } from "./components/all-reports-columns";
import { ColumnDef } from "@tanstack/react-table";
import { SimpleBarChart } from "./components/SimpleBarChart";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { SelectFilter } from "./components/SelectFilter";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { useSalesReps, useExpenseCategories, useExpenseReports, useReportGeneration } from "./hooks/use-reports-api";
import { type ReportFilter } from "./services/reports-api";

interface Filters {
  dateRange?: DateRange;
  salesRep: string;
  category: string;
}

const AllReports: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: undefined,
    salesRep: "",
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_NUMBER);
  const [, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // API hooks
  const { salesReps, loading: salesRepsLoading } = useSalesReps();
  const { categories, loading: categoriesLoading } = useExpenseCategories();
  const { generateReport, generating } = useReportGeneration();

  // Convert filters to API format - memoized to prevent infinite re-renders
  const apiFilters: ReportFilter = useMemo(() => ({
    dateRange: filters.dateRange ? {
      from: filters.dateRange.from!,
      to: filters.dateRange.to!
    } : undefined,
    salesRep: filters.salesRep || undefined,
    category: filters.category || undefined,
  }), [filters.dateRange?.from, filters.dateRange?.to, filters.salesRep, filters.category]);

  const { reports, loading: reportsLoading } = useExpenseReports(apiFilters);

  // Triggered on any filter change
  const handleFilterChange = (updated: Partial<Filters>) => {
    const newFilters = { ...filters, ...updated };
    setFilters(newFilters);
  };

  // Handle generate report
  const handleGenerateReport = async () => {
    const result = await generateReport('expense-report', apiFilters);
    if (result.success) {
      console.log('Report generated:', result.reportId);
      // You could show a success message here
    }
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <Card className="p-6">
        <ReportsHead
          title="Expense Report Generator"
          subtitle="Generate detailed expense reports with customizable filters."
        />
        <Separator className="my-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DateRangeFilter
            dateRange={filters.dateRange}
            label="Select Date Range"
            setDateRange={(range) => handleFilterChange({ dateRange: range })}
          />

          <SelectFilter
            label="Sales Representatives"
            value={filters.salesRep}
            onChange={(value) => handleFilterChange({ salesRep: value })}
            placeholder={salesRepsLoading ? "Loading..." : "Select Sales Representatives"}
            options={salesReps.map(rep => ({ label: rep.name, value: rep.id }))}
          />

          <SelectFilter
            label="Expense Categories"
            value={filters.category}
            onChange={(value) => handleFilterChange({ category: value })}
            placeholder={categoriesLoading ? "Loading..." : "Select Expense Categories"}
            options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
          />
        </div>
        
        <div className="flex justify-end mt-4">
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
              'Generate Report'
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <ReportsHead
          title="Expense Reports"
          subtitle="Expense report from 1 May to 2025"
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            {reportsLoading ? (
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
                totalCount={reports.length}
              />
            )}
          </div>
          <div className="lg:col-span-4">
            <SimpleBarChart />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AllReports;
