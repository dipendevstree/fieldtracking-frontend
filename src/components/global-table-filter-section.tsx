import { DataTableToolbarCompact, FilterConfig } from './global-filter-section'
import { Card } from './ui/card'

const GlobalFilterSection = ({
  filters,
  onCancelPress,
}: {
  filters: FilterConfig[]
  onCancelPress?: any
}) => {
  return (
    <Card className='mb-4 flex justify-between p-4'>
      <DataTableToolbarCompact
        filters={filters}
        onCancelPress={onCancelPress}
      />
    </Card>
  )
}

export default GlobalFilterSection
