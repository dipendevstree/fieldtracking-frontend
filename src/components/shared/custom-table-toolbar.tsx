import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useState, useEffect } from 'react'

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
  /** External search value for controlled search */
  externalSearchValue?: string
  /** Callback for external search changes */
  onExternalSearchChange?: (value: string) => void
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
  externalSearchValue,
  onExternalSearchChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  // const filteredRowCount = table.getFilteredRowModel().rows.length
  
  const [searchValue, setSearchValue] = useState(externalSearchValue || '')

  // Update local search value when external value changes
  useEffect(() => {
    if (externalSearchValue !== undefined) {
      setSearchValue(externalSearchValue)
    }
  }, [externalSearchValue])

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)
    
    // Update table filter
    table.getColumn(searchColumn)?.setFilterValue(value)
    
    // Notify external handler if provided
    if (onExternalSearchChange) {
      onExternalSearchChange(value)
    }
  }

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex flex-1 items-center space-x-2'>
        {SearchFilter && (
          <Input
            placeholder={searchPlaceholder || `Filter ${entityLabel}...`}
            value={searchValue}
            onChange={handleSearchChange}
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
            onClick={() => {
              table.resetColumnFilters()
              setSearchValue('')
              if (onExternalSearchChange) {
                onExternalSearchChange('')
              }
            }}
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
