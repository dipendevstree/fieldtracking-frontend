import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import debounce from "lodash.debounce";
import { cn } from "@/lib/utils";
import { useSelectOptions } from "@/hooks/use-select-option";
import { Card, CardContent } from "@/components/ui/card";
import { FilterConfig, Option } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { Main } from "@/components/layout/main";
import { useGetAllRolesForDropdown } from "../UserManagement/services/Roles.hook";
import { IUser, useGetUsers } from "../buyers/services/users.hook";
import { useGetAllTerritoriesForDropdown } from "../userterritory/services/user-territory.hook";
import UserTrackingTimeline from "./user-livetracting-info";
import UserPolylineMap from "./components/UserPolylineMap";
import UserListMap from "./components/UserListMap";

// Assuming you have a Button component
const AHMEDABAD_CENTER = { lat: 23.0225, lng: 72.5714 };

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
  });

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
  // Get userId from query
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const { data: allRoles } = useGetAllRolesForDropdown();
  const roles = useSelectOptions({
    listData: allRoles ?? [],
    labelKey: "roleName",
    valueKey: "roleId",
  });

  // Check if any filter is selected
  const hasFiltersSelected =
    pagination.roleId || pagination.territoryId || pagination.searchFor;

  // Only call useGetUsers when filters are selected
  const { listData: userList = [], isLoading } = useGetUsers(
    pagination as IUser
  );

  const enhancedUserList = userList.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    latLong: user.latLongDetails
      ? { lat: user.latLongDetails.lat, lng: user.latLongDetails.long }
      : null,
  }));

  const { data: territoriesList } = useGetAllTerritoriesForDropdown();
  const territories = useSelectOptions<any>({
    listData: territoriesList ?? [],
    labelKey: "name",
    valueKey: "id",
  });

  const handleGlobalSearchChange = useCallback(
    debounce((value: string | undefined) => {
      setPagination((prev) => ({
        ...prev,
        searchFor: value ?? "",
        page: DEFAULT_PAGE_NUMBER,
      }));
      setSelectedUserId(""); // reset selected user
    }, 500),
    []
  );

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
    // Update URL to reflect selected user
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("userId", userId);
    window.history.pushState({}, "", `?${newParams}`);
  };

  const updateMapCenterFromUserList = (userList: any[]) => {
    const initialPath = userList.map((item: any) => ({
      lat: parseFloat(item?.latLongDetails?.lat),
      lng: parseFloat(item?.latLongDetails?.long),
    }));

    if (initialPath.length > 0) {
      setMapCenter(initialPath[0]);
    } else {
      setMapCenter(AHMEDABAD_CENTER);
    }
  };

  useEffect(() => {
    updateMapCenterFromUserList(userList);
  }, [userList]);

  const handleBackToList = () => {
    setSelectedUserId("");
    setPath([]);
    setCurrentPosition(null);
    updateMapCenterFromUserList(userList);
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("userId");
    window.history.pushState({}, "", `?${newParams}`);
  };

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
      key: "search",
      type: "search",
      onChange: handleGlobalSearchChange,
      placeholder: "Search Users...",
      value: pagination.searchFor,
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

  useEffect(() => {
    updateMapCenterFromUserList(userList);
  }, [userList]);

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
            limit: DEFAULT_PAGE_SIZE,
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
            searchFor: "",
            roleId: "",
            territoryId: "",
            includeLatLong: true,
          });
        }}
      />
      {/* Show message when no filters are selected */}
      {!hasFiltersSelected && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-muted-foreground mb-2 text-lg font-medium">
                Please select value from filter
              </div>
              <p className="text-muted-foreground text-sm">
                Choose a role, territory, or search to view user tracking data
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Show loading state */}
      {hasFiltersSelected && isLoading && (
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
      {hasFiltersSelected && !isLoading && enhancedUserList.length > 0 && (
        <Card>
          <CardContent className="flex gap-4 p-0">
            {/* Sidebar with Users or Timeline */}
            <div
              className="w-100 space-y-2 overflow-y-auto p-2"
              style={{ height: "60vh" }}
            >
              {selectedUserId != "" ? (
                <>
                  <UserTrackingTimeline
                    userId={selectedUserId}
                    setPath={setPath}
                    setCurrentPosition={setCurrentPosition}
                    setMapCenter={setMapCenter}
                    onBack={handleBackToList}
                  />
                </>
              ) : (
                enhancedUserList.map((user: any) => (
                  <Card
                    key={user.id}
                    className={`cursor-pointer p-2 transition-all hover:shadow-md`}
                    onClick={() => handleUserClick(user.id)}
                  >
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
                          {user.role?.roleName || "No Role"}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          user.status === "verified"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.status === "verified" ? "Active" : "Offline"}
                      </span>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            {/* Map View */}
            <div className="flex-1 pr-4">
              {mapCenter && (
                <>
                  {selectedUserId !== "" ? (
                    <UserPolylineMap
                      mapCenter={mapCenter}
                      path={path}
                      currentPosition={currentPosition}
                      selectedUser={selectedUser}
                      mapRef={mapRef}
                    />
                  ) : (
                    <UserListMap
                      mapCenter={mapCenter}
                      enhancedUserList={enhancedUserList}
                      mapRef={mapRef}
                      onMarkerClick={handleUserClick}
                    />
                  )}
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
