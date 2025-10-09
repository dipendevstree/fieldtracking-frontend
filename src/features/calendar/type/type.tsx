export interface Territory {
  id?: string;
  territory: string;
  createdAt?: string;
  updatedAt?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface ScheduleVisitFormProps {
  onClose?: () => void;
}

export interface Visit {
  id: string;
  visitId?: string;
  salesRepresentativeUser: {
    id: string;
    firstName: string;
    lastName: string;
    roleId?: string;
  };
  customer: { companyName: string } | string;
  contact: string;
  date: string;
  time: string;
  purpose: string;
  location: string;
  status: string;
  priority: string;
}

export interface MappedVisit {
  id: string;
  rep: string;
  salesRepId: string;
  roleId?: string;
  customer: string;
  contact: string;
  date: string;
  time: string;
  purpose: string;
  location: string;
  status: string;
  priority: string;
  originalVisit: Visit;
}

export interface DeleteVisitDialogProps {
  visit: MappedVisit | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface TopUsers {
  id: string,
  name: string,
  profileUrl: string,
  visitCount: number
}

export interface VisitEmployeeAnalytics {
  avgSatisfaction: string
  avgVisitDuration: string
  cancelledVisits: string
  followupRate: string
  rescheduledVisits: number
  successRate: string
  successVisits: number
  topUsers: TopUsers[]
  totalVisitsCount: number
}