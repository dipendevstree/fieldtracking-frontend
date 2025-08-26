import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useSalesReps, useReportGeneration } from '../hooks/use-reports-api';
import { reportsAPI, type ReportFilter } from '../services/reports-api';
import { DateRangeFilter } from './DateRangeFilter';
import { DateRange } from 'react-day-picker';
import ReportsHead from './ReportsHead';
import { CustomDataTable } from '@/components/shared/custom-data-table';
import { SimpleBarChart } from './SimpleBarChart';

interface FeedbackReportData {
  salesRep: string;
  feedback: string;
  date: string;
  productivity: string;
}

interface QuickStatsData2 {
  topPerformer: string;
  topProductive: string;
  topFeedback: string;
}

// Sample data for Quick Stats sections
const feedbackReportData: FeedbackReportData[] = [
  { salesRep: "Kristin Watson", feedback: "Wade Warren", date: "12-02-2025", productivity: "100%" },
  { salesRep: "Floyd Miles", feedback: "Albert Flores", date: "01-05-2025", productivity: "100%" },
  { salesRep: "Eleanor Pena", feedback: "Courtney Henry", date: "21-09-2025", productivity: "100%" },
  { salesRep: "Eleanor Pena", feedback: "Courtney Henry", date: "21-09-2025", productivity: "100%" },
];

const quickStatsData2: QuickStatsData2[] = [
  { topPerformer: "Kristin Watson", topProductive: "Wade Warren", topFeedback: "Dianne Russell" },
  { topPerformer: "Floyd Miles", topProductive: "Albert Flores", topFeedback: "Ronald Richards" },
  { topPerformer: "Eleanor Pena", topProductive: "Courtney Henry", topFeedback: "Jerome Bell" }
];

export default function PerformanceReportGenerator() {
  interface Filters {
    dateRange?: DateRange;
    salesRep: string;
    reportType: string;
  }

  // Initialize filters state following the same pattern
  const [filters, setFilters] = useState<Filters>({
    dateRange: undefined,
    salesRep: "",
    reportType: "",
  });

  // API hooks
  const { salesReps, loading: salesRepsLoading } = useSalesReps();
  const { generateReport, generating } = useReportGeneration();

  // Get static options
  const reportTypeOptions = reportsAPI.getReportTypeOptions();

  // Convert filters to API format
  const apiFilters: ReportFilter = useMemo(() => ({
    dateRange: filters.dateRange ? {
      from: filters.dateRange.from!,
      to: filters.dateRange.to!
    } : undefined,
    salesRep: filters.salesRep || undefined,
  }), [filters.dateRange?.from, filters.dateRange?.to, filters.salesRep]);

  const feedbackReportColumns = useMemo<ColumnDef<FeedbackReportData>[]>(() => [
    {
      accessorKey: 'salesRep',
      header: () => <span className="font-medium text-gray-600">Sales Rep</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('salesRep')}</span>,
      enableSorting: false,
    },
    {
      accessorKey: 'feedback',
      header: () => <span className="font-medium text-gray-600">Feedback Report</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('feedback')}</span>,
      enableSorting: false,
    },
    {
      accessorKey: 'date',
      header: () => <span className="font-medium text-gray-600">Date</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('date')}</span>,
      enableSorting: false,
    },
    {
      accessorKey: 'productivity', // <-- FIXED: must match data property
      header: () => <span className="font-medium text-gray-600">Productivity Report</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('productivity')}</span>,
      enableSorting: false,
    },
  ], []);

  // Quick Stats 2 columns
  const quickStats2Columns = useMemo<ColumnDef<QuickStatsData2>[]>(() => [
    {
      accessorKey: 'topPerformer',
      header: () => <span className="font-medium text-gray-600">Top Performer Sales Rep</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('topPerformer')}</span>,
    },
    {
      accessorKey: 'topProductive',
      header: () => <span className="font-medium text-gray-600">Top Productive Sales Rep</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('topProductive')}</span>,
    },
    {
      accessorKey: 'topFeedback',
      header: () => <span className="font-medium text-gray-600">Top Feedback Gainers</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('topFeedback')}</span>,
    },
  ], []);

  const quickStats2Table = useReactTable<QuickStatsData2>({
    data: quickStatsData2,
    columns: quickStats2Columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Filter change handler following the same pattern as all-reports.tsx
  const handleFilterChange = (updated: Partial<Filters>) => {
    const newFilters = { ...filters, ...updated };
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      dateRange: undefined,
      salesRep: "",
      reportType: "",
    });
  };

  const handleApply = async () => {
    const result = await generateReport('performance-report', apiFilters);
    if (result.success) {
      console.log('Performance report generated:', result.reportId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Report Generator</h1>
        <p className="text-sm text-gray-500">Generate detailed expense reports with customizable filters.</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Configure your performance report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={filters.reportType} onValueChange={(value) => handleFilterChange({ reportType: value })}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypeOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DateRangeFilter
              dateRange={filters.dateRange}
              label="Date Range"
              setDateRange={(range) => handleFilterChange({ dateRange: range })}
            />
            <div className="space-y-2">
              <Label htmlFor="sales-rep">Sales Rep</Label>
              <Select value={filters.salesRep} onValueChange={(value) => handleFilterChange({ salesRep: value })}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder={salesRepsLoading ? "Loading..." : "Select Sales Rep"} />
                </SelectTrigger>
                <SelectContent>
                  {salesReps.map(rep => (
                    <SelectItem key={rep.id} value={rep.id}>
                      {rep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Apply'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6 mt-6">
        <ReportsHead
          title="Feedback Reports"
          subtitle="Expense report from 1 May to 2025"
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            {salesRepsLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading reports...</span>
              </div>
            ) : (
              <CustomDataTable
                data={feedbackReportData}
                columns={feedbackReportColumns as ColumnDef<unknown>[]}
                totalCount={salesReps.length}
              />
            )}
          </div>
          <div className="lg:col-span-4">
            <SimpleBarChart />
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Expense report from 1 may to 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {quickStats2Table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="py-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {quickStats2Table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}