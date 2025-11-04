import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";

export const useGetUserByToken = (token: string) => {
  console.log("useGetUserByToken called with token:", token);
  const query = useFetchData<any>({
    url: API.auth.getUserByToken,
    params: { token },
  });
  return {
    ...query,
    data: query.data,
    user: query.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
export const useGetDepartment = () => {
  const query = useFetchData<any>({ url: API.auth.getDepartment });
  return {
    ...query,
    data: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetOrganizationTypes = () => {
  const query = useFetchData<any>({ url: API.auth.organizationTypes });
  console.log("useGetOrganizationTypes called", query.data);
  return {
    ...query,
    data: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useSingUp = (onSuccess?: () => void) => {
  return usePostData({
    url: API.auth.signup,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetTerms = (type: any) => {
  const query = useFetchData<any>({
    url: `${API.termsAndConditions.getTerms}/${type}`,
    enabled: !!type,
    queryOptions: {
      placeholderData: undefined,
    },
  });

  return {
    ...query,
    data: query.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
