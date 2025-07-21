import API from "@/config/api/api"
import { IListParams } from "@/features/merchants/services/merchants.hook"
import useDeleteData from "@/hooks/use-delete-data"
import useFetchData from "@/hooks/use-fetch-data"
import usePatchData from "@/hooks/use-patch-data"
import usePostData from "@/hooks/use-post-data"
import { useUsersStore } from "../store/user.store"
import { UserResponse } from "../types"


const GET_QUERY = API.drivers.list

export const useGetDrivers = (params: IListParams) => {
    const query = useFetchData<UserResponse>({ url: GET_QUERY, params })
    return {
        ...query,
        data: query.data,
        listData: query.data?.docs ?? [],
        totalCount: query.data?.count ?? 0,
        isLoading: query.isLoading,
        error: query.error
    }
}



export const useCreateDriver = () => {
    const { setOpen, setCurrentRow } = useUsersStore()
    return usePostData({
        url: API.drivers.create, refetchQueries: [GET_QUERY], onSuccess: () => {
            setOpen(null)
            setCurrentRow(null)
        }
    })
}

export const useUpdateDriver = (id: string) => {
    const { setOpen, setCurrentRow } = useUsersStore()
    return usePatchData({
        url: `${API.drivers.update}/${id}`, refetchQueries: [GET_QUERY], onSuccess: () => {
            setOpen(null)
            setCurrentRow(null)
        }
    })
}

export const useDeleteDriver = (id: string) => {
    const { setOpen, setCurrentRow } = useUsersStore()
    return useDeleteData({
        url: `${API.drivers.delete}/${id}`, refetchQueries: [GET_QUERY], onSuccess: () => {
            setOpen(null)
            setCurrentRow(null)
        }
    })
}

export const useGetDriverDetails = (id: string) => {
    return useFetchData({ url: `${API.drivers.details}/${id}` })
}