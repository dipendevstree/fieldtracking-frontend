// API service for reports functionality
export interface SalesRep {
  id: string;
  name: string;
  email: string;
  territory?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Industry {
  id: string;
  name: string;
  code: string;
}

export interface Territory {
  id: string;
  name: string;
  region: string;
}

export interface ReportFilter {
  dateRange?: {
    from: Date;
    to: Date;
  };
  salesRep?: string;
  category?: string;
  industry?: string;
  territory?: string;
  status?: string;
}

export interface ExpenseReport {
  id: string;
  salesRep: string;
  attachment: string;
  expense_category: string;
  total_amount: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CustomerReport {
  id: number;
  name: string;
  totalCustomers: number;
  newCustomers: number;
  topIndustries: string;
  status: string;
  timeTracking: string;
  generatedDate: string;
}

export interface FieldActivityReport {
  id: number;
  salesRep: string;
  date: string;
  territory: string;
  mode: string;
  amount: number;
  avatar?: string;
}

// Mock API functions - replace with actual API calls
class ReportsAPI {
  // private baseUrl = '/api/reports'; // Will be used when implementing real API calls

  // Sales Representatives
  async getSalesReps(): Promise<SalesRep[]> {
    // Mock data - replace with actual API call
    return [
      { id: 'john-doe', name: 'John Doe', email: 'john@company.com', territory: 'North Region' },
      { id: 'jane-smith', name: 'Jane Smith', email: 'jane@company.com', territory: 'South Region' },
      { id: 'alex-johnson', name: 'Alex Johnson', email: 'alex@company.com', territory: 'East Region' },
      { id: 'mike-wilson', name: 'Mike Wilson', email: 'mike@company.com', territory: 'West Region' },
    ];
  }

  // Expense Categories
  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    return [
      { id: 'travel', name: 'Travel', description: 'Transportation and accommodation' },
      { id: 'meals', name: 'Meals', description: 'Food and entertainment expenses' },
      { id: 'supplies', name: 'Supplies', description: 'Office and business supplies' },
      { id: 'communication', name: 'Communication', description: 'Phone and internet expenses' },
    ];
  }

  // Industries
  async getIndustries(): Promise<Industry[]> {
    return [
      { id: 'tech', name: 'Technology', code: 'TECH' },
      { id: 'healthcare', name: 'Healthcare', code: 'HLTH' },
      { id: 'finance', name: 'Finance', code: 'FIN' },
      { id: 'retail', name: 'Retail', code: 'RTL' },
      { id: 'manufacturing', name: 'Manufacturing', code: 'MFG' },
    ];
  }

  // Territories
  async getTerritories(): Promise<Territory[]> {
    return [
      { id: 'north', name: 'North Region', region: 'Northern' },
      { id: 'south', name: 'South Region', region: 'Southern' },
      { id: 'east', name: 'East Region', region: 'Eastern' },
      { id: 'west', name: 'West Region', region: 'Western' },
      { id: 'downtown', name: 'Downtown District', region: 'Central' },
    ];
  }

  // Customer Status options
  getCustomerStatusOptions() {
    return [
      { id: 'active', name: 'Active' },
      { id: 'inactive', name: 'Inactive' },
      { id: 'pending', name: 'Pending' },
      { id: 'suspended', name: 'Suspended' },
    ];
  }

  // Report Type options
  getReportTypeOptions() {
    return [
      { id: 'customer-directory', name: 'Customer Directory' },
      { id: 'sales-report', name: 'Sales Report' },
      { id: 'activity-report', name: 'Activity Report' },
      { id: 'performance-report', name: 'Performance Report' },
      { id: 'expense-report', name: 'Expense Report' },
    ];
  }

  // Mode of Travel options
  getModeOfTravelOptions() {
    return [
      { id: 'car', name: 'Car' },
      { id: 'bus', name: 'Bus' },
      { id: 'train', name: 'Train' },
      { id: 'plane', name: 'Plane' },
      { id: 'walking', name: 'Walking' },
    ];
  }

  // Fetch Expense Reports
  async getExpenseReports(_filters?: ReportFilter): Promise<ExpenseReport[]> {
    // Mock implementation - replace with actual API call
    const mockData: ExpenseReport[] = [
      {
        id: '1',
        salesRep: 'Jacob Jones',
        attachment: 'PDF',
        expense_category: 'Food',
        total_amount: '95 MB',
        date: '2024-01-15',
        status: 'approved'
      },
      {
        id: '2',
        salesRep: 'Bessie Cooper',
        attachment: 'PDF',
        expense_category: 'Travel',
        total_amount: '5.1 MB',
        date: '2024-01-14',
        status: 'pending'
      },
      // Add more mock data as needed
    ];

    // Apply filters (mock implementation)
    return mockData.filter(report => {
      if (_filters?.salesRep && !report.salesRep.toLowerCase().includes(_filters.salesRep.toLowerCase())) {
        return false;
      }
      if (_filters?.category && !report.expense_category.toLowerCase().includes(_filters.category.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  // Fetch Customer Reports
  async getCustomerReports(_filters?: ReportFilter): Promise<CustomerReport[]> {
    // Mock implementation
    return [
      {
        id: 1,
        name: "Monthly Customer Summary - January 2024",
        totalCustomers: 150,
        newCustomers: 25,
        topIndustries: "Technology 60%",
        status: "Complete",
        timeTracking: "85%",
        generatedDate: "2024-01-15"
      },
      {
        id: 2,
        name: "Customer Acquisition Report",
        totalCustomers: 75,
        newCustomers: 15,
        topIndustries: "Healthcare 40%",
        status: "Pending",
        timeTracking: "60%",
        generatedDate: "2024-01-14"
      }
    ];
  }

  // Fetch Field Activity Reports
  async getFieldActivityReports(_filters?: ReportFilter): Promise<FieldActivityReport[]> {
    return [
      {
        id: 1,
        salesRep: 'Jacinda Jones',
        date: '20/09/2025',
        territory: 'North Region',
        mode: 'Bus',
        amount: 3200,
        avatar: '👩‍💼'
      },
      {
        id: 2,
        salesRep: 'Boston Cooper',
        date: '20/09/2025',
        territory: 'Downtown District',
        mode: 'Car',
        amount: 2200,
        avatar: '👨‍💼'
      }
    ];
  }

  // Generate Report
  async generateReport(reportType: string, _filters: ReportFilter): Promise<{ success: boolean; reportId?: string; message: string }> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          reportId: `report_${Date.now()}`,
          message: `${reportType} report generated successfully`
        });
      }, 500); // Reduced API delay for better performance
    });
  }

  // Export Report
  async exportReport(reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<{ success: boolean; downloadUrl?: string; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          downloadUrl: `/api/reports/export/${reportId}.${format}`,
          message: `Report exported as ${format.toUpperCase()}`
        });
      }, 300); // Reduced delay for better performance
    });
  }
}

export const reportsAPI = new ReportsAPI();