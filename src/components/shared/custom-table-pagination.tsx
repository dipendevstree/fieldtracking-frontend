import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { useEffect } from 'react'

export interface PaginationCallbacks {
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
    onPaginationChange?: (page: number, pageSize: number) => void
}

interface GlobalPaginationProps<TData> {
    table: Table<TData>
    // API integration callbacks
    callbacks?: PaginationCallbacks
    // Manual pagination mode (for server-side pagination)
    manualPagination?: boolean
    totalCount?: number
    currentPage?: number
    // Global pagination settings
    defaultPageSize?: number
    pageSizeOptions?: number[]
    showRowsPerPage?: boolean
    showPageInfo?: boolean
    showFirstLastButtons?: boolean
    showSelectedRowsCount?: boolean
    // Custom labels
    rowsPerPageLabel?: string
    pageLabel?: string
    selectedRowsLabel?: string
    // Size variants
    buttonSize?: 'sm' | 'md' | 'lg'
    selectWidth?: string
    // Layout options
    position?: 'left' | 'center' | 'right' | 'between'
    spacing?: 'sm' | 'md' | 'lg'
}

export function GlobalPagination<TData>({
    table,
    callbacks,
    manualPagination = true,
    totalCount,
    currentPage,
    defaultPageSize = 10,
    pageSizeOptions = [10, 20, 30, 40, 50, 100],
    showRowsPerPage = true,
    showPageInfo = true,
    showFirstLastButtons = true,
    showSelectedRowsCount = true,
    rowsPerPageLabel = "Rows per page",
    pageLabel = "Page",
    // selectedRowsLabel = "row(s) selected",
    buttonSize = 'sm',
    selectWidth = 'w-[70px]',
    position = 'between',
    spacing = 'md'
}: GlobalPaginationProps<TData>) {


    // Set default page size on component mount
    useEffect(() => {
        if (table.getState().pagination.pageSize !== defaultPageSize) {
            table.setPageSize(defaultPageSize);
            if (callbacks?.onPageSizeChange) {
                callbacks.onPageSizeChange(defaultPageSize);
            }
            if (callbacks?.onPaginationChange) {
                callbacks.onPaginationChange(currentPage || 1, defaultPageSize);
            }
        }
    }, [table, defaultPageSize, callbacks, currentPage]);

    // Handle page navigation
    const handlePageChange = (newPageIndex: number) => {
        const pageNumber = newPageIndex + 1;
        if (callbacks?.onPageChange) {
            callbacks.onPageChange(pageNumber);
        }
        if (callbacks?.onPaginationChange) {
            callbacks.onPaginationChange(pageNumber, table.getState().pagination.pageSize);
        }
        // Only update table's pageIndex for client-side pagination
        if (!manualPagination) {
            table.setPageIndex(newPageIndex);
        }
    };

    // Handle page size change
    const handlePageSizeChange = (newPageSize: number) => {
        if (callbacks?.onPageSizeChange) {
            callbacks.onPageSizeChange(newPageSize);
        }
        if (callbacks?.onPaginationChange) {
            callbacks.onPaginationChange(1, newPageSize); // Reset to page 1
        }
        // Only update table's pageSize for client-side pagination
        if (!manualPagination) {
            table.setPageSize(newPageSize);
            table.setPageIndex(0); // Reset to first page
        }
    };

    // Calculate pagination values
    const pageSize = table.getState().pagination.pageSize;
    const pageIndex = manualPagination ? (currentPage ? currentPage - 1 : 0) : table.getState().pagination.pageIndex;
    const totalRows = manualPagination ? (totalCount ?? 0) : table.getFilteredRowModel().rows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize)); // Ensure at least 1 page
    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < totalPages - 1;

    // Button size classes
    const buttonSizeClasses = {
        sm: 'h-8 w-8 p-0',
        md: 'h-9 w-9 p-0',
        lg: 'h-10 w-10 p-0'
    };

    // Spacing classes
    const spacingClasses = {
        sm: 'space-x-2',
        md: 'space-x-4',
        lg: 'space-x-6'
    };

    // Position classes
    const positionClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between'
    };

    return (
        <div className={`flex items-center overflow-clip px-2 ${positionClasses[position]}`}>
            {showSelectedRowsCount && manualPagination && totalCount && (
                <div className='text-muted-foreground hidden flex-1 text-sm sm:block'>
                    Total: {totalCount} records
                </div>
            )}

            <div className={`flex items-center ${spacingClasses[spacing]}`}>
                {showRowsPerPage && (
                    <div className='flex items-center space-x-2'>
                        <p className='hidden text-sm font-medium sm:block'>{rowsPerPageLabel}</p>
                        <Select
                            value={`${pageSize}`}
                            onValueChange={(value) => handlePageSizeChange(Number(value))}
                        >
                            <SelectTrigger className={`h-8 ${selectWidth}`}>
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side='top'>
                                {pageSizeOptions.map((option) => (
                                    <SelectItem key={option} value={`${option}`}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {showPageInfo && (
                    <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
                        {pageLabel} {pageIndex + 1} of {totalPages}
                    </div>
                )}

                <div className='flex items-center space-x-2'>
                    {showFirstLastButtons && (
                        <Button
                            variant='outline'
                            className={`hidden lg:flex ${buttonSizeClasses[buttonSize]}`}
                            onClick={() => handlePageChange(0)}
                            disabled={!canPreviousPage}
                        >
                            <span className='sr-only'>Go to first page</span>
                            <DoubleArrowLeftIcon className='h-4 w-4' />
                        </Button>
                    )}

                    <Button
                        variant='outline'
                        className={buttonSizeClasses[buttonSize]}
                        onClick={() => handlePageChange(pageIndex - 1)}
                        disabled={!canPreviousPage}
                    >
                        <span className='sr-only'>Go to previous page</span>
                        <ChevronLeftIcon className='h-4 w-4' />
                    </Button>

                    <Button
                        variant='outline'
                        className={buttonSizeClasses[buttonSize]}
                        onClick={() => handlePageChange(pageIndex + 1)}
                        disabled={!canNextPage}
                    >
                        <span className='sr-only'>Go to next page</span>
                        <ChevronRightIcon className='h-4 w-4' />
                    </Button>

                    {showFirstLastButtons && (
                        <Button
                            variant='outline'
                            className={`hidden lg:flex ${buttonSizeClasses[buttonSize]}`}
                            onClick={() => handlePageChange(totalPages - 1)}
                            disabled={!canNextPage}
                        >
                            <span className='sr-only'>Go to last page</span>
                            <DoubleArrowRightIcon className='h-4 w-4' />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}