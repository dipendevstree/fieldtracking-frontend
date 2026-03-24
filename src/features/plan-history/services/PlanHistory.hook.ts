import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import { PlanHistory } from "../type/type";

export const useGetPlanHistory = (
  organizationId: string,
  params: { page: number; limit: number },
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<{
    list: PlanHistory[];
    totalCount: number;
  }>({
    url: `${API.plan.history}/${organizationId}`,
    params,
    enabled: !!organizationId && (options?.enabled ?? true),
  });

  return {
    ...query,
    planHistory: query.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
  };
};
