// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
// Calendar as CalendarIcon,
// Settings,
//   Plus,
// } from "lucide-react";
import { useState } from "react";
import {
  useGetAllLeaveTypes,
  // useGetLeaveTypeStats,
} from "@/features/leave-management/services/leave-type.action.hook";
import LeaveTypeTable from "./components/leave-type-table";
import LeaveTypeActionModal from "./components/leave-type-action-modal";
import { useLeaveTypeStore } from "../../store/leave-type.store";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
// import { PermissionGate } from "@/permissions/components/PermissionGate";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";

export default function LeaveTypeManagement() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  const {
    data: leaveTypes = [],
    totalCount = 0,
    isLoading,
  } = useGetAllLeaveTypes({
    page: pagination.page,
    limit: pagination.limit,
  });

  // Fetch Stats
  // const { data: leaveTypeStats } = useGetLeaveTypeStats();

  const { setOpen } = useLeaveTypeStore();

  const openAddDialog = () => {
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <Main className="space-y-6">
      {/* Header Stats */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Leave Types
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveTypeStats?.totalLeaveTypes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently configured
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveTypeStats?.activeEmployees || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              With leave allocations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Allocation
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveTypeStats?.totalAllocation || 0} days
            </div>
            <p className="text-xs text-muted-foreground">Per user/year</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Configured Leave Types Table */}
      <div>
        {/* <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Configured Leave Types</h3>
          <PermissionGate requiredPermission="leave_types" action="add">
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Leave Type
            </Button>
          </PermissionGate>
          </div> */}
        <LeaveTypeActionModal />

        <TablePageLayout
          title="Configured Leave Types"
          description="Manage leave type assignments"
          onAddButtonClick={openAddDialog}
          addButtonText="Add Leave Type"
          modulePermission="leave_types"
          moduleAction="add"
          className="p-0"
        >
          <LeaveTypeTable
            data={leaveTypes}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
            defaultPageSize={pagination.limit}
          />
        </TablePageLayout>
      </div>
    </Main>
  );
}
