import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Settings, Plus } from "lucide-react";
import { useState } from "react";
import { useGetAllLeaveTypes } from "@/features/leave-management/services/leave-type.action.hook";

import LeaveTypeTable from "./components/leave-type-table";
import LeaveTypeActionModal from "./components/leave-type-action-modal";
import { useLeaveTypeStore } from "../../store/leave-type.store";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";

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
  const { setOpen } = useLeaveTypeStore();

  const openAddDialog = () => {
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Leave Types
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveTypes.length} types</div>
            <p className="text-xs text-muted-foreground">
              Currently configured
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Employees
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
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
            <div className="text-2xl font-bold">66 days</div>
            <p className="text-xs text-muted-foreground">Per employee/year</p>
          </CardContent>
        </Card>
      </div>

      {/* Configured Leave Types Table (Prominent now) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Configured Leave Types</h3>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Leave Type
          </Button>
          <LeaveTypeActionModal />
        </div>

        <LeaveTypeTable
          data={leaveTypes}
          totalCount={totalCount}
          loading={isLoading}
          currentPage={pagination.page}
          paginationCallbacks={{ onPaginationChange }}
          defaultPageSize={pagination.limit}
        />
      </div>
    </div>
  );
}
