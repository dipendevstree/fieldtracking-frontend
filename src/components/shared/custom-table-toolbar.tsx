import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  totalCount?: number
  /** Custom label for the entity being displayed */
  entityLabel?: string
  /** Placeholder text for the search input */
  searchPlaceholder?: string
  /** Column name to search against */
  searchColumn?: string
  /** Whether to show the count display */
  showCount?: boolean
  /** Custom count display text */
  countLabel?: string
  /** Additional filter options */
  statusOptions?: Array<{ label: string; value: string }>
  /** Custom class for the toolbar */
  className?: string
  SearchFilter?: boolean
}
export function DataTableToolbarCompact<TData>({
  table,
  // totalCount,
  entityLabel = 'items',
  searchPlaceholder,
  searchColumn = 'username',
  SearchFilter = false,
  // statusOptions = [
  //     { label: 'Active', value: 'active' },
  //     { label: 'Inactive', value: 'inactive' },
  //     { label: 'Invited', value: 'invited' },
  //     { label: 'Suspended', value: 'suspended' },
  // ],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  // const filteredRowCount = table.getFilteredRowModel().rows.length

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex flex-1 items-center space-x-2'>
        {SearchFilter && (
          <Input
            placeholder={searchPlaceholder || `Filter ${entityLabel}...`}
            // value={
            //     (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''
            // }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[350px]'
          />
        )}

        {/* {table.getColumn('status') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('status')}
                        title='Status'
                        options={statusOptions}
                    />
                )} */}

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
