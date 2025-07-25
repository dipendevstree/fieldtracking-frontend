import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function BulkImport() {
  const handleBulkUpload = () => {
    // Implement bulk upload logic here
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Import Customers</CardTitle>
          <CardDescription>Upload a CSV file to add multiple customers at once.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Customer CSV File</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            <Button variant="outline" onClick={handleBulkUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium">CSV Format Requirements</h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Required columns:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Company Name (required)</li>
                  <li>• Contact Person (required)</li>
                  <li>• Email Address (required)</li>
                  <li>• Phone Number (required)</li>
                  <li>• Street Address (required)</li>
                  <li>• City (required)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Optional columns:</h4>
              <div className="bg-muted p-4 rounded-lg">
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• State/Province</li>
                  <li>• ZIP/Postal Code</li>
                  <li>• Country</li>
                  <li>• Industry</li>
                  <li>• Customer Type</li>
                  <li>• Assigned Sales Rep</li>
                  <li>• Notes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Upload Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Maximum file size: 10MB</li>
              <li>• Maximum records per upload: 1000</li>
              <li>• Duplicate emails will be skipped</li>
              <li>• Invalid data will be flagged for review</li>
            </ul>
          </div>

          <div className="flex space-x-4 justify-end">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button onClick={handleBulkUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Process Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}