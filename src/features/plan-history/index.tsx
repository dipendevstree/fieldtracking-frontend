import { useState } from "react";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { FilterConfig } from "@/components/global-filter-section";
import { useGetOrganizations } from "@/features/organizations/services/organization.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { useGetPlanHistory } from "./services/PlanHistory.hook";
import PlanHistoryTable from "./components/Table";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { useSearch } from "@tanstack/react-router";
import { PlanHistory } from "./type/type";
import CustomBreadcrumb from "@/components/shared/custom-breadcrumb";

const PlanHistoryFeature = () => {
  const search: any = useSearch({ from: "__root__" });
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    search.organizationId || "",
  );

  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  // Fetch Organizations for the selector
  const { organization: organizationsList = [] } = useGetOrganizations();

  const orgOptions = useSelectOptions({
    listData: organizationsList,
    labelKey: "organizationName",
    valueKey: "organizationID",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  // Fetch Plan History for selected organization
  const {
    planHistory,
    totalCount,
    isLoading: isHistoryLoading,
  } = useGetPlanHistory(selectedOrgId, pagination, {
    enabled: !!selectedOrgId,
  });

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const breadcrumbItems = [
    { label: "Organizations", href: "/superadmin/organizations" },
    { label: "Plan History" },
  ];

  const filters: FilterConfig[] = [
    {
      key: "organizationId",
      type: "searchable-select",
      placeholder: "Select Organization",
      options: orgOptions,
      value: selectedOrgId,
      onChange: (value) => {
        setSelectedOrgId(value ?? "");
        setPagination((prev) => ({ ...prev, page: 1 }));
      },
      // onCancelPress: () => setSelectedOrgId(""),
      searchableSelectClassName: "w-full max-w-[300px]",
    },
  ];

  return (
    <Main className="flex flex-col gap-2 p-4">
      <CustomBreadcrumb items={breadcrumbItems} className="mb-2" />
      <TablePageLayout
        title="Plan History"
        description="View subscription and payment history for organizations"
        showActionButton={false}
        className="p-0"
      >
        <GlobalFilterSection
          key={"plan-history-filters"}
          filters={filters}
          className={"mt-4 mb-6"}
        />

        {selectedOrgId ? (
          <PlanHistoryTable
            data={planHistory as PlanHistory[]}
            totalCount={totalCount}
            loading={isHistoryLoading}
            currentPage={pagination.page}
            pageSize={pagination.limit}
            paginationCallbacks={{ onPaginationChange }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <h3 className="text-lg font-medium">No Organization Selected</h3>
            <p className="text-muted-foreground">
              Please select an organization from the dropdown above to view its
              plan history.
            </p>
          </div>
        )}
      </TablePageLayout>
    </Main>
  );
};

export default PlanHistoryFeature;
