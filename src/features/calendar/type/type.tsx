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
    profileUrl?: string | null;
  };
  customer: { companyName: string } | string;
  contact: string;
  date: string;
  time: string;
  purpose: string;
  location: string;
  status: string;
  priority: string;
  checkInImageUrl: string;
}

export interface MappedVisit {
  id: string;
  rep: string;
  firstName: string;
  lastName: string;
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
  checkInImageUrl: string;
  profileUrl?: string | null;
}

export interface DeleteVisitDialogProps {
  visit: MappedVisit | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface TopUsers {
  id: string;
  name: string;
  profileUrl: string;
  visitCount: number;
}

export interface VisitEmployeeAnalytics {
  avgSatisfaction: string;
  avgVisitDuration: string;
  cancelledVisits: string;
  followupRate: string;
  rescheduledVisits: number;
  successRate: string;
  successVisits: number;
  topUsers: TopUsers[];
  totalVisitsCount: number;
}

export interface Analytics {
  totalVisits: number;
  pending: number;
  completed: number;
  cancel: number;
}

export interface FormData {
  roleId: string;
  salesRep: string;
  search: string;
  territoryId: string;
  customerId: string;
  priority: string;
  status: string;
}

export interface DeleteVisitDialogProps {
  visit: MappedVisit | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface SalesRepresentativeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileUrl: string | null;
}

export interface Customer {
  customerId: string;
  companyName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  country: string;
}

export interface VisitReport {
  visitId: string;
  date: string;
  time: string;
  duration: number;
  purpose: string;
  status: string;
  priority: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  checkinAddress: string;
  checkoutAddress: string;
  visitCheckInTime: string;
  visitCheckOutTime: string;
  checkInImageUrl: string;
  meetingNotes: string;
  preparationNotes: string;
  meetingOutcomes: string[];
  nextActions: string;
  followUpDate: string;
  isCheckInLate: boolean;
  isVisitNotCompletedOnTime: boolean;
  feedBackSalesSkillsAndKnowledgeRating: number;
  feedBackSalesRepPunctualityRating: number;
  feedBackSalesRepBehaviorRating: number;
  feedBackDescription: string;
  salesRepresentativeUser: SalesRepresentativeUser;
  customer: Customer;
  checkOutFilesUrl: string[];
}
