import { useMemo } from 'react'

interface UseSelectOptionsProps<T> {
  listData: T[]
  labelKey: keyof T
  valueKey: keyof T
}

interface SelectOption {
  label: string
  value: string | number
}

export function useSelectOptions<T>({
  listData,
  labelKey,
  valueKey,
}: UseSelectOptionsProps<T>): SelectOption[] {
  const options = useMemo(() => {
    return listData.map((item) => ({
      label: String(item[labelKey]),
      value:
        typeof item[valueKey] === 'number' || typeof item[valueKey] === 'string'
          ? item[valueKey]
          : String(item[valueKey]),
    }))
  }, [listData, labelKey, valueKey])

  return options
}
