import { CustomReportRow, ExpanseReportRow } from "../types";

// Mock data for expanse report
export const dummyReports: ExpanseReportRow[] = [
  {
    salesRep: "Jacob Jones",
    date: "2025-10-05",
    expanse_date: "2025-10-04",
    created_date: "2025-10-05",
    expense_category: "Food",
    status: "Approved",
    total_amount: "95.00",
  },
  {
    salesRep: "Bessie Cooper",
    date: "2025-10-06",
    expanse_date: "2025-10-05",
    created_date: "2025-10-06",
    expense_category: "Travel",
    status: "Pending",
    total_amount: "120.50",
  },
  {
    salesRep: "Ronald Richards",
    date: "2025-10-08",
    expanse_date: "2025-10-07",
    created_date: "2025-10-08",
    expense_category: "Miscellaneous",
    status: "Approved",
    total_amount: "45.20",
  },
  {
    salesRep: "Kristin Watson",
    date: "2025-10-07",
    expanse_date: "2025-10-06",
    created_date: "2025-10-07",
    expense_category: "Accommodation",
    status: "Rejected",
    total_amount: "80.75",
  },
  {
    salesRep: "Annette Black",
    date: "2025-10-09",
    expanse_date: "2025-10-08",
    created_date: "2025-10-09",
    expense_category: "Fuel",
    status: "Approved",
    total_amount: "67.30",
  },
];

// Mock data for custom report
export const customReportData: CustomReportRow[] = [
  {
    id: 1,
    type: "Expense Report",
    format: "pdf",
    generatedBy: "Admin User",
    date: "2024-01-15",
    time: "10:30",
    size: "2.3 MB",
    status: "completed",
  },
  {
    id: 2,
    type: "Performance Report",
    format: "excel",
    generatedBy: "Manager",
    date: "2024-01-10",
    time: "14:45",
    size: "5.1 MB",
    status: "completed",
  },
  {
    id: 3,
    type: "Activity Report",
    format: "csv",
    generatedBy: "Admin User",
    date: "2024-01-08",
    time: "09:15",
    size: "1.8 MB",
    status: "processing",
  },
];
