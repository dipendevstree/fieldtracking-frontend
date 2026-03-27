import useFetchData from "@/hooks/use-fetch-data";

export const useGetPlanDetails = (
  orgId: string | undefined,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<any>({
    url: orgId ? `plan/details/${orgId}` : "",
    enabled: options?.enabled ?? !!orgId,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
