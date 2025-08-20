import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronsRight, ChevronLeft, ChevronRight, Loader2, ChevronsLeft } from 'lucide-react';
import { useSalesReps, useIndustries, useCustomerReports, useReportGeneration } from '../hooks/use-reports-api';
import { reportsAPI, type ReportFilter } from '../services/reports-api';

// Types for the data
interface DirectoryData {
  id: number;
  name: string;
  totalCustomers: number;
  newCustomers: number;
  topIndustries: string;
  status: string;
  timeTracking: string;
}

interface ActivityData {
  customerDirectory: string;
  visitFrequency: string;
  territoryWise: string;
}

// Sample data
const directoryData: DirectoryData[] = [
  {
    id: 1,
    name: "Monthly Expense Summary - January 2024",
    totalCustomers: 0,
    newCustomers: 0,
    topIndustries: "60%",
    status: "Pending",
    timeTracking: "50%"
  },
  {
    id: 2,
    name: "new_prospects_jan.csv",
    totalCustomers: 3,
    newCustomers: 3,
    topIndustries: "80%",
    status: "Pending",
    timeTracking: "80%"
  },
  {
    id: 3,
    name: "new_prospects_jan.csv",
    totalCustomers: 2,
    newCustomers: 2,
    topIndustries: "80%",
    status: "Complete",
    timeTracking: "80%"
  },
  {
    id: 4,
    name: "new_prospects_jan.csv",
    totalCustomers: 1,
    newCustomers: 1,
    topIndustries: "80%",
    status: "Pending",
    timeTracking: "80%"
  },
  {
    id: 5,
    name: "new_prospects_jan.csv",
    totalCustomers: 8,
    newCustomers: 8,
    topIndustries: "80%",
    status: "Complete",
    timeTracking: "80%"
  },
  {
    id: 6,
    name: "new_prospects_jan.csv",
    totalCustomers: 4,
    newCustomers: 4,
    topIndustries: "80%",
    status: "Pending",
    timeTracking: "80%"
  },
  {
    id: 7,
    name: "new_prospects_jan.csv",
    totalCustomers: 2,
    newCustomers: 2,
    topIndustries: "80%",
    status: "Complete",
    timeTracking: "80%"
  }
];

const activityData: ActivityData[] = [
  {
    customerDirectory: "Kristin Watson",
    visitFrequency: "Wade Warren",
    territoryWise: "Gianna Russell"
  },
  {
    customerDirectory: "Floyd Miles",
    visitFrequency: "Albert Flores",
    territoryWise: "Ronald Richards"
  },
  {
    customerDirectory: "Eleanor Pena",
    visitFrequency: "Courtney Henry",
    territoryWise: "Jerome Bell"
  }
];

// Define filters interface at component level
interface Filters {
  reportType: string;
  customerStatus: string;
  salesRep: string;
  industry: string;
}

export default function CustomerReports() {
  // Initialize filters state
  const [filters, setFilters] = useState<Filters>({
    reportType: "",
    customerStatus: "",
    salesRep: "",
    industry: "",
  });

  // Add pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // API hooks
  const { salesReps = [], loading: salesRepsLoading, error: salesRepsError } = useSalesReps();
  const { industries = [], loading: industriesLoading, error: industriesError } = useIndustries();
  const { generateReport, generating, error: generationError } = useReportGeneration();

  // Get static options
  const customerStatusOptions = reportsAPI.getCustomerStatusOptions();
  const reportTypeOptions = reportsAPI.getReportTypeOptions();

  // Convert filters to API format - memoized to prevent infinite re-renders
  const apiFilters: ReportFilter = useMemo(() => ({
    salesRep: filters.salesRep || undefined,
    industry: filters.industry || undefined,
    status: filters.customerStatus || undefined,
  }), [filters.salesRep, filters.industry, filters.customerStatus]);

  const { reports: customerReports = [], loading: reportsLoading, error: reportsError, refetch } = useCustomerReports(apiFilters);

  // Directory table columns
  const directoryColumns = useMemo<ColumnDef<DirectoryData>[]>(() => [
    {
      accessorKey: 'name',
      header: () => <span className="font-medium text-gray-600">Report Name</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'totalCustomers',
      header: () => <span className="font-medium text-gray-600">Total Customers</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('totalCustomers')}</span>,
    },
    {
      accessorKey: 'newCustomers',
      header: () => <span className="font-medium text-gray-600">New Customers</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('newCustomers')}</span>,
    },
    {
      accessorKey: 'topIndustries',
      header: () => <span className="font-medium text-gray-600">Top Industries</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('topIndustries')}</span>,
    },
    {
      accessorKey: 'status',
      header: () => <span className="font-medium text-gray-600">Status</span>,
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge 
            variant={status === 'Complete' ? 'default' : 'destructive'}
            className={status === 'Complete' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'timeTracking',
      header: () => <span className="font-medium text-gray-600">Time Tracking Report</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('timeTracking')}</span>,
    },
  ], []);

  // Activity table columns
  const activityColumns = useMemo<ColumnDef<ActivityData>[]>(() => [
    {
      accessorKey: 'customerDirectory',
      header: () => <span className="font-medium text-gray-600">Customer Directory</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('customerDirectory')}</span>,
    },
    {
      accessorKey: 'visitFrequency',
      header: () => <span className="font-medium text-gray-600">Visit Frequency Analysis</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('visitFrequency')}</span>,
    },
    {
      accessorKey: 'territoryWise',
      header: () => <span className="font-medium text-gray-600">Territory-wise Customers Report</span>,
      cell: ({ row }) => <span className="text-sm">{row.getValue('territoryWise')}</span>,
    },
  ], []);

  // Memoize the table data to prevent unnecessary re-renders
  const tableData = useMemo(() => {
    return customerReports.length > 0 ? customerReports.map(report => ({
      id: report.id,
      name: report.name,
      totalCustomers: report.totalCustomers,
      newCustomers: report.newCustomers,
      topIndustries: report.topIndustries,
      status: report.status,
      timeTracking: report.timeTracking,
    })) : directoryData;
  }, [customerReports]);

  const directoryTable = useReactTable<DirectoryData>({
    data: tableData,
    columns: directoryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    manualPagination: false,
    pageCount: Math.ceil(tableData.length / pagination.pageSize),
  });

  const activityTable = useReactTable<ActivityData>({
    data: activityData,
    columns: activityColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Filter change handler
  const handleFilterChange = (updated: Partial<Filters>) => {
    const newFilters = { ...filters, ...updated };
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      reportType: "",
      customerStatus: "",
      salesRep: "",
      industry: "",
    });
  };

  const handleApply = async () => {
    try {
      const result = await generateReport('customer-report', apiFilters);
      if (result.success) {
        console.log('Customer report generated:', result.reportId);
        await refetch(apiFilters);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Reports</h1>
        <p className="text-sm text-gray-500">Generate reports on field activities and location tracking</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Configure your customer report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="space-y-2">
              <Label htmlFor="customer-status">Customer Status</Label>
              <Select value={filters.customerStatus} onValueChange={(value) => handleFilterChange({ customerStatus: value })}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Customer Status" />
                </SelectTrigger>
                <SelectContent>
                  {customerStatusOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sales-rep">Sales Rep</Label>
              <Select value={filters.salesRep} onValueChange={(value) => handleFilterChange({ salesRep: value })}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder={salesRepsLoading ? "Loading..." : "Select Sales Rep"} />
                </SelectTrigger>
                <SelectContent>
                  {salesRepsError ? (
                    <SelectItem value="" disabled>
                      Error loading sales reps
                    </SelectItem>
                  ) : (
                    salesReps.map(rep => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {salesRepsError && (
                <p className="text-xs text-red-500">Failed to load sales representatives</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={filters.industry} onValueChange={(value) => handleFilterChange({ industry: value })}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder={industriesLoading ? "Loading..." : "Select Industry"} />
                </SelectTrigger>
                <SelectContent>
                  {industriesError ? (
                    <SelectItem value="" disabled>
                      Error loading industries
                    </SelectItem>
                  ) : (
                    industries.map(ind => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {industriesError && (
                <p className="text-xs text-red-500">Failed to load industries</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
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
          {generationError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{generationError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Directory Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Directory Reports</CardTitle>
          <CardDescription>Export from 1 May to 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {reportsLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading customer reports...</span>
              </div>
            ) : reportsError ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-red-600 mb-2">Error loading reports</p>
                  <p className="text-sm text-gray-500">{reportsError}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => refetch(apiFilters)}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    {directoryTable.getHeaderGroups().map((headerGroup) => (
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
                    {directoryTable.getRowModel().rows.map((row) => (
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
                
                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-700">
                      Total: {directoryTable.getFilteredRowModel().rows.length} records
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">Rows per page</p>
                      <Select
                        value={`${directoryTable.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                          directoryTable.setPageSize(Number(value));
                        }}
                      >
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={directoryTable.getState().pagination.pageSize} />
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
                      Page {directoryTable.getState().pagination.pageIndex + 1} of{' '}
                      {directoryTable.getPageCount()}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => directoryTable.setPageIndex(0)}
                        disabled={!directoryTable.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => directoryTable.previousPage()}
                        disabled={!directoryTable.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" /> 
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => directoryTable.nextPage()}
                        disabled={!directoryTable.getCanNextPage()}
                      >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => directoryTable.setPageIndex(directoryTable.getPageCount() - 1)}
                        disabled={!directoryTable.getCanNextPage()}
                      >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Field Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Field Activity Stats</CardTitle>
          <CardDescription>Expense report from 1 May to 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {activityTable.getHeaderGroups().map((headerGroup) => (
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
                {activityTable.getRowModel().rows.map((row) => (
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