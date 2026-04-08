import { useMemo } from "react";

const EMPTY_ARRAY: any[] = [];

interface UseSelectOptionsProps<T> {
  listData?: T[];
  labelKey: keyof T;
  valueKey: keyof T;
}

interface SelectOption {
  label: string;
  value: string | number;
}

export function useSelectOptions<T>({
  listData,
  labelKey,
  valueKey,
}: UseSelectOptionsProps<T>): SelectOption[] {
  const dataToMap = listData || EMPTY_ARRAY;
  const options = useMemo(() => {
    return dataToMap.map((item) => ({
      label: String(item[labelKey]),
      value:
        typeof item[valueKey] === "number" || typeof item[valueKey] === "string"
          ? (item[valueKey] as string | number)
          : String(item[valueKey]),
    }));
  }, [dataToMap, labelKey, valueKey]);

  return options;
}
