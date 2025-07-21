import API from "@/config/api/api"
import useFetchData from "@/hooks/use-fetch-data"
import usePatchData from "@/hooks/use-patch-data"

export const useGetAllWorkingDays = () => {
  return useFetchData({ url: `${API.merchants.getWorkingHours}` })
}


export const useUpdateWorkingDays = (payload: { id: string, onSuccess: () => void }) => {
  const { id, onSuccess } = payload
  return usePatchData({ url: `${API.merchants.updateWorkingHours}/${id}`, refetchQueries: [API.merchants.getWorkingHours], onSuccess: () => onSuccess() })
}
