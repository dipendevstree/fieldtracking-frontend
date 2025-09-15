import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Upload,
  Download,
  FileCheck2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { CSVLink } from "react-csv";
// import { useBulkImportCustomers } from "../services/Customers.hook";

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
    companyName: "Innovate Inc9011.",
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
    companyName: "Innovate Inc9011.",
    industryName: "technology",
    customerTypeName: "tier_1",
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

export default function BulkImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // const { mutate: uploadFile, isPending, isError, error } = useBulkImportCustomers(
  //   (data) => {
  //     setUploadResult(data.data); // Set result from API response
  //     setSelectedFile(null); // Clear file input on success
  //   },
  //   (_error) => {
  //       // Error is handled by isError and error from useMutation
  //   }
  // );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadResult(null); // Reset previous results
      console.log(event.target.files[0]);
    }
  };

  // const handleBulkUpload = () => {
  //   if (selectedFile) {
  //     uploadFile(selectedFile);
  //   }
  // };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Import Customers</CardTitle>
          <CardDescription>
            Upload a CSV file to add multiple customers at once. Download the
            sample file for the required format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Upload Customer CSV File
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedFile
                ? `Selected file: ${selectedFile.name}`
                : "Drag and drop your CSV file here, or click to browse"}
            </p>
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="csv-upload"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </label>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-end">
            <CSVLink
              data={csvSampleData}
              headers={csvHeaders}
              filename={"customer_import_sample.csv"}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample CSV
            </CSVLink>
            <Button
            // onClick={handleBulkUpload}
            // disabled={!selectedFile || isPending}
            >
              {/* {isPending ? (
                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )} */}
              Process Upload
            </Button>
          </div>

          {/* Display Results */}
          {uploadResult && (
            <Alert variant="default" className="bg-green-50 border-green-200">
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
          {/* {isError && (
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Upload Failed</AlertTitle>
                  <AlertDescription>
                      {error?.response?.data?.message || error.message || "An unknown error occurred."}
                  </AlertDescription>
              </Alert>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}
