export interface Plan {
  id: string;
  name: string;
  planType: string;
  pricePerUser: string;
  gstPercent: string;
  totalDays: number;
  gracePeriodDays: number;
  isActive: boolean;
  createdBy: string;
  updatedBy: string | null;
  createdDate: string;
  modifiedDate: string;
  deletedDate: string | null;
}

export interface PlanHistory {
  id: string;
  organizationId: string;
  planId: string;
  planType: string;
  status: string;
  totalUser: number;
  pricePerUser: string;
  gstPercent: string;
  baseAmount: string;
  gstAmount: string;
  totalAmount: string;
  frequency: string;
  planStartDate: string;
  planEndDate: string;
  gracePeriodEndDate: string;
  activatedBy: string;
  activatedDate: string;
  suspendedBy: string | null;
  suspendedDate: string | null;
  suspendReason: string | null;
  notes: string;
  createdDate: string;
  modifiedDate: string;
  deletedDate: string | null;
  plan: Plan;
}
