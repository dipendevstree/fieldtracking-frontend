import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ReportsHead from "./ReportsHead";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { useGetReportsHistory } from "../services/reports-api";
import { reportsHistoryColumns } from "./ReportHistoryColumns";
import { useReportSocketTracker } from "../hooks/useReportSocketTracker";

const ReportsHistory: React.FC = () => {
  // -------------------- State --------------------
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [reportData, setReportData] = useState<any[]>([]);

  // -------------------- API Hooks --------------------
  const { reports, isLoading, totalCount } = useGetReportsHistory({
    page: currentPage,
    limit: pageSize,
  });

  // -------------------- Handlers --------------------
  const onPaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  useEffect(() => {
    if (Array.isArray(reports)) {
      setReportData(reports);
    }
  }, [reports]);

  const handleReportGenerated = useCallback((data: any) => {
    setReportData((prev: any) =>
      prev.map((r: any) =>
        r.id === data.id
          ? {
              ...r,
              status: data.status ?? r.status,
              fileUrl: data.fileUrl ?? r.fileUrl,
              fileSize: data.fileSize ?? r.fileSize,
            }
          : r
      )
    );
  }, []);

  // Socket listeners
  useReportSocketTracker(handleReportGenerated);

  // -------------------- UI --------------------
  return (
    <div>
      <Card className="p-4 mt-4 gap-2">
        <ReportsHead
          title="Reports History"
          subtitle="View Report results generated previously"
        />
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading reports...</span>
          </div>
        ) : (
          <CustomDataTable
            paginationCallbacks={{ onPaginationChange }}
            data={reportData}
            currentPage={currentPage}
            columns={reportsHistoryColumns as ColumnDef<unknown>[]}
            totalCount={totalCount}
            defaultPageSize={pageSize}
          />
        )}
      </Card>
    </div>
  );
};

export default ReportsHistory;
