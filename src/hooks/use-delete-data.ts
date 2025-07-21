
import instance from '@/config/instance/instance';
import { EnhancedError } from '@/types';
import { extractErrorInfo } from '@/utils/error-response';
import {
  UseMutationOptions,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeleteDataOptions<TData> {
  url: string;
  refetchQueries?: string[];
  onSuccess?: () => void;
  onError?: (error: EnhancedError) => void;
  mutationOptions?: UseMutationOptions<TData, Error, void>;
}

const useDeleteData = <TData = unknown>({
  url,
  refetchQueries = [],
  mutationOptions,
  onSuccess,
  onError

}: DeleteDataOptions<TData>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, void>({
    mutationFn: async (): Promise<TData> => {
      const response = await instance.delete({ url });

      if (response?.statusCode === 200) {
        return response.data as TData;
      }

      const errorMessage = response?.message || 'Failed to delete data';
      if (response?.statusCode === 400) {
        throw Object.assign(new Error(errorMessage), { statusCode: 400 });
      }
      if (response?.statusCode === 401) {
        throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });
      }

      throw new Error(errorMessage);
    },
    onSuccess: () => {
      refetchQueries.forEach((query) =>
        queryClient.invalidateQueries({ queryKey: [query] })
      );
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: EnhancedError) => {
      const errorInfo = extractErrorInfo(error);
      // Display user-friendly toast notification
      toast.error(errorInfo.title, {
        description: errorInfo.description,
        duration: errorInfo.duration
      });

      // Call additional error handler if provided
      if (onError) {
        onError(error);
      }
    },
    ...mutationOptions
  });

};

export default useDeleteData;