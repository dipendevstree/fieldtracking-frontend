import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'
import instance from '@/config/instance/instance'
import { EnhancedError } from '@/types'
import { toast } from 'sonner'
import { extractErrorInfo } from '@/utils/error-response'

interface ApiResponse<T = unknown> {
  error: boolean
  message: string
  statusCode: number
  messageCode: string
  data: T
}

interface UsePostDataProps<TData, TVariables> {
  url: string
  mutationOptions?: UseMutationOptions<TData, Error, TVariables>
  headers?: Record<string, string>
  refetchQueries?: string[]
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
}

const usePostData = <TData = unknown, TVariables = unknown>({
  url,
  mutationOptions,
  headers = {},
  refetchQueries,
  onSuccess,
  onError,
}: UsePostDataProps<TData, TVariables>) => {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const response = await instance.post({
        url,
        data: variables,
        headers,
      })
      // Check for success using error field and status codes
      if (
        !response?.error &&
        (response?.statusCode === 200 || response?.statusCode === 201)
      ) {
        toast(response?.message || 'Data posted successfully', {
          position: 'top-center',
          duration: 2000,
        })
        return response.data as TData // Return the data with proper typing
      }
      // Handle error cases
      if (response?.error || response?.statusCode === 400) {
        throw Object.assign(new Error(response?.message || 'Bad Request'), {
          statusCode: response?.statusCode || 400,
          messageCode: (response as ApiResponse)?.messageCode,
        })
      }

      // Handle other error status codes
      if (response?.statusCode === 401) {
        throw Object.assign(new Error(response?.message || 'Unauthorized'), {
          statusCode: 401,
          messageCode: (response as ApiResponse)?.messageCode,
        })
      }

      if (response?.statusCode >= 400) {
        throw Object.assign(new Error(response?.message || 'Request failed'), {
          statusCode: response?.statusCode,
          messageCode: (response as ApiResponse)?.messageCode,
        })
      }

      throw new Error(response?.message || 'Failed to post data')
    },
    onSuccess: (data) => {
      if (refetchQueries) {
        refetchQueries.forEach((queryKey) => {
          queryClient.refetchQueries({ queryKey: [queryKey] })
        })
      }

      if (onSuccess) {
        onSuccess(data)
      }
    },
    onError: (error: EnhancedError) => {
      const errorInfo = extractErrorInfo(error)
      // Display user-friendly toast notification
      toast.error(errorInfo.title, {
        description: errorInfo.description,
        duration: errorInfo.duration,
        position: 'top-right',
      })

      // Call additional error handler if provided
      if (onError) {
        onError(error)
      }
    },
    ...mutationOptions,
  })
}

export default usePostData
