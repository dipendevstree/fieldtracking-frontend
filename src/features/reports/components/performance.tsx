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


interface QuickStatsData1 {
  weeklyExpense: string;
  topSpenders: string;
  pendingApprovals: string;
}

interface QuickStatsData2 {
  topPerformer: string;
  topProductive: string;
  topFeedback: string;
}


// Sample data for Quick Stats sections
const quickStatsData1: QuickStatsData1[] = [
  { weeklyExpense: "Kristin Watson", topSpenders: "Wade Warren", pendingApprovals: "Dianne Russell" },
  { weeklyExpense: "Floyd Miles", topSpenders: "Albert Flores", pendingApprovals: "Ronald Richards" },
  { weeklyExpense: "Eleanor Pena", topSpenders: "Courtney Henry", pendingApprovals: "Jerome Bell" }
];

const quickStatsData2: QuickStatsData2[] = [
  { topPerformer: "Kristin Watson", topProductive: "Wade Warren", topFeedback: "Dianne Russell" },
  { topPerformer: "Floyd Miles", topProductive: "Albert Flores", topFeedback: "Ronald Richards" },
  { topPerformer: "Eleanor Pena", topProductive: "Courtney Henry", topFeedback: "Jerome Bell" }
];

export default function PerformanceReportGenerator() {
  // Define filters interface following the same pattern as all-reports.tsx
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

 
  // Quick Stats 1 columns
  const quickStats1Columns = useMemo<ColumnDef<QuickStatsData1>[]>(() => [
    {
      accessorKey: 'weeklyExpense',
      header: () => <span className="font-medium text-gray-600">Weekly Expense Summary</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('weeklyExpense')}</span>,
    },
    {
      accessorKey: 'topSpenders',
      header: () => <span className="font-medium text-gray-600">Top Spenders Report</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('topSpenders')}</span>,
    },
    {
      accessorKey: 'pendingApprovals',
      header: () => <span className="font-medium text-gray-600">Pending Approvals Report</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('pendingApprovals')}</span>,
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



  const quickStats1Table = useReactTable<QuickStatsData1>({
    data: quickStatsData1,
    columns: quickStats1Columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
            {/* <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Input 
                    id="start-date"
                    type="date" 
                    placeholder="Start date"
                    value={filters.dateRange?.from ? new Date(filters.dateRange.from).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const from = e.target.value ? new Date(e.target.value) : undefined;
                      const to = filters.dateRange?.to;
                      handleFilterChange({ dateRange: { from, to } });
                    }}
                  />
                </div>
                <div className="relative">
                  <Input 
                    id="end-date"
                    type="date" 
                    placeholder="End date"
                    value={filters.dateRange?.to ? new Date(filters.dateRange.to).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const from = filters.dateRange?.from;
                      const to = e.target.value ? new Date(e.target.value) : undefined;
                      handleFilterChange({ dateRange: { from, to } });
                    }}
                  />
                </div>
              </div>
            </div> */}

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

        {/* Quick Stats - First Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Expense report from 1 may to 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {quickStats1Table.getHeaderGroups().map((headerGroup) => (
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
                {quickStats1Table.getRowModel().rows.map((row) => (
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

        {/* Quick Stats - Second Section */}
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