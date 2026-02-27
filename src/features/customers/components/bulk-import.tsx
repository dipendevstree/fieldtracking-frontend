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
  FileText,
  X,
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
    { label: "Industry Name*", key: "industryName" },
    { label: "Customer Type Name*", key: "customerTypeName" },
    { label: "Street Address*", key: "address" },
    { label: "City*", key: "city" },
    { label: "State*", key: "state" },
    { label: "Zip Code*", key: "zipCode" },
    { label: "Country*", key: "country" },
    { label: "Latitude", key: "latitude" },
    { label: "Longitude", key: "longitude" },
    { label: "Additional Notes", key: "notes" },
    { label: "Primary Contact Name*", key: "primaryContactName" },
    { label: "Primary Contact Email*", key: "primaryContactEmail" },
    { label: "Primary Contact Phone*", key: "primaryContactPhone" },
    { label: "Primary Contact Designation", key: "primaryContactDesignation" },
    { label: "Primary Assigned Sales Rep Name", key: "primaryAssignedRepName" },
    { label: "Secondary Contact Name", key: "secondaryContactName" },
    { label: "Secondary Contact Email", key: "secondaryContactEmail" },
    { label: "Secondary Contact Phone", key: "secondaryContactPhone" },
    {
      label: "Secondary Contact Designation",
      key: "secondaryContactDesignation",
    },
  ];

  // Update the sample data to match the new headers
  const csvSampleData = [
    {
      companyName: "Innovate Corp",
      industryName: "Technology",
      customerTypeName: "Enterprise",
      address: "1600 Amphitheatre Parkway",
      city: "Mountain View",
      state: "CA",
      zipCode: "94043",
      country: "USA",
      latitude: "37.422",
      longitude: "-122.084",
      notes: "A key account for Q3.",
      primaryContactName: "Jane Doe",
      primaryContactEmail: "jane.doe@innovate.com",
      primaryContactPhone: "1234567890",
      primaryContactDesignation: "CEO",
      primaryAssignedRepName: "John Smith",
      secondaryContactName: "Peter Jones",
      secondaryContactEmail: "peter.jones@innovate.com",
      secondaryContactPhone: "0987654321",
      secondaryContactDesignation: "CTO",
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
    // noClick: true, // enbled div click to upload file
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

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setUploadResult(null);
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

            {selectedFile ? (
              // If a file IS selected, show the file info pill
              <div className="mt-4 inline-flex items-center gap-3 text-sm rounded-md border p-2 shadow-sm bg-background">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium truncate max-w-xs">
                  {selectedFile.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleRemoveFile} // Ensure you have this handler
                  disabled={isPending}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // If NO file is selected, show the prompt and the button
              <>
                <p className="text-sm mb-4 text-muted-foreground">
                  Drag & drop or choose a CSV
                </p>
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer inline-flex items-center border bg-background px-4 py-2 rounded-md text-sm font-medium hover:bg-accent"
                  onClick={(e) => e.stopPropagation()} // prevent triggering dropzone
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </label>
                <input
                  type="file"
                  id="csv-upload"
                  accept=".csv"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileChange(e.target.files[0]);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
              </>
            )}
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
            <Alert className={`bg-${uploadResult.errors?.length > 0 ? 'red': 'green'}-50 border-${uploadResult.errors?.length > 0 ? 'red': 'green'}-200`}>
              <FileCheck2 className={`h-4 w-4 text-${uploadResult.errors?.length > 0 ? 'red': 'green'}-600`} />
              <AlertTitle className={`text-${uploadResult.errors?.length > 0 ? 'red': 'green'}-800`}>
                Upload Processed
              </AlertTitle>
              <AlertDescription className={`text-${uploadResult.errors?.length > 0 ? 'red': 'green'}-700`}>
                <p>Successfully imported: {uploadResult.successCount}</p>
                <p>Failed rows: {uploadResult.errorCount}</p>
                {uploadResult.errors?.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 text-xs">
                    {uploadResult.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
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
