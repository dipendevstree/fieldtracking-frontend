import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CSVLink } from "react-csv";
import { useBulkImportUsers } from "../services/AllUsers.hook";
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
import { useAuthStore } from "@/stores/use-auth-store";

export default function UserBulkImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const { user } = useAuthStore();
  const allowTerritory = user?.organization?.allowAddUsersBasedOnTerritories;

  // CSV headers for Users
  const csvHeaders = [
    { label: "FirstName", key: "firstName" },
    { label: "LastName", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "PhoneNumber", key: "phoneNumber" },
    { label: "CountryCode", key: "countryCode" },
    { label: "DepartmentName", key: "departmentName" },
    { label: "RoleName", key: "roleName" },
    { label: "ShiftName", key: "shiftName" },
    { label: "JoiningDate", key: "joiningDate" },
    { label: "ReportingToEmail", key: "reportingToEmail" },
    { label: "AccessType", key: "accessType" },
    ...(allowTerritory
      ? [{ label: "TerritoryName", key: "territoryName" }]
      : []),
  ];

  // Sample data for download
  const csvSampleData = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "9876543210",
      countryCode: "+91",
      departmentName: "IT",
      roleName: "Admin",
      shiftName: "General Shift",
      joiningDate: "1/1/2024",
      reportingToEmail: "bhavdeepdevmurari31+1@gmail.com",
      accessType: "web",
      ...(allowTerritory ? { territoryName: "South Zone" } : {}),
    },
    {
      firstName: "John1",
      lastName: "Doe",
      email: "john1.doe@example.com",
      phoneNumber: "9876543211",
      countryCode: "+91",
      departmentName: "IT",
      roleName: "Admin",
      shiftName: "General Shift",
      joiningDate: "1/1/2024",
      reportingToEmail: "bhavdeepdevmurari31+1@gmail.com",
      accessType: "mobile",
      ...(allowTerritory ? { territoryName: "South Zone" } : {}),
    },
  ];

  const {
    mutate: uploadFile,
    isPending,
    isError,
    error,
    reset,
  } = useBulkImportUsers(
    (data) => {
      setUploadResult(data);
      setSelectedFile(null);
    },
    (error: any) => {
      // Extract validation errors from AxiosError response
      const errorData = error?.response?.data?.data;
      if (errorData) {
        setUploadResult(errorData);
      }
    },
  );

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setUploadResult(null);
    reset(); // Clear previous mutation error state
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
    setUploadResult(null); // Clear previous results
    reset(); // Clear previous error state
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
        <h3 className="text-lg font-semibold">Bulk Import Users</h3>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file to add multiple users at once.
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
            {isDragActive ? "Drop the file here..." : "Upload User CSV File"}
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
            filename="user_import_sample.csv"
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
              <p>Successfully imported: {uploadResult.successCount}</p>
              <p>Failed rows: {uploadResult.errorCount}</p>
              {uploadResult.errors?.length > 0 && (
                <ul className="list-disc pl-5 mt-2 text-xs">
                  {uploadResult.errors.map((err: any, i: number) => (
                    <li key={i}>
                      {typeof err === "string"
                        ? err
                        : `Row ${err.rowNumber || "N/A"}: ${
                            err.message || "Unknown error"
                          }${
                            err.field
                              ? ` (${err.field}: ${err.value || "N/A"})`
                              : ""
                          }`}
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
