import { DataTableToolbarCompact, FilterConfig } from "./global-filter-section";
import { Card } from "./ui/card";

const GlobalFilterSection = ({
  filters,
  onCancelPress,
  className = "mb-4",
}: {
  filters: FilterConfig[];
  onCancelPress?: any;
  className?: any;
}) => {
  return (
    <Card className={`${className} flex justify-between p-4`}>
      <DataTableToolbarCompact
        filters={filters}
        onCancelPress={onCancelPress}
      />
    </Card>
  );
};

export default GlobalFilterSection;
