import { useEffect, useState } from 'react'
import { Select } from './shared/custom-select'
import { SimpleDatePicker } from './ui/datepicker'
import { Input } from './ui/input'
import { useDebounce } from './use-debauce'

type FilterType = 'select' | 'search' | 'date'

export interface FilterConfig {
  type: FilterType
  key: string
  placeholder?: string
  value?: string
  options?: Option[]
  onChange?: (value: string | undefined) => void
  onCancelPress?: any
}

interface DataTableToolbarProps {
  filters?: FilterConfig[]
  className?: string
  searchValue?: string
}

export interface Option {
  label: string
  value: string
}

interface DataTableToolbarProps {
  filters?: FilterConfig[]
  className?: string
  onCancelPress?: any
}

export function DataTableToolbarCompact({
  filters = [],
  className = '',
  onCancelPress,
}: Readonly<DataTableToolbarProps>) {
  const searchFilter = filters.find((f) => f.type === 'search')
  const [search, setSearch] = useState(searchFilter?.value ?? '')
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (searchFilter?.onChange) {
      searchFilter.onChange(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className='flex flex-1 items-center space-x-2'>
        {filters.map((filter) => {
          if (filter.type === 'search') {
            return (
              <Input
                key={filter.key}
                type='search'
                placeholder={filter.placeholder ?? 'Search...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-[150px] lg:w-[350px]'
              />
            )
          }

          if (filter.type === 'select') {
            return (
              <Select
                key={filter.key}
                options={filter.options ?? []}
                value={filter.value}
                placeholder={filter.placeholder}
                onValueChange={filter.onChange ?? (() => {})}
                onCancelPress={onCancelPress}
              />
            )
          }
          if (filter.type === 'date') {
            return (
              <SimpleDatePicker
                key={filter.key}
                date={filter.value ?? ''}
                setDate={filter.onChange ?? (() => {})}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
