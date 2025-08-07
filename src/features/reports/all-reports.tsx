import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReportsHead from "./components/ReportsHead";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { columns } from "./components/all-reports-columns";
import { ColumnDef } from "@tanstack/react-table";
import { dummyReports } from "./data/all-reports-data";
import { SimpleBarChart } from "./components/SimpleBarChart";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { SelectFilter } from "./components/SelectFilter";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";

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
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Triggered on any filter change
  const handleFilterChange = (updated: Partial<Filters>) => {
    const newFilters = { ...filters, ...updated };
    setFilters(newFilters);

    const applied = {
      startDate: newFilters.dateRange?.from
        ? format(newFilters.dateRange.from, "yyyy-MM-dd")
        : "",
      endDate: newFilters.dateRange?.to
        ? format(newFilters.dateRange.to, "yyyy-MM-dd")
        : "",
      salesRep: newFilters.salesRep,
      category: newFilters.category,
    };

    console.log("Applied Filters:", applied);
    // Fetch data here if needed
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
            placeholder="Select Sales Representatives"
            options={[
              { label: "John Doe", value: "john" },
              { label: "Jane Smith", value: "jane" },
              { label: "Alex Johnson", value: "alex" },
            ]}
          />

          <SelectFilter
            label="Expense Categories"
            value={filters.category}
            onChange={(value) => handleFilterChange({ category: value })}
            placeholder="Select Expense Categories"
            options={[
              { label: "Travel", value: "travel" },
              { label: "Meals", value: "meals" },
              { label: "Supplies", value: "supplies" },
            ]}
          />
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <ReportsHead
          title="Expense Reports"
          subtitle="Expense report from 1 May to 2025"
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <CustomDataTable
              paginationCallbacks={{ onPaginationChange }}
              data={dummyReports}
              currentPage={currentPage}
              columns={columns as ColumnDef<unknown>[]}
              totalCount={pageSize}
            />
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
