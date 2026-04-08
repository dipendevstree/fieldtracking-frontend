import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CSVLink } from "react-csv";
import { useBulkImportLeaveBalance } from "@/features/leave-management/services/leave-action.hook";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Upload,
  FileCheck2,
  AlertCircle,
  Download,
  FileText,
  X,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { BulkUploadResponse } from "@/features/leave-management/types/leave-balance-import.types";

export default function LeaveBalanceBulkImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<BulkUploadResponse | null>(
    null,
  );

  // CSV headers for Leave Balance
  const csvHeaders = [
    { label: "Email", key: "email" },
    { label: "Leave Type", key: "leaveType" },
    { label: "Year", key: "year" },
    { label: "Balance", key: "balance" },
  ];

  // Sample data for download
  const csvSampleData = [
    {
      email: "john.doe@example.com",
      leaveType: "Paid Leave",
      year: "2026",
      balance: "10",
    },
    {
      email: "jane.doe@example.com",
      leaveType: "Sick Leave",
      year: "2026",
      balance: "5",
    },
  ];

  const {
    mutate: uploadFile,
    isPending,
    isError,
    error,
    reset,
  } = useBulkImportLeaveBalance(
    (data) => {
      setUploadResult(data);
      setSelectedFile(null);
    },
    (error: any) => {
      const errorData = error?.response?.data?.data;
      if (errorData) {
        setUploadResult(errorData);
      }
    },
  );

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setUploadResult(null);
    reset();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    noClick: !!selectedFile,
    onDrop: (acceptedFiles: any) => {
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0]);
      }
    },
  });

  const handleBulkUpload = () => {
    if (!selectedFile) return;
    setUploadResult(null);
    reset();
    const formData = new FormData();
    formData.append("file", selectedFile);
    uploadFile(formData);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setUploadResult(null);
    reset();
  };

  // Reset all state when component unmounts (modal closes)
  useEffect(() => {
    return () => {
      setSelectedFile(null);
      setUploadResult(null);
      reset();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Bulk Import Leave Balance</h3>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file to import leave balances for multiple users at once.
        </p>
      </div>
      <div className="space-y-6">
        {/* Upload box with drag & drop */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition 
    ${isDragActive ? "bg-muted/30 border-primary" : "border-muted-foreground/25"}
  `}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">
            {isDragActive
              ? "Drop the file here..."
              : "Upload Leave Balance CSV File"}
          </h3>

          {selectedFile ? (
            <div className="mt-4 inline-flex items-center gap-3 text-sm rounded-md border p-2 shadow-sm bg-background">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium truncate max-w-xs">
                {selectedFile.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={handleRemoveFile}
                disabled={isPending}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm mb-4 text-muted-foreground">
                Drag & drop or choose a CSV
              </p>
              <Button type="button" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <CSVLink
            data={csvSampleData}
            headers={csvHeaders}
            filename="leave_balance_import_sample.csv"
            className="border px-4 py-2 rounded-md inline-flex items-center"
          >
            <Download className="h-4 w-4 mr-2" /> Download Sample CSV
          </CSVLink>
          <Button
            onClick={handleBulkUpload}
            disabled={!selectedFile || isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Process Upload
          </Button>
        </div>

        {/* Results */}
        {uploadResult && (
          <Alert
            className={`bg-${uploadResult.errors?.length > 0 ? "red" : "green"}-50 border-${uploadResult.errors?.length > 0 ? "red" : "green"}-200`}
          >
            <FileCheck2
              className={`h-4 w-4 text-${uploadResult.errors?.length > 0 ? "red" : "green"}-600`}
            />
            <AlertTitle
              className={`text-${uploadResult.errors?.length > 0 ? "red" : "green"}-800`}
            >
              Upload Processed
            </AlertTitle>
            <AlertDescription
              className={`text-${uploadResult.errors?.length > 0 ? "red" : "green"}-700`}
            >
              <p>Total rows: {uploadResult.totalRows}</p>
              <p>Successfully imported: {uploadResult.successCount}</p>
              <p>
                Failed rows:{" "}
                {uploadResult.errors?.length ?? 0}
              </p>
              {uploadResult.errors?.length > 0 && (
                <ul className="list-disc pl-5 mt-2 text-xs">
                  {uploadResult.errors.map((err, i) => (
                    <li key={i}>
                      Row {err.rowNumber || "N/A"}: {err.message || "Unknown error"}
                      {err.field
                        ? ` (${err.field}: ${err.value || "N/A"})`
                        : ""}
                    </li>
                  ))}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isError && !uploadResult && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Failed</AlertTitle>
            <AlertDescription>
              {(error as any)?.response?.data?.errorMessage ||
                (error as any)?.response?.data?.message ||
                error?.message ||
                "An unknown error occurred."}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
