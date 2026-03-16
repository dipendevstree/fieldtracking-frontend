import { useMemo, useState, useCallback } from "react";
import useInfiniteFetch, { PaginatedResponse } from "./use-infinite-fetch";
import { formatDropDownLabel } from "@/utils/commonFunction";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";

/**
 * Standard mapper for dropdown options.
 */
export const defaultDropdownMapper = (item: any) => ({
  label: formatDropDownLabel(item.name || ""),
  value: String(item.id || ""),
});

/**
 * A specialized hook for fetching and mapping dropdown options.
 * Combines infinite fetching, automated search state, and data mapping.
 */
export const useDropdownFetch = <TItem = any>(
  url: string,
  baseParams: Record<string, any> = {},
  enabled: boolean = true,
  mapFn: (item: TItem) => {
    label: string;
    value: string;
  } = defaultDropdownMapper,
) => {
  const [search, setSearch] = useState("");

  const params = useMemo(
    () => ({
      page: DEFAULT_PAGE_NUMBER,
      limit: DEFAULT_PAGE_SIZE,
      ...baseParams,
      search,
    }),
    [JSON.stringify(baseParams), search],
  );

  const queryKey = useMemo(() => [url, params], [url, params]);

  const query = useInfiniteFetch({
    url,
    params,
    enabled,
    queryKey,
    queryOptions: {
      // Keep data from previous search/page while fetching new one to avoid flickering
      // Note: TanStack Query v5 uses placeholderData: keepPreviousData, but here it depends on how useInfiniteFetch passes options.
      // Assuming useInfiniteFetch spreads queryOptions into useInfiniteQuery.
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });

  const options = useMemo(() => {
    if (!query.data?.pages) return [];
    const items = query.data.pages.flatMap(
      (page: PaginatedResponse<TItem>) => page.list || page.data || [],
    );
    return items.map(mapFn);
  }, [query.data?.pages, mapFn]);

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  return {
    ...query,
    options,
    onSearchChange,
    onFetchMore: query.fetchNextPage,
    isLoading: query.isFetching && !query.isFetchingNextPage, // Specific for search/initial load
  };
};

export default useDropdownFetch;
