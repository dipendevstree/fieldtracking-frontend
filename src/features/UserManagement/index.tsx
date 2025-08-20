import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import { ErrorResponse } from "../merchants/types";
import { UsersActionModal } from "./components/action-form-modal";
import AllUsersTable from "./components/table";
import { useGetAllUsers } from "./services/AllUsers.hook";
import { useUsersStore } from "./store/users.store";

const AllUsers = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  // Organizations data
  const {
    totalCount = 0,
    allUsers = [],
    isLoading,
    error,
  } = useGetAllUsers(pagination);

  // User status counts
  // const { userStatusCounts, totalOrganizations } = useUserStatusCounts() || {
  //   userStatusCounts: {},
  // }

  const { setOpen, open } = useUsersStore();
  const {} = useRouter();

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data;
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    );
  }

  const handleAddUser = () => {
    console.log("Add User button clicked");
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  // Calculate total users across all statuses
  // const totalUsers =
  //   userStatusCounts.created +
  //   userStatusCounts.pending +
  //   userStatusCounts.verified +
  //   userStatusCounts.rejected

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      {/* Statistics Cards */}
      {/* <div className='mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{2}</div>
            <p className='text-muted-foreground text-xs'>2 active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Visits Today
            </CardTitle>
            <Building2 className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>156</div>
            <p className='text-muted-foreground text-xs'>+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Revenue Generated
            </CardTitle>
            <Clock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$45,231</div>
            <p className='text-muted-foreground text-xs'>+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Avg. Performance
            </CardTitle>
            <UserCheck className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>87%</div>
            <p className='text-muted-foreground text-xs'>+3% from last month</p>
          </CardContent>
        </Card>
      </div> */}

      {/* User Directory Section */}

      {/* <div className='mb-4'>
          <h3 className='text-xl font-semibold'>User Directory</h3>
          <p className='text-muted-foreground text-sm'>
            Manage user accounts, sales reps, and access permissions
          </p>
        </div> */}

      <TablePageLayout
        title="All Users"
        description="Manage user accounts and permissions"
        onAddButtonClick={handleAddUser}
        addButtonText="Add User"
        modulePermission="all_users"
        moduleAction="add"
      >
        <AllUsersTable
          data={allUsers}
          totalCount={totalCount}
          loading={isLoading}
          currentPage={pagination.page}
          paginationCallbacks={{ onPaginationChange }}
        />
      </TablePageLayout>

      {open && <UsersActionModal key={"users-action-modal"} />}
    </Main>
  );
};

export default AllUsers;
