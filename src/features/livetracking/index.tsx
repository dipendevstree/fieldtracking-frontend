import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";

import { cn } from "@/lib/utils";
import { useSelectOptions } from "@/hooks/use-select-option";
import { Card, CardContent } from "@/components/ui/card";
import { FilterConfig, Option } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { Main } from "@/components/layout/main";
import { useGetAllRolesForDropdown } from "../UserManagement/services/Roles.hook";
import { useGetAllTerritoriesForDropdown } from "../userterritory/services/user-territory.hook";
import UserTrackingTimeline from "./user-livetracting-info";
import UserPolylineMap from "./components/UserPolylineMap";
import UserListMap from "./components/UserListMap";
import {
  useGetUsers,
  userDetailsById,
} from "./services/live-tracking-services";
import { GoogleMap } from "@react-google-maps/api";
import { useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { socket, socketForVisit } from "@/socket/socket";
import { useAuthStore } from "@/stores/use-auth-store";

// Assuming you have a Button component
const AHMEDABAD_CENTER = { lat: 23.0225, lng: 72.5714 };

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "7px",
  overflow: "hidden",
};

export default function Livetracking() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    searchFor: "",
    roleId: "",
    territoryId: "",
    includeLatLong: true,
    sortField: "isOnline",
    status: "",
    onlyTeamMembers: true,
  });

  const { user: userAuth } = useAuthStore();
  const { userId }: any = useSearch({ from: "/_authenticated/livetracking/" });
  const socketForLiveTracking = useMemo(() => socket(), []);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { data, isLoading, totalCount } = useGetUsers(pagination);
  const [userStatusMap, setUserStatusMap] = useState<Record<string, boolean>>(
    {},
  );

  const [selectedUserId, setSelectedUserId] = useState(userId);
  const { data: allRoles } = useGetAllRolesForDropdown();
  const roles = useSelectOptions({
    listData: allRoles ?? [],
    labelKey: "roleName",
    valueKey: "roleId",
  });

  const { listData: userListDropDownData = [] } = useGetUsers({
    onlyTeamMembers: true,
    roleId: pagination.roleId,
  });

  const userListDropDownList = userListDropDownData?.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  const statusOptions = useSelectOptions<any>({
    listData: [
      { status: "online", label: "Online" },
      { status: "offline", label: "Offline" },
    ],
    labelKey: "label",
    valueKey: "status",
  });

  const usersOptions = useSelectOptions<any>({
    listData: userListDropDownList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const hasFiltersSelected =
    pagination.roleId ||
    pagination.territoryId ||
    pagination.searchFor ||
    pagination.status;
  const { user } = userDetailsById(userId);

  const enhanceUser = (user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    latLong: user.latLongDetails
      ? { lat: user.latLongDetails.lat, lng: user.latLongDetails.long }
      : null,
  });
  const enhancedSingleUser = user ? enhanceUser(user) : null;

  const enhancedUserList = (data?.list ?? [])
    .map(enhanceUser)
    .sort((a: any, b: any) =>
      a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1,
    );

  const { data: territoriesList } = useGetAllTerritoriesForDropdown();
  const territories = useSelectOptions<any>({
    listData: territoriesList ?? [],
    labelKey: "name",
    valueKey: "id",
  });

  const handleChangeTerritory = (value: string | undefined) => {
    setPagination((prev) => ({
      ...prev,
      territoryId: value ?? "",
      roleId: "",
      searchFor: "",
      page: DEFAULT_PAGE_NUMBER,
    }));
  };

  const handleRoleChange = (value: string | undefined) => {
    setPagination((prev) => ({
      ...prev,
      roleId: value ?? "",
      searchFor: "",
      page: DEFAULT_PAGE_NUMBER,
    }));
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("userId", userId);
    window.history.pushState({}, "", `?${newParams}`);
  };

  const handleBackToList = () => {
    if (socket) {
      socket().emit("untrack_user", { selectedUserId });
    }
    setSelectedUserId("");
    setPath([]);
    setCurrentPosition(null);
    updateMapCenterFromUserList(enhancedUserList);
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("userId");
    window.history.pushState({}, "", `?${newParams}`);
  };

  const updateMapCenterFromUserList = (userList: any[]) => {
    const validCoords = userList
      .map((item: any) => item.latLong)
      .filter(
        (coord: any) =>
          coord &&
          typeof coord.lat === "number" &&
          typeof coord.lng === "number" &&
          !isNaN(coord.lat) &&
          !isNaN(coord.lng),
      );

    const firstValidCoord = validCoords[0] || AHMEDABAD_CENTER;
    setMapCenter((prev) => {
      if (
        prev &&
        prev.lat === firstValidCoord.lat &&
        prev.lng === firstValidCoord.lng
      ) {
        return prev;
      }
      return firstValidCoord;
    });
  };

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    updateMapCenterFromUserList(enhancedUserListWithStatus);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    setSelectedUserId(userId);
  }, [userId]);

  useEffect(() => {
    return () => {
      if (socketForLiveTracking.connected) {
        socketForLiveTracking.disconnect();
      }
    };
  }, [socketForLiveTracking]);

  // const handleBackToList = () => {
  //   if (socket) {
  //     socket.emit("untrack_user", { userId });
  //   }
  //   setSelectedUserId("");
  //   setPath([]);
  //   setCurrentPosition(null);
  //   updateMapCenterFromUserList(enhancedUserList);
  //   const newParams = new URLSearchParams(window.location.search);
  //   newParams.delete("userId");
  //   window.history.pushState({}, "", `?${newParams}`);
  // };

  const handlePopState = () => {
    const params = new URLSearchParams(window.location.search);
    const userIdFromUrl = params.get("userId");

    if (!userIdFromUrl) {
      // If userId was removed (i.e. back to list view)
      if (socketForLiveTracking) {
        socketForLiveTracking.emit("untrack_user", { userId });
      }
      setSelectedUserId("");
      setPath([]);
      setCurrentPosition(null);
    } else {
      // If userId is present in URL, update selectedUserId
      setSelectedUserId(userIdFromUrl);
    }
  };

  const userterritoryFilter: FilterConfig = {
    key: "UserTerritory",
    type: "select",
    onChange: handleChangeTerritory,
    placeholder: "Select User Territory",
    value: pagination.territoryId,
    options: territories as Option[],
  };

  const filters: FilterConfig[] = [
    {
      key: "role",
      type: "select",
      onChange: handleRoleChange,
      placeholder: "Select Role",
      value: pagination.roleId,
      options: roles as Option[],
    },
    {
      type: "searchable-select",
      key: "userSelect",
      placeholder: "Select User",
      searchableSelectClassName: "w-[200px]",
      value: selectedUserId,
      options: usersOptions,
      onChange: (value) => {
        if (value) {
          handleUserClick(value);
        }
      },
    },
    {
      type: "select",
      key: "status",
      placeholder: "User Status",
      value: pagination.status,
      options: statusOptions as Option[],
      onChange: (value) => {
        if (value) {
          setPagination((prev) => ({
            ...prev,
            status: value,
          }));
        }
      },
      onCancelPress: () => {
        setPagination((prev) => ({
          ...prev,
          status: "",
        }));
      },
    },
  ];

  useEffect(() => {
    if (
      mapRef.current &&
      currentPosition &&
      typeof currentPosition.lat === "number" &&
      typeof currentPosition.lng === "number"
    ) {
      mapRef.current.panTo(currentPosition);
    }
  }, [currentPosition]);

  const handleNextPage = () => {
    if (pagination.page * pagination.limit < totalCount) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  };

  // Socket listeners
  useEffect(() => {
    const userId = userAuth?.id;
    const socketForVisitOrignal = socketForVisit(userAuth?.access_token);
    if (!socketForVisitOrignal || !userId) return;

    const handleConnect = () => {
      socketForVisitOrignal.emit("track_user", { userId });
    };

    const handleUserStatus = (event: { userId: string; online: boolean }) => {
      setUserStatusMap((prev) => ({
        ...prev,
        [event.userId]: event.online,
      }));
    };

    if (socketForVisitOrignal.connected) {
      handleConnect();
    } else {
      socketForVisitOrignal.on("connect", handleConnect);
    }

    socketForVisitOrignal.on("user_online_status", handleUserStatus);

    return () => {
      socketForVisitOrignal.off("user_online_status", handleUserStatus);
      socketForVisitOrignal.disconnect();
    };
  }, [socketForVisit]);

  const enhancedUserListWithStatus = enhancedUserList
    .map((user: any) => ({
      ...user,
      isOnline: userStatusMap[user.id] ?? user.isOnline,
    }))
    .sort((a: any, b: any) =>
      a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1,
    );

  const selectedUser = enhancedUserListWithStatus.find(
    (u: any) => u.id === selectedUserId,
  );

  return (
    <Main className={cn("flex flex-col p-4")}>
      <GlobalFilterSection
        key="calendar-view-filters"
        filters={
          userAuth?.organization?.allowAddUsersBasedOnTerritories
            ? [userterritoryFilter, ...filters]
            : filters
        }
        onCancelPress={() => {
          setSelectedUserId("");
          setPagination({
            page: DEFAULT_PAGE_NUMBER,
            limit: 15,
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
            searchFor: "",
            roleId: "",
            territoryId: "",
            includeLatLong: true,
            status: "",
            sortField: "isOnline",
            onlyTeamMembers: true,
          });
        }}
      />

      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-muted-foreground text-lg font-medium">
                Loading users...
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {!isLoading && enhancedUserListWithStatus.length > 0 && (
        <Card>
          <CardContent className="flex gap-4 p-0">
            <div className="w-100 space-y-2 overflow-y-auto px-2">
              {selectedUserId && (selectedUser || enhancedSingleUser) ? (
                <UserTrackingTimeline
                  key={selectedUserId}
                  userId={selectedUserId}
                  setPath={setPath}
                  setCurrentPosition={setCurrentPosition}
                  setMapCenter={setMapCenter}
                  onBack={handleBackToList}
                />
              ) : (
                <>
                  <div className="max-h-[60vh] min-h-[50vh] overflow-auto">
                    {enhancedUserListWithStatus.map((user: any) => (
                      <Card
                        key={user.id}
                        className={`cursor-pointer p-2 transition-all hover:shadow-md mb-2`}
                        onClick={() => handleUserClick(user.id)}
                      >
                        <CardContent className="flex items-center gap-2 p-0">
                          <img
                            src={
                              user.profileUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.fullName,
                              )}`
                            }
                            alt={user.fullName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-xs text-gray-500">
                              {user.phoneNumber || "No Role"}
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              user.isOnline
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {user.isOnline ? "Online" : "Offline"}
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-end p-2 pb-0 gap-2">
                    <Button
                      onClick={handlePreviousPage}
                      disabled={pagination.page === 1}
                      variant={"outline"}
                      className="w-[50%]"
                    >
                      Prev
                    </Button>
                    <Button
                      className="w-[50%]"
                      variant={"outline"}
                      onClick={handleNextPage}
                      disabled={
                        pagination.page * pagination.limit >= totalCount
                      }
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 pr-4  maxHeight: 60vh">
              {mapCenter && (
                <GoogleMap
                  key={selectedUserId}
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={17}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                >
                  {selectedUserId !== undefined && selectedUserId !== "" ? (
                    <UserPolylineMap
                      key={selectedUserId}
                      path={path}
                      currentPosition={currentPosition}
                      selectedUser={selectedUser || enhancedSingleUser}
                      mapRef={mapRef}
                    />
                  ) : (
                    <UserListMap
                      enhancedUserList={enhancedUserListWithStatus}
                      mapRef={mapRef}
                      onMarkerClick={handleUserClick}
                    />
                  )}
                </GoogleMap>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {!isLoading && enhancedUserListWithStatus.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-muted-foreground mb-2 text-lg font-medium">
                {hasFiltersSelected ? "No users found" : "No users assigned"}
              </div>
              <p className="text-muted-foreground text-sm">
                {hasFiltersSelected
                  ? "Try adjusting your filters to find users"
                  : "You don't have any users assigned for live tracking yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </Main>
  );
}
