import { useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_NUMBER } from "@/data/app.data";

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
  useInfiniteUsers,
  userDetailsById,
} from "./services/live-tracking-services";
import { GoogleMap } from "@react-google-maps/api";
import { useInView } from "react-intersection-observer";
import { socket } from "@/socket/socket";
import { useSearch } from "@tanstack/react-router";

// Assuming you have a Button component
const AHMEDABAD_CENTER = { lat: 23.0225, lng: 72.5714 };

const containerStyle = {
  width: "100%",
  height: "60vh",
  borderRadius: "7px",
  overflow: "hidden",
};

export default function Livetracking() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: 15,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    searchFor: "",
    roleId: "",
    territoryId: "",
    includeLatLong: true,
  });

  const { userId }: any = useSearch({ from: "/_authenticated/livetracking/" });

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

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  const [selectedUserId, setSelectedUserId] = useState(userId);
  const { data: allRoles } = useGetAllRolesForDropdown();
  const roles = useSelectOptions({
    listData: allRoles ?? [],
    labelKey: "roleName",
    valueKey: "roleId",
  });

  const { listData: userListDropDownData = [] } = useGetUsers();

  const userListDropDownList = userListDropDownData?.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  const usersOptions = useSelectOptions<any>({
    listData: userListDropDownList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  // Check if any filter is selected
  const hasFiltersSelected =
    pagination.roleId || pagination.territoryId || pagination.searchFor;

  // Only call useGetUsers when filters are selected
  // const { listData: userList = [], isLoading } = useGetUsers(pagination);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteUsers(pagination);

  const { user } = userDetailsById(userId);

  const enhanceUser = (user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    latLong: user.latLongDetails
      ? { lat: user.latLongDetails.lat, lng: user.latLongDetails.long }
      : null,
  });
  const enhancedSingleUser = user ? enhanceUser(user) : null;

  const enhancedUserList = (data?.pages ?? [])
    .flatMap((page: any) => page.list ?? [])
    .map(enhanceUser);

  const { data: territoriesList } = useGetAllTerritoriesForDropdown();
  const territories = useSelectOptions<any>({
    listData: territoriesList ?? [],
    labelKey: "name",
    valueKey: "id",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleChangeTerritory = (value: string | undefined) => {
    setPagination((prev) => ({
      ...prev,
      territoryId: value ?? "",
      roleId: "", // reset role
      searchFor: "", // reset search
      page: DEFAULT_PAGE_NUMBER,
    }));
  };

  const handleRoleChange = (value: string | undefined) => {
    setPagination((prev) => ({
      ...prev,
      roleId: value ?? "",
      searchFor: "", // reset search only
      page: DEFAULT_PAGE_NUMBER,
    }));
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setPath([]); // Reset path
    setCurrentPosition(null); // Reset current position
    // Update URL to reflect selected user
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("userId", userId);
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
          !isNaN(coord.lng)
      );

    const firstValidCoord = validCoords[0] || AHMEDABAD_CENTER;
    setMapCenter((prev) => {
      if (
        prev &&
        prev.lat === firstValidCoord.lat &&
        prev.lng === firstValidCoord.lng
      ) {
        return prev; // No need to update
      }
      return firstValidCoord;
    });
  };

  useEffect(() => {
    updateMapCenterFromUserList(enhancedUserList);
  }, []);

  const handleBackToList = () => {
    if (socket) {
      socket.emit("untrack_user", { userId });
    }
    setSelectedUserId("");
    setPath([]);
    setCurrentPosition(null);
    updateMapCenterFromUserList(enhancedUserList);
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("userId");
    window.history.pushState({}, "", `?${newParams}`);
  };

  useEffect(() => {
    setSelectedUserId(userId);
  }, [userId]);

  const filters: FilterConfig[] = [
    {
      key: "UserTerritory",
      type: "select",
      onChange: handleChangeTerritory,
      placeholder: "Select User Territory",
      value: pagination.territoryId,
      options: territories as Option[],
    },
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
      value: selectedUserId,
      options: usersOptions,
      onChange: (value) => {
        if (value) {
          handleUserClick(value);
        } else {
          // Handle case when user clears the selection
          setSelectedUserId("");
          setPath([]); // Reset path
          setCurrentPosition(null); // Reset current position
          const newParams = new URLSearchParams(window.location.search);
          newParams.delete("userId");
          window.history.pushState({}, "", `?${newParams}`);
        }
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

  const selectedUser = enhancedUserList.find(
    (u: any) => u.id === selectedUserId
  );

  return (
    <Main className={cn("flex flex-col gap-4 p-4")}>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Live Tracking</h2>
        <p className="text-muted-foreground">
          Track real-time activity and manage admin approvals.
        </p>
      </div>
      {/* Filters */}
      <GlobalFilterSection
        key="calendar-view-filters"
        filters={filters}
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
          });
        }}
      />

      {/* Show loading state */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-muted-foreground text-lg font-medium">
                Loading users...
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Show user list or timeline and map when filters are selected and data exists */}
      {!isLoading && enhancedUserList.length > 0 && (
        <Card>
          <CardContent className="flex gap-4 p-0">
            {/* Sidebar with Users or Timeline */}
            <div
              className="w-100 space-y-2 overflow-y-auto p-2"
              style={{ height: "60vh" }}
            >
              {selectedUserId && (selectedUser || enhancedSingleUser) ? (
                <>
                  <UserTrackingTimeline
                    key={selectedUserId}
                    userId={selectedUserId}
                    setPath={setPath}
                    setCurrentPosition={setCurrentPosition}
                    setMapCenter={setMapCenter}
                    onBack={handleBackToList}
                  />
                </>
              ) : (
                <div>
                  {enhancedUserList.map((user: any, index: number) => {
                    const isLast = index === enhancedUserList.length - 1;
                    return (
                      <Card
                        key={user.id}
                        className={`cursor-pointer p-2 transition-all hover:shadow-md mb-2`}
                        onClick={() => handleUserClick(user.id)}
                      >
                        <div ref={isLast ? loadMoreRef : undefined}>
                          <CardContent className="flex items-center gap-2 p-0">
                            <img
                              src={
                                user.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  user.fullName
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
                              {user.isOnline ? "Active" : "Offline"}
                            </span>
                          </CardContent>
                        </div>
                      </Card>
                    );
                  })}
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-4 text-sm text-muted-foreground">
                      Loading more...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Map View */}
            <div className="flex-1 pr-4">
              {mapCenter && (
                <>
                  <GoogleMap
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
                        enhancedUserList={enhancedUserList}
                        mapRef={mapRef}
                        onMarkerClick={handleUserClick}
                      />
                    )}
                  </GoogleMap>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Show message when filters are selected but no data found */}
      {hasFiltersSelected && !isLoading && enhancedUserList.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-muted-foreground mb-2 text-lg font-medium">
                No users found
              </div>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filters to find users
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </Main>
  );
}
