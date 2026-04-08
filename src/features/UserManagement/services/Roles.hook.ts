import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";

const USEROLES_QUERY = API.roles.list;
const getRolePermissionQueryKey = (roleId: string) =>
  `${API.roles.getAllPermissions}/${roleId}`;

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  [key: string]: unknown;
}

export const useCreateRole = (onSuccess?: () => void) => {
  return usePostData({
    url: API.roles.create, // Fixed: Use roles.create instead of users.create
    refetchQueries: [USEROLES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateRole = (roleId: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.roles.update}/${roleId}`, // Fixed: Use roles.update endpoint
    refetchQueries: [USEROLES_QUERY, getRolePermissionQueryKey(roleId)],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllRoles = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: USEROLES_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    allRoles: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetAllRolesForDropdown = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: USEROLES_QUERY,
    enabled: options?.enabled ?? true,
  });
  return {
    ...query,
    data: query.data?.list,
    allRoles: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetRolesAndPermissionById = (
  roleId?: string,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: getRolePermissionQueryKey(roleId!),
    enabled: (options?.enabled ?? true) && !!roleId,
  });
  return {
    ...query,
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    isFetched: query.isFetched,
  };
};

export const useGetPermission = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: API.roles.permissions,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.data,
    rolePermission: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useOrganizationMenulist = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: API.roles.organizationMenulist,
    params: { sort: "asc" },
    enabled: options?.enabled ?? true,
  });

  const responseData = query.data;
  return {
    ...query,
    data: responseData?.list ?? [],
    organizationMenus: responseData?.list ?? [],
    totalCount: responseData?.totalCount ?? 0,
    totalPages: responseData?.totalPages ?? 0,
    currentPage: responseData?.currentPage ?? 1,
    isLoading: query.isLoading,
    error: query.error,
  };
};
