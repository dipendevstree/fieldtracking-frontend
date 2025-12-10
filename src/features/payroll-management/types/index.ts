export type SalaryComponentType = "EARNING" | "DEDUCTION";

export interface SalaryComponent {
  id: string;
  name: string;
  type: SalaryComponentType;
  amount: number;
  percentage?: number;
  isFixed: boolean;
}

export interface SalaryStructure {
  id: string;
  userId: string;
  ctc: number;
  components: SalaryComponent[];
  effectiveFrom: string;
}

export interface PayrollRun {
  id: string;
  month: number;
  year: number;
  status: "DRAFT" | "PROCESSED" | "PAID";
  totalPayout: number;
  processedOn?: string;
}

export interface Payslip {
  id: string;
  userId: string;
  payrollRunId: string;
  earnings: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  netPay: number;
  generatedOn: string;
}
