import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CSVLink } from "react-csv";
import { useBulkImportCustomers } from "../services/Customers.hook";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Upload,
  FileCheck2,
  AlertCircle,
  Download,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function BulkImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Define the new CSV headers
  const csvHeaders = [
    { label: "Company Name*", key: "companyName" },
    { label: "Industry Name", key: "industryName" }, // Changed from ID
    { label: "Customer Type Name", key: "customerTypeName" }, // Changed from ID
    { label: "Street Address", key: "address" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Zip Code", key: "zipCode" },
    { label: "Country", key: "country" },
    { label: "Latitude", key: "latitude" },
    { label: "Longitude", key: "longitude" },
    { label: "Additional Notes", key: "notes" },
    { label: "Contact Name*", key: "contactName" },
    { label: "Contact Email*", key: "contactEmail" },
    { label: "Contact Phone*", key: "contactPhone" },
    { label: "Contact Designation", key: "contactDesignation" },
    { label: "Is Primary Contact* (TRUE/FALSE)", key: "isPrimary" },
    { label: "Assigned Sales Rep Name", key: "assignedRepName" }, // Changed from ID
  ];

  // Update the sample data to match the new headers
  const csvSampleData = [
    {
      companyName: "Innovate Inc90113.",
      industryName: "it", // e.g. "Technology"
      customerTypeName: "Primary", // e.g. "Tier 1"
      address: "1600 Amphitheatre Parkway",
      city: "Mountain View",
      state: "CA",
      zipCode: "94043",
      country: "USA",
      latitude: "12",
      longitude: "12",
      notes: "A key account.",
      contactName: "John Doe",
      contactEmail: "john.doe@innovate.com",
      contactPhone: "123-456-7890",
      contactDesignation: "CEO",
      isPrimary: "TRUE",
      assignedRepName: "karan",
    },
    {
      companyName: "Innovate Inc90113.",
      industryName: "it",
      customerTypeName: "primary",
      address: "1600 Amphitheatre Parkway",
      city: "Mountain View",
      state: "CA",
      zipCode: "94043",
      country: "USA",
      latitude: "12",
      longitude: "12",
      notes: "A key account.",
      contactName: "Jane Roe",
      contactEmail: "jane.roe@innovate.com",
      contactPhone: "987-654-3210",
      contactDesignation: "CTO",
      isPrimary: "FALSE",
      assignedRepName: "", // No assigned rep for this contact
    },
  ];

  const {
    mutate: uploadFile,
    isPending,
    isError,
    error,
  } = useBulkImportCustomers(
    (data) => {
      setUploadResult(data);
      setSelectedFile(null);
    },
    (_error) => {}
  );

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setUploadResult(null);
  };

  // ⬇️ react-dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    onDrop: (acceptedFiles: any) => {
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0]);
      }
    },
  });

  const handleBulkUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    uploadFile(formData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Import Customers</CardTitle>
          <CardDescription>
            Upload a CSV file to add multiple customers at once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                : "Upload Customer CSV File"}
            </h3>
            <p className="text-sm mb-4 text-muted-foreground">
              {selectedFile
                ? `Selected file: ${selectedFile.name}`
                : "Drag & drop or choose a CSV"}
            </p>
            {/* Keep your existing button */}
            <label
              htmlFor="csv-upload"
              className="cursor-pointer inline-flex items-center border px-4 py-2 rounded-md"
              onClick={(e) => e.stopPropagation()} // prevent triggering dropzone
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </label>
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              onChange={(e) =>
                e.target.files && handleFileChange(e.target.files[0])
              }
              className="hidden"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <CSVLink
              data={csvSampleData}
              headers={csvHeaders}
              filename="customer_import_sample.csv"
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

          {/* Results (same as your code) */}
          {uploadResult && (
            <Alert className="bg-green-50 border-green-200">
              <FileCheck2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Upload Processed
              </AlertTitle>
              <AlertDescription className="text-green-700">
                <p>Successfully imported: {uploadResult.successCount}</p>
                <p>Failed rows: {uploadResult.errorCount}</p>
                {uploadResult.errors?.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 text-xs">
                    {uploadResult.errors
                      .slice(0, 5)
                      .map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                    {uploadResult.errors.length > 5 && (
                      <li>
                        ...and {uploadResult.errors.length - 5} more errors.
                      </li>
                    )}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>
                {error?.message || "An unknown error occurred."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
