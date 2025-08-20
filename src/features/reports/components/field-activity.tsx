import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Filter, MapPin, Car, Users, Clock, Award, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useSalesReps, useTerritories, useFieldActivityReports, useReportGeneration } from '../hooks/use-reports-api';
import { reportsAPI, type ReportFilter } from '../services/reports-api';
import { DateRangeFilter } from './DateRangeFilter';
import { DateRange } from 'react-day-picker';


// Define proper TypeScript interfaces
interface FieldActivityData {
  id: number;
  salesRep: string;
  date: string;
  territory: string;
  modeOfTravel: string;
  amount: string;
}

// Mock data with proper typing
const mockData: FieldActivityData[] = [
  { id: 1, salesRep: 'Jacob Jones', date: '29/04/2015', territory: 'North Region', modeOfTravel: 'Bus', amount: '$200' },
  { id: 2, salesRep: 'Brenda Cooper', date: '28/04/2015', territory: 'Downtown District', modeOfTravel: 'Bus', amount: '$200' },
  { id: 3, salesRep: 'Kristin Watson', date: '25/04/2015', territory: 'North Region', modeOfTravel: 'Bus', amount: '$200' },
  { id: 4, salesRep: 'Ronald Richards', date: '20/04/2015', territory: 'North Region', modeOfTravel: 'Bus', amount: '$200' },
  { id: 5, salesRep: 'Annette Black', date: '28/04/2015', territory: 'North Region', modeOfTravel: 'Bus', amount: '$200' },
  { id: 6, salesRep: 'Jerome Lane', date: '28/04/2015', territory: 'North Region', modeOfTravel: 'Bus', amount: '$200' },
  { id: 7, salesRep: 'Jerome McCoy', date: '28/04/2015', territory: 'North Region', modeOfTravel: 'Bus', amount: '$200' },
];

const data = [
  { month: "JAN", travel: 35, meals: 0 },
  { month: "FEB", travel: 0, meals: 20 },
  { month: "MAR", travel: 0, meals: 0 },
  { month: "APR", travel: 0, meals: 0 },
  { month: "MAY", travel: 0, meals: 0 },
  { month: "JUN", travel: 0, meals: 0 },
  { month: "JUL", travel: 0, meals: 0 },
  { month: "AUG", travel: 0, meals: 0 },
  { month: "SEP", travel: 0, meals: 0 },
  { month: "OCT", travel: 0, meals: 0 },
  { month: "NOV", travel: 0, meals: 0 },
  { month: "DEC", travel: 0, meals: 0 },
];

// Memoize quickStats to prevent re-creation
const quickStats = [
  { label: 'Active Reps (Today)', value: 'Kristin Watson', icon: Users },
  { label: 'Total Distance (Today)', value: 'Wanda Warren', icon: MapPin },
  { label: 'Average Visit Duration', value: 'Dianne Russell', icon: Clock },
  { label: 'Floyd Miles', value: 'Albert Flores', icon: Car },
  { label: 'Eleanor Pena', value: 'Courtney Henry', icon: Award },
  { label: 'Jerome Bell', value: 'Jerome Bell', icon: Filter },
];

export default function FieldActivityReports() {
  // Define filters interface following the same pattern as all-reports.tsx
  interface Filters {
    dateRange?: DateRange;
    salesRep: string;
    territory: string;
    modeOfTravel: string;
    reportType: string;
  }

  // Initialize filters state following the same pattern
  const [filters, setFilters] = useState<Filters>({
    dateRange: undefined,
    salesRep: "",
    territory: "",
    modeOfTravel: "",
    reportType: "",
  });

  // Pagination state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Memoize columns to prevent re-creation on every render
  const columns: ColumnDef<FieldActivityData>[] = useMemo(() => [
    {
      accessorKey: 'salesRep',
      header: 'Sales Rep',
      cell: ({ row }) => {
        const salesRep = row.getValue('salesRep') as string;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {salesRep.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <span className="font-medium">{salesRep}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'territory',
      header: 'Territory',
    },
    {
      accessorKey: 'modeOfTravel',
      header: 'Mode of Travel',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = row.getValue('amount') as string;
        return (
          <span className="font-semibold text-green-600">{amount}</span>
        );
      },
    },
  ], []);

  // API hooks
  const { salesReps, loading: salesRepsLoading } = useSalesReps();
  const { territories, loading: territoriesLoading } = useTerritories();
  const { generateReport, generating } = useReportGeneration();

  // Get static options - memoized to prevent re-creation on every render
  const reportTypeOptions = useMemo(() => reportsAPI.getReportTypeOptions(), []);
  const modeOfTravelOptions = useMemo(() => reportsAPI.getModeOfTravelOptions(), []);

  // Convert filters to API format - memoized to prevent infinite re-renders
  const apiFilters: ReportFilter = useMemo(() => ({
    dateRange: filters.dateRange ? {
      from: filters.dateRange.from!,
      to: filters.dateRange.to!
    } : undefined,
    salesRep: filters.salesRep || undefined,
    territory: filters.territory || undefined,
  }), [filters.dateRange?.from, filters.dateRange?.to, filters.salesRep, filters.territory]);

  const { reports: fieldActivityReports, loading: reportsLoading } = useFieldActivityReports(apiFilters);

  // Use real data if available, fallback to mock data - memoized to prevent infinite re-renders
  const tableData = useMemo(() => {
    if (fieldActivityReports.length > 0) {
      return fieldActivityReports.map(report => ({
        id: report.id,
        salesRep: report.salesRep,
        date: report.date,
        territory: report.territory,
        modeOfTravel: report.mode,
        amount: `$${report.amount}`
      }));
    }
    return mockData;
  }, [fieldActivityReports]);

  const table = useReactTable<FieldActivityData>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      rowSelection,
      pagination,
    },
  });

  // Filter change handler following the same pattern as all-reports.tsx
  const handleFilterChange = useCallback((updated: Partial<Filters>) => {
    const newFilters = { ...filters, ...updated };
    setFilters(newFilters);
  }, [filters]);

  const handleReset = useCallback(() => {
    setFilters({
      dateRange: undefined,
      salesRep: "",
      territory: "",
      modeOfTravel: "",
      reportType: "",
    });
  }, []);

  const handleApply = useCallback(async () => {
    const result = await generateReport('field-activity-report', apiFilters);
    if (result.success) {
      console.log('Field activity report generated:', result.reportId);
    }
  }, [generateReport, apiFilters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Field Activity Reports</h1>
        <p className="text-sm text-gray-500">Track and analyze field activities and travel expenses</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Configure your field activity report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={filters.reportType} onValueChange={(value) => handleFilterChange({ reportType: value })}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Travel Distance Report" />
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

            <div className="space-y-2">
              <Label htmlFor="territory">Select Territory</Label>
              <Select value={filters.territory} onValueChange={(value) => handleFilterChange({ territory: value })}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder={territoriesLoading ? "Loading..." : "Select Territory"} />
                </SelectTrigger>
                <SelectContent>
                  {territories.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode-of-travel">Mode of Travel</Label>
              <Select value={filters.modeOfTravel} onValueChange={(value) => handleFilterChange({ modeOfTravel: value })}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Mode of Travel" />
                </SelectTrigger>
                <SelectContent>
                  {modeOfTravelOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Travel Distance Report Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Travel Distance Report</CardTitle>
            <CardDescription>Detailed breakdown of field activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {reportsLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading field activity reports...</span>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-2 py-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-700">
                    Total: {table.getFilteredRowModel().rows.length} records
                  </p>
                </div>
                
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) => {
                        table.setPageSize(Number(value));
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to first page</span>
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to last page</span>
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Chart */}
        <Card className="p-4 rounded-xl">
      <h3 className="text-sm font-semibold  pb-2 mb-4 border-b">Analytics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: -20, right: 20, left: 0, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={{ stroke: "#ccc" }}
            style={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            tickLine={false}
            axisLine={{ stroke: "#ccc" }}
            style={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => `${value}%`}
            labelStyle={{ fontSize: 12 }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar
            dataKey="travel"
            fill="#8E94FF"
            name="Travel expanse"
            radius={[4, 4, 0, 0]}
            barSize={18}
          />
          <Bar
            dataKey="meals"
            fill="#16B816"
            name="Meals"
            radius={[4, 4, 0, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Field activity metrics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Reps (Today)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Distance (Today)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Visit Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quickStats[0]?.value || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quickStats[1]?.value || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quickStats[2]?.value || 'N/A'}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quickStats[3]?.value || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quickStats[4]?.value || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quickStats[5]?.value || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}