import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetAllCompletedVisit,
  useGetAllCustomer,
} from "../services/calendar-view.hook";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import moment from "moment-timezone";
import InfiniteScroll from "react-infinite-scroll-component";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { FilterConfig } from "@/components/global-filter-section";
import { useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import { useSelectOptions } from "@/hooks/use-select-option";
import { useGetUsersForDropdown } from "@/features/buyers/services/users.hook";
import { format, subWeeks } from "date-fns";
import { DateRange } from "react-day-picker";
import { Main } from "@/components/layout/main";

export interface FormData {
  salesRep: string;
  search: string;
  customerId: string;
}

const today = new Date();
const oneWeekAgo = subWeeks(today, 1);

export default function VisitReports() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: oneWeekAgo.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
    searchFeedback: "",
    salesRepresentativeUserId: "",
    customerId: "",
  });

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: oneWeekAgo,
    to: today,
  });
  const { watch, setValue } = useForm<FormData>({
    defaultValues: { salesRep: "", search: "" },
  });
  const completedVisits = useGetAllCompletedVisit(pagination);

  const visitReports = completedVisits.allData ?? [];
  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      "in-progress": "bg-purple-100 text-purple-800",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const { data: userList = [] } = useGetUsersForDropdown({
    enabled: true,
  });

  const enhancedUserList = userList.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  const users = useSelectOptions({
    listData: enhancedUserList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const { data: customers } = useGetAllCustomer();
  const customerOptions = useSelectOptions({
    listData: customers ?? [],
    labelKey: "companyName",
    valueKey: "customerId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const handleDateRangeChange = (range?: DateRange) => {
    setSelectedRange(range);
    setPagination((prev) => ({
      ...prev,
      startDate: range?.from
        ? format(range.from, "yyyy-MM-dd")
        : new Date().toISOString().split("T")[0],
      endDate: range?.to
        ? format(range.to, "yyyy-MM-dd")
        : new Date().toISOString().split("T")[0],
    }));
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({
        ...prev,
        searchFeedback: value,
      }));
    }, 800),
    []
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    setValue("search", searchValue);
    debouncedSearch(searchValue);
  };

  const selectedRep = watch("salesRep");
  const customerId = watch("customerId");

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      salesRepresentativeUserId: selectedRep,
      customerId,
    }));
  }, [selectedRep, customerId]);

  const filters: FilterConfig[] = [
    {
      key: "dateRange",
      type: "date-range",
      placeholder: "Select Date Range",
      dateRangeValue: selectedRange,
      onDateRangeChange: handleDateRangeChange,
      disableFutureDates: true,
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "search",
      type: "search",
      onChange: handleGlobalSearchChange,
      placeholder: "Search Visits Outcomes, Client Feedback, Next Actions...",
      value: watch("search"),
    },
    {
      key: "salesRep",
      type: "searchable-select",
      onChange: (value) => setValue("salesRep", value ?? ""),
      onCancelPress: () => setValue("salesRep", ""),
      placeholder: "Select SalesRep",
      value: selectedRep,
      options: users,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "customerId",
      type: "searchable-select",
      onChange: (value) => setValue("customerId", value ?? ""),
      onCancelPress: () => setValue("customerId", ""),
      placeholder: "Select Customer",
      value: customerId,
      options: customerOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
  ];

  return (
    <Main className="flex flex-col gap-4">
      <GlobalFilterSection key={"calender-view-filters"} filters={filters} />
      <Card>
        <CardHeader>
          <CardTitle>Visit Reports</CardTitle>
          <CardDescription>
            Completed visit summaries and client feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InfiniteScroll
            loader={
              <p className="text-center text-sm text-gray-500">
                Loading more reports...
              </p>
            }
            dataLength={visitReports.length}
            next={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            hasMore={completedVisits.totalCount < visitReports.length}
          >
            <div className="space-y-6">
              {visitReports.length > 0 ? (
                visitReports.map((report: any, key: number) => (
                  <div
                    key={key}
                    className="space-y-4 rounded-lg border p-6"
                    ref={
                      key === visitReports.length - 1
                        ? completedVisits.lastPostRef
                        : null
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {report?.customer?.companyName}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {`${report?.salesRepresentativeUser?.firstName} ${report?.salesRepresentativeUser?.lastName}`}{" "}
                          • {moment(report.date).format("DD-MM-YYYY")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < report.feedBackSalesSkillsAndKnowledgeRating ? "fill-current text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <Badge className={getStatusBadge(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium text-green-800">
                          Visit Outcome
                        </h4>
                        <p className="rounded-md bg-green-50 p-3 text-sm">
                          {report.meetingOutcomes.length > 0
                            ? (report.meetingOutcomes || []).join(", ")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium text-blue-800">
                          Client Feedback
                        </h4>
                        <p className="rounded-md bg-blue-50 p-3 text-sm">
                          {report.feedBackDescription || "-"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium text-purple-800">
                        Next Actions
                      </h4>
                      <p className="rounded-md bg-purple-50 p-3 text-sm">
                        {report.nextActions || "-"}
                      </p>
                    </div>
                    {/* <div className='flex justify-end space-x-2'>
                  <Button variant='outline' size='sm'>
                    <Eye className='mr-2 h-4 w-4' /> View Details
                  </Button>
                  <Button variant='outline' size='sm'>
                    Export Report
                  </Button>
                </div> */}
                  </div>
                ))
              ) : (
                <p className="space-y-4 rounded-lg border p-6 text-center">
                  No reports found.
                </p>
              )}
            </div>
          </InfiniteScroll>
        </CardContent>
      </Card>
    </Main>
  );
}
