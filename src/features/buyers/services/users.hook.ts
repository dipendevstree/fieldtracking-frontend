import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";
import { IListParams } from "@/features/merchants/services/merchants.hook";
import { useUsersStore } from "../store/user.store";

const GET_QUERY = API.users.list;

export interface IUser extends IListParams {
  searchFor?: string;
  roleId?: string | undefined;
  territoryId?: string | undefined;
  includeLatLong?: boolean;
}

export const useGetUsers = (params: IUser) => {
  const query = useFetchData<any>({
    url: GET_QUERY,
    params,
    enabled:
      params.searchFor !== "" ||
      params.roleId !== "" ||
      params.territoryId !== "",
  });

  return {
    ...query,
    data: query.data,
    listData: query.data?.list ?? [], // Changed from 'docs' to 'list'
    totalCount: query.data?.totalCount ?? 0, // Changed from 'count' to 'totalCount'
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetUsersForDropdown = ({
  roleId,
  userTerritoryID,
  userId,
  enabled = true,
}: {
  roleId?: string;
  userTerritoryID?: string;
  userId?: string;
  enabled?: boolean;
}) => {
  // Build params dynamically
  const params: Record<string, string> = {};

  if (roleId) params.roleId = roleId;
  if (userTerritoryID) params.userTerritoryID = userTerritoryID;
  if (userId) params.userId = userId;

  const query = useFetchData<any>({
    url: GET_QUERY,
    params: Object.keys(params).length > 0 ? params : undefined,
    enabled,
  });

  return {
    ...query,
    data: query.data?.list ?? [],
    allUsers: query.data?.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCreateUser = () => {
  const { setOpen, setCurrentRow } = useUsersStore();
  return usePostData({
    url: API.users.create,
    refetchQueries: [GET_QUERY],
    onSuccess: () => {
      setOpen(null);
      setCurrentRow(null);
    },
  });
};

export const useUpdateUser = (id: string) => {
  const { setOpen, setCurrentRow } = useUsersStore();
  return usePatchData({
    url: `${API.users.update}/${id}`,
    refetchQueries: [GET_QUERY],
    onSuccess: () => {
      setOpen(null);
      setCurrentRow(null);
    },
  });
};
