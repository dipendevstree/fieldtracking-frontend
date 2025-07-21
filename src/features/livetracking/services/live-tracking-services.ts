import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'

export const useGetUserTrackingByUserId = (userId: string) => {
  console.log('useGetUserByToken called with token:', userId)
  const query = useFetchData<any>({
    url: API.liveTracking.list,
    params: { userId },
  })
  return {
    data: query.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    // ...query,
    refetch: query.refetch,
    isFetched: query.isFetched,
  }
}
