import { useEffect, useState } from "react";
import { Select } from "./shared/custom-select";
import { SimpleDatePicker } from "./ui/datepicker";
import { Input } from "./ui/input";
import { useDebounce } from "./use-debauce";
import { SearchableSelect } from "./ui/SearchableSelect";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "@/features/reports/components/DateRangeFilter";

type FilterType =
  | "select"
  | "search"
  | "date"
  | "searchable-select"
  | "date-range";

export interface FilterConfig {
  type: FilterType;
  key: string;
  placeholder?: string;
  value?: string;
  options?: Option[];
  onChange?: (value: string | undefined) => void;
  onCancelPress?: () => void;
  dateRangeValue?: DateRange;
  onDateRangeChange?: (value: DateRange | undefined) => void;
  dataRangeClassName?: string;
  searchableSelectClassName?: string;
}

interface DataTableToolbarProps {
  filters?: FilterConfig[];
  className?: string;
  searchValue?: string;
  onCancelPress?: () => void;
}

export interface Option {
  label: string;
  value: string;
}

export function DataTableToolbarCompact({
  filters = [],
  className = "",
}: Readonly<DataTableToolbarProps>) {
  const searchFilter = filters.find((f) => f.type === "search");
  const [search, setSearch] = useState(searchFilter?.value ?? "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (searchFilter?.onChange) {
      searchFilter.onChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-1 items-center flex-wrap gap-4">
        {filters.map((filter) => {
          if (filter.type === "search") {
            return (
              <Input
                key={filter.key}
                type="search"
                placeholder={filter.placeholder ?? "Search..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[150px] lg:w-[350px]"
              />
            );
          }

          if (filter.type === "select") {
            return (
              <Select
                key={filter.key}
                options={filter.options ?? []}
                value={filter.value}
                placeholder={filter.placeholder}
                onValueChange={filter.onChange ?? (() => {})}
                onCancelPress={filter.onCancelPress}
              />
            );
          }

          if (filter.type === "searchable-select") {
            return (
              <div
                className={`${filter.searchableSelectClassName ?? "w-full max-w-md"}`}
              >
                <SearchableSelect
                  key={filter.key}
                  options={filter.options ?? []}
                  value={filter.value}
                  placeholder={filter.placeholder}
                  onChange={filter.onChange ?? (() => {})}
                  disabled={false}
                  onCancelPress={filter.onCancelPress}
                />
              </div>
            );
          }

          if (filter.type === "date") {
            return (
              <SimpleDatePicker
                key={filter.key}
                date={filter.value ?? ""}
                setDate={filter.onChange ?? (() => {})}
              />
            );
          }

          if (filter.type === "date-range") {
            return (
              <div
                key={filter.key}
                className={`${filter.dataRangeClassName ?? "w-full max-w-md"}`}
              >
                <DateRangeFilter
                  key={filter.key}
                  dateRange={filter.dateRangeValue}
                  setDateRange={filter.onDateRangeChange ?? (() => {})}
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
