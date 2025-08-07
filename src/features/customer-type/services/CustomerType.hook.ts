import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'
import usePostData from '@/hooks/use-post-data'
import useDeleteData from '@/hooks/use-delete-data'
import usePatchData from '@/hooks/use-patch-data'
import { CustomerType } from '../type/type'

const CUSTOMER_TYPE_QUERY = API.customerType.list

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

export interface CustomerTypePayload {
  typeName: string
}

export interface CustomerTypeResponse {
  data: CustomerType
  message: string
  statusCode: number
}

export const useCreateCustomerType = (onSuccess?: () => void) => {
  return usePostData<CustomerTypeResponse, CustomerTypePayload>({
    url: API.customerType.create,
    refetchQueries: [CUSTOMER_TYPE_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateCustomerType = (id: string, onSuccess?: () => void) => {
  return usePatchData<CustomerTypeResponse, CustomerTypePayload>({
    url: `${API.customerType.update}/${id}`,
    refetchQueries: [CUSTOMER_TYPE_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export interface CustomerTypeListResponse {
  list: CustomerType[]
  totalCount: number
}

export const useGetAllCustomerType = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<CustomerTypeListResponse>({
    url: CUSTOMER_TYPE_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    data: query.data?.list,
    allCustomerType: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export const useDeleteCustomerType = (id: string, onSuccess?: () => void) => {
  // Use a dummy hook for empty ID that maintains the same return shape
  const deleteHook = useDeleteData({
    url: id ? `${API.customerType.delete}/${id}` : API.customerType.delete,
    refetchQueries: [CUSTOMER_TYPE_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
  
  // If ID is empty, override the mutate function to do nothing
  if (!id) {
    return {
      ...deleteHook,
      mutate: () => {
        // Do nothing if ID is missing
      },
    }
  }
  
  return deleteHook
}
