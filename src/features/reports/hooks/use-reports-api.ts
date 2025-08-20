import { useState, useEffect, useMemo } from 'react';
import { reportsAPI, type SalesRep, type ExpenseCategory, type Industry, type Territory, type ReportFilter, type ExpenseReport, type CustomerReport, type FieldActivityReport } from '../services/reports-api';

// Hook for fetching sales representatives
export function useSalesReps() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        setLoading(true);
        const data = await reportsAPI.getSalesReps();
        setSalesReps(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch sales representatives');
        console.error('Error fetching sales reps:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReps();
  }, []);

  return { salesReps, loading, error };
}

// Hook for fetching expense categories
export function useExpenseCategories() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await reportsAPI.getExpenseCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch expense categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

// Hook for fetching industries
export function useIndustries() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        const data = await reportsAPI.getIndustries();
        setIndustries(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch industries');
        console.error('Error fetching industries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  return { industries, loading, error };
}

// Hook for fetching territories
export function useTerritories() {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerritories = async () => {
      try {
        setLoading(true);
        const data = await reportsAPI.getTerritories();
        setTerritories(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch territories');
        console.error('Error fetching territories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerritories();
  }, []);

  return { territories, loading, error };
}

// Hook for fetching expense reports with filters
export function useExpenseReports(filters?: ReportFilter) {
  const [reports, setReports] = useState<ExpenseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize filters to prevent infinite re-renders
  const memoizedFilters = useMemo(() => {
    if (!filters) return undefined;
    return {
      dateRange: filters.dateRange,
      salesRep: filters.salesRep,
      category: filters.category,
      industry: filters.industry,
      territory: filters.territory,
      status: filters.status,
    };
  }, [
    filters?.dateRange?.from,
    filters?.dateRange?.to,
    filters?.salesRep,
    filters?.category,
    filters?.industry,
    filters?.territory,
    filters?.status,
  ]);

  const fetchReports = async (currentFilters?: ReportFilter) => {
    try {
      setLoading(true);
      const data = await reportsAPI.getExpenseReports(currentFilters);
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expense reports');
      console.error('Error fetching expense reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(memoizedFilters);
  }, [memoizedFilters]);

  const refetch = (newFilters?: ReportFilter) => {
    fetchReports(newFilters);
  };

  return { reports, loading, error, refetch };
}

// Hook for fetching customer reports
export function useCustomerReports(filters?: ReportFilter) {
  const [reports, setReports] = useState<CustomerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize filters to prevent infinite re-renders
  const memoizedFilters = useMemo(() => {
    if (!filters) return undefined;
    return {
      dateRange: filters.dateRange,
      salesRep: filters.salesRep,
      category: filters.category,
      industry: filters.industry,
      territory: filters.territory,
      status: filters.status,
    };
  }, [
    filters?.dateRange?.from,
    filters?.dateRange?.to,
    filters?.salesRep,
    filters?.category,
    filters?.industry,
    filters?.territory,
    filters?.status,
  ]);

  const fetchReports = async (currentFilters?: ReportFilter) => {
    try {
      setLoading(true);
      const data = await reportsAPI.getCustomerReports(currentFilters);
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customer reports');
      console.error('Error fetching customer reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(memoizedFilters);
  }, [memoizedFilters]);

  const refetch = (newFilters?: ReportFilter) => {
    fetchReports(newFilters);
  };

  return { reports, loading, error, refetch };
}

// Hook for fetching field activity reports
export function useFieldActivityReports(filters?: ReportFilter) {
  const [reports, setReports] = useState<FieldActivityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize filters to prevent infinite re-renders
  const memoizedFilters = useMemo(() => {
    if (!filters) return undefined;
    return {
      dateRange: filters.dateRange,
      salesRep: filters.salesRep,
      category: filters.category,
      industry: filters.industry,
      territory: filters.territory,
      status: filters.status,
    };
  }, [
    filters?.dateRange?.from,
    filters?.dateRange?.to,
    filters?.salesRep,
    filters?.category,
    filters?.industry,
    filters?.territory,
    filters?.status,
  ]);

  const fetchReports = async (currentFilters?: ReportFilter) => {
    try {
      setLoading(true);
      const data = await reportsAPI.getFieldActivityReports(currentFilters);
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch field activity reports');
      console.error('Error fetching field activity reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(memoizedFilters);
  }, [memoizedFilters]);

  const refetch = (newFilters?: ReportFilter) => {
    fetchReports(newFilters);
  };

  return { reports, loading, error, refetch };
}

// Hook for report generation
export function useReportGeneration() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (reportType: string, filters: ReportFilter) => {
    try {
      setGenerating(true);
      setError(null);
      const result = await reportsAPI.generateReport(reportType, filters);
      return result;
    } catch (err) {
      setError('Failed to generate report');
      console.error('Error generating report:', err);
      return { success: false, message: 'Failed to generate report' };
    } finally {
      setGenerating(false);
    }
  };

  const exportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      setGenerating(true);
      setError(null);
      const result = await reportsAPI.exportReport(reportId, format);
      return result;
    } catch (err) {
      setError('Failed to export report');
      console.error('Error exporting report:', err);
      return { success: false, message: 'Failed to export report' };
    } finally {
      setGenerating(false);
    }
  };

  return { generateReport, exportReport, generating, error };
}