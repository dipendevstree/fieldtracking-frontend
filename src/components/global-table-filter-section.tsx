import { DataTableToolbarCompact, FilterConfig } from './global-filter-section'
import { Card } from './ui/card'

const GlobalFilterSection = ({ filters }: { filters: FilterConfig[] }) => {
  return (
    <Card className='mb-4 flex justify-between p-4'>
      <DataTableToolbarCompact filters={filters} />
    </Card>
  )
}

export default GlobalFilterSection
