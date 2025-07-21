import API from "@/config/api/api"
import useFetchData from "@/hooks/use-fetch-data"
import usePatchData from "@/hooks/use-patch-data"
import usePostData from "@/hooks/use-post-data"
import { useUsersStore } from "../store/merchant.store"
import { MerchantResponse } from "../types"

const MERCHANTS_QUERY = API.merchants.list

export interface IListParams {
    page: number
    limit: number,
    search?: string
    [key: string]: unknown
}

export const useGetMerchants = (params: IListParams) => {
    const query = useFetchData<MerchantResponse>({ url: MERCHANTS_QUERY, params })
    return {
        ...query,
        data: query.data,
        merchants: query.data?.docs ?? [],
        totalCount: query.data?.count ?? 0,
        isLoading: query.isLoading,
        error: query.error
    }
}



export const useCreateMerchant = (onSuccess?: () => void) => {
    return usePostData({
        url: API.merchants.create, refetchQueries: [MERCHANTS_QUERY], onSuccess: () => {
            if (onSuccess) {
                onSuccess()
            }
        }
    })
}

export const useUpdateMerchant = (id: string) => {
    const { setOpen, setCurrentRow } = useUsersStore()
    return usePatchData({
        url: `${API.merchants.update}/${id}`, refetchQueries: [MERCHANTS_QUERY], onSuccess: () => {
            setOpen(null)
            setCurrentRow(null)
        }
    })
}
