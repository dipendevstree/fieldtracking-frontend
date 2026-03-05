export interface BulkUploadError {
  rowNumber: number;
  field: string;
  message: string;
  value: any;
}

export interface BulkUploadResponse {
  totalRows: number;
  successCount: number;
  errors: BulkUploadError[];
}
