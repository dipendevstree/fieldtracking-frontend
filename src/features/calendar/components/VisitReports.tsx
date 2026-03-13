import {
  Star,
  MapPin,
  Clock,
  User,
  FileText,
  Calendar,
  CheckCircle,
  Navigation,
  Building,
  Paperclip,
  File,
} from "lucide-react";
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
import { VisitReport } from "../type/type";
import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  REPORT_FORMAT,
} from "@/data/app.data";
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
import { formatName } from "@/utils/commonFunction";
import StatusBadge from "@/components/ui/status-badge";
import ActionButton from "@/components/shared/table-primary-action-button";
import { FileDown } from "lucide-react";
import { useExportFile } from "@/hooks/useExportFile";
import API from "@/config/api/api";
import { APP_MESSAGES } from "@/constants/messages.constants";

export interface FormData {
  salesRep: string;
  search: string;
  customerId: string;
}

const today = new Date();
const oneWeekAgo = subWeeks(today, 1);

// Helper to check extension and return type
const getFileType = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(extension || "")) {
    return "image";
  }
  if (extension === "pdf") {
    return "pdf";
  }
  return "other";
};

// Helper to check if any feedback exists
const hasFeedbackData = (report: VisitReport) => {
  return (
    report.feedBackDescription ||
    report.feedBackSalesRepBehaviorRating !== null ||
    report.feedBackSalesRepPunctualityRating !== null ||
    report.feedBackSalesSkillsAndKnowledgeRating !== null
  );
};

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
  const { exportFile, isLoading: isExportLoading } = useExportFile();
  const completedVisits = useGetAllCompletedVisit(pagination);

  const visitReports = completedVisits.allData ?? [];

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
      startDate: range?.from ? format(range.from, "yyyy-MM-dd") : "",
      endDate: range?.to ? format(range.to, "yyyy-MM-dd") : "",
    }));
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({
        ...prev,
        searchFeedback: value,
      }));
    }, 800),
    [],
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    setValue("search", searchValue);
    debouncedSearch(searchValue);
  };

  const handleExport = () => {
    const { page, limit, ...filters } = pagination;

    exportFile({
      url: API.calendar.exportCsv,
      type: REPORT_FORMAT.CSV,
      queryParams: { ...filters, status: "completed" },
    });
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Visit Reports</CardTitle>
            <CardDescription>
              Completed visit summaries and client feedback
            </CardDescription>
          </div>
          <ActionButton
            text="Export Visits"
            onAction={handleExport}
            icon={FileDown}
            loading={isExportLoading}
            loadingText={APP_MESSAGES.EXPORT.EXPORTING}
            disabled={
              completedVisits.totalCount === 0 ||
              completedVisits.isLoading ||
              isExportLoading
            }
            disabledTooltip={APP_MESSAGES.EXPORT.NO_DATA_EXPORT}
          />
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
                visitReports.map((report: VisitReport, key: number) => (
                  <div
                    key={key}
                    className="space-y-4 rounded-lg border p-6 bg-white shadow-sm"
                    ref={
                      key === visitReports.length - 1
                        ? completedVisits.lastPostRef
                        : null
                    }
                  >
                    {/* Header: Check-in Image (Circular), Company, Rep, Date, Status */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                      {/* Left Side: Image and Company Info */}
                      <div className="flex items-center gap-4 ">
                        {/* Circular Check-in Image in Header */}
                        {report.checkInImageUrl && (
                          <div className="shrink-0">
                            <a
                              href={report.checkInImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={report.checkInImageUrl}
                                alt="Check-in"
                                className="h-20 w-20 rounded-full object-cover border-2 border-gray-100 hover:border-blue-200 transition-colors"
                              />
                            </a>
                          </div>
                        )}

                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {report.customer?.companyName || "Unknown Company"}
                          </h3>

                          <div className="flex items-center gap-2 my-1 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {report.salesRepresentativeUser?.firstName}{" "}
                              {report.salesRepresentativeUser?.lastName}
                            </span>
                            <span className="hidden md:inline">•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {moment(report.date).format("DD MMM YYYY")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {moment(report.time, "HH:mm").format("hh:mm A")} (
                              {report.duration} hours)
                            </span>
                          </div>

                          {report.priority && (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              Priority :
                              <StatusBadge
                                status={report.priority}
                                showDot={false}
                              />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Side: Status Badge */}
                      <div className="flex items-center gap-2 self-start md:self-center ml-auto md:ml-0">
                        <StatusBadge status={report.status} />
                      </div>
                    </div>

                    {/* Check-in / Check-out & Location Details */}
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Service Location
                            </p>
                            <p className="text-gray-600">
                              {report.streetAddress}, {report.city},{" "}
                              {report.state} - {report.zipCode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Navigation className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Check-in
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500">
                                {report.visitCheckInTime
                                  ? moment(report.visitCheckInTime).format(
                                      "hh:mm A",
                                    )
                                  : "-"}
                              </p>
                              {report.isCheckInLate && (
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-medium border border-red-200">
                                  Late
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-xs mt-0.5">
                              {report.checkinAddress || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Building className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Customer Contact
                            </p>
                            {report.customer?.phoneNumber ? (
                              <p className="text-gray-600">
                                {report.customer.phoneNumber}
                              </p>
                            ) : (
                              <p className="text-gray-400 italic">
                                No contact info
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Navigation className="h-4 w-4 text-red-500 mt-1 shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Check-out
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500">
                                {report.visitCheckOutTime
                                  ? moment(report.visitCheckOutTime).format(
                                      "hh:mm A",
                                    )
                                  : "-"}
                              </p>
                              {report.isVisitNotCompletedOnTime && (
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-medium border border-red-200">
                                  Overtime
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-xs mt-0.5">
                              {report.checkoutAddress || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visit Content */}
                    <div className="grid md:grid-cols-3 gap-4 pt-2">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="flex items-center gap-2 font-semibold text-gray-700 text-sm mb-2">
                          <FileText className="h-4 w-4" /> Purpose & Notes
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium block text-xs uppercase tracking-wider text-gray-500">
                              Purpose
                            </span>
                            {report.purpose}
                          </div>
                          {report.meetingNotes && (
                            <div>
                              <span className="font-medium block text-xs uppercase tracking-wider text-gray-500 mt-2">
                                Meeting Notes
                              </span>
                              <p className="whitespace-pre-wrap">
                                {report.meetingNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-green-50/50 border border-green-100 p-3 rounded-lg">
                        <h4 className="flex items-center gap-2 font-semibold text-green-800 text-sm mb-2">
                          <CheckCircle className="h-4 w-4" /> Outcome
                        </h4>
                        <div className="space-y-2 text-sm">
                          {report.meetingOutcomes &&
                          report.meetingOutcomes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {report.meetingOutcomes.map((outcome, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="bg-white hover:bg-white text-green-700 border-green-200"
                                >
                                  {formatName(outcome)}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">
                              No outcomes recorded
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-lg">
                        <h4 className="flex items-center gap-2 font-semibold text-purple-800 text-sm mb-2">
                          <Navigation className="h-4 w-4" /> Next Steps
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          {report.nextActions ? (
                            <p>{report.nextActions}</p>
                          ) : (
                            <span className="text-gray-400 italic">
                              No next actions
                            </span>
                          )}
                          {report.followUpDate && (
                            <div className="mt-2 pt-2 border-t border-purple-100">
                              <span className="text-xs text-purple-600 font-medium">
                                Follow-up:{" "}
                                {moment(report.followUpDate).format(
                                  "DD MMM YYYY",
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer: Feedback and Check-out Attachments */}
                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t mt-4">
                      {/* Column 1: Client Feedback */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-3">
                          Client Feedback
                        </h4>
                        {hasFeedbackData(report) ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-xs text-gray-600">
                                Skills & Knowledge
                              </span>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i <
                                      (report.feedBackSalesSkillsAndKnowledgeRating ||
                                        0)
                                        ? "fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-xs text-gray-600">
                                Punctuality
                              </span>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i <
                                      (report.feedBackSalesRepPunctualityRating ||
                                        0)
                                        ? "fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-xs text-gray-600">
                                Behavior
                              </span>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i <
                                      (report.feedBackSalesRepBehaviorRating ||
                                        0)
                                        ? "fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {report.feedBackDescription && (
                              <div className="mt-2 text-xs text-gray-600 italic">
                                "{report.feedBackDescription}"
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-sm text-gray-400 italic">
                              No client feedback provided
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Column 2: Check-out Attachments */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-gray-600" />{" "}
                          Check-out Attachments
                        </h4>
                        {report.checkOutFilesUrl &&
                        report.checkOutFilesUrl.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {report.checkOutFilesUrl.map((url, idx) => {
                              const type = getFileType(url);
                              return (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${
                                    type === "image"
                                      ? "w-[95px] h-[95px]"
                                      : "flex flex-col items-center justify-center w-[95px] h-[95px] bg-gray-50 p-2"
                                  }`}
                                  title={`Attachment ${idx + 1}`}
                                >
                                  {type === "image" ? (
                                    <img
                                      src={url}
                                      alt="Check-out"
                                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center gap-1">
                                      {type === "pdf" ? (
                                        <FileText className="h-8 w-8 text-red-500" />
                                      ) : (
                                        <File className="h-8 w-8 text-gray-500" />
                                      )}
                                      <span className="text-[9px] text-gray-500 uppercase font-bold truncate max-w-full">
                                        {url.split(".").pop() || "FILE"}
                                      </span>
                                    </div>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-sm text-gray-400 italic">
                              No check-out attachments
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
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
