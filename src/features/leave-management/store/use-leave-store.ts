import { create } from "zustand";
import { EmployeeTier, HolidayTemplate, LeaveRules } from "../data/schema";

export interface LeaveRequest {
  id: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}

interface LeaveState {
  holidayTemplates: HolidayTemplate[];
  leaveRules: LeaveRules;
  employeeTiers: EmployeeTier[];
  leaveRequests: LeaveRequest[];

  // Actions

  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequest: (id: string, request: Partial<LeaveRequest>) => void;
  deleteLeaveRequest: (id: string) => void;

  addHolidayTemplate: (template: HolidayTemplate) => void;
  updateHolidayTemplate: (
    id: string,
    template: Partial<HolidayTemplate>
  ) => void;
  deleteHolidayTemplate: (id: string) => void;

  addHolidayToTemplate: (templateId: string, holiday: any) => void;
  updateHolidayInTemplate: (
    templateId: string,
    holidayId: string,
    data: any
  ) => void;
  deleteHolidayFromTemplate: (templateId: string, holidayId: string) => void;

  updateLeaveRules: (rules: Partial<LeaveRules>) => void;

  addEmployeeTier: (tier: EmployeeTier) => void;
  updateEmployeeTier: (id: string, tier: Partial<EmployeeTier>) => void;
  deleteEmployeeTier: (id: string) => void;
}

const currentYear = new Date().getFullYear();

const INITIAL_HOLIDAYS: HolidayTemplate[] = [
  {
    id: "default-template",
    name: "General Holidays",
    region: "National",
    description: "Standard list",
    holidays: [
      {
        id: "h1",
        name: "New Year's Day",
        date: new Date(currentYear, 0, 1),
        type: "National",
      },
      {
        id: "h2",
        name: "Republic Day",
        date: new Date(currentYear, 0, 26),
        type: "National",
      },
      {
        id: "h3",
        name: "Independence Day",
        date: new Date(currentYear, 7, 15),
        type: "National",
      },
      {
        id: "h4",
        name: "Gandhi Jayanti",
        date: new Date(currentYear, 9, 2),
        type: "National",
      },
      {
        id: "h5",
        name: "Christmas",
        date: new Date(currentYear, 11, 25),
        type: "National",
      },
    ],
  },
];

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "lr1",
    leaveTypeId: "1",
    startDate: new Date(currentYear, new Date().getMonth(), 10),
    endDate: new Date(currentYear, new Date().getMonth(), 12),
    status: "Approved",
    reason: "Vacation",
  },
];

export const useLeaveStore = create<LeaveState>((set) => ({
  holidayTemplates: INITIAL_HOLIDAYS,
  leaveRules: {
    sandwich: { enabled: true, maxDays: 2 },
    carryForward: { enabled: true, maxDays: 10, expiryMonths: 3 },
    encashment: { enabled: true, maxDays: 15, minBalance: 5 },
  },
  employeeTiers: [],
  leaveRequests: INITIAL_LEAVE_REQUESTS,

  // leave type CRUD now handled via API hooks. Keep store focused on local-only state.

  addLeaveRequest: (request) =>
    set((state) => ({
      leaveRequests: [
        ...state.leaveRequests,
        { ...request, id: crypto.randomUUID() },
      ],
    })),
  updateLeaveRequest: (id, data) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((r) =>
        r.id === id ? { ...r, ...data } : r
      ),
    })),
  deleteLeaveRequest: (id) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.filter((r) => r.id !== id),
    })),

  addHolidayTemplate: (template) =>
    set((state) => ({
      holidayTemplates: [
        ...state.holidayTemplates,
        { ...template, id: crypto.randomUUID() },
      ],
    })),
  updateHolidayTemplate: (id, template) =>
    set((state) => ({
      holidayTemplates: state.holidayTemplates.map((t) =>
        t.id === id ? { ...t, ...template } : t
      ),
    })),
  deleteHolidayTemplate: (id) =>
    set((state) => ({
      holidayTemplates: state.holidayTemplates.filter((t) => t.id !== id),
    })),

  addHolidayToTemplate: (templateId, holiday) =>
    set((state) => ({
      holidayTemplates: state.holidayTemplates.map((t) =>
        t.id === templateId
          ? {
              ...t,
              holidays: [
                ...t.holidays,
                { ...holiday, id: crypto.randomUUID() },
              ],
            }
          : t
      ),
    })),
  updateHolidayInTemplate: (templateId, holidayId, data) =>
    set((state) => ({
      holidayTemplates: state.holidayTemplates.map((t) =>
        t.id === templateId
          ? {
              ...t,
              holidays: t.holidays.map((h) =>
                h.id === holidayId ? { ...h, ...data } : h
              ),
            }
          : t
      ),
    })),
  deleteHolidayFromTemplate: (templateId, holidayId) =>
    set((state) => ({
      holidayTemplates: state.holidayTemplates.map((t) =>
        t.id === templateId
          ? { ...t, holidays: t.holidays.filter((h) => h.id !== holidayId) }
          : t
      ),
    })),

  updateLeaveRules: (rules) =>
    set((state) => ({ leaveRules: { ...state.leaveRules, ...rules } })),
  addEmployeeTier: (tier) =>
    set((state) => ({
      employeeTiers: [
        ...state.employeeTiers,
        { ...tier, id: crypto.randomUUID() },
      ],
    })),
  updateEmployeeTier: (id, tier) =>
    set((state) => ({
      employeeTiers: state.employeeTiers.map((t) =>
        t.id === id ? { ...t, ...tier } : t
      ),
    })),
  deleteEmployeeTier: (id) =>
    set((state) => ({
      employeeTiers: state.employeeTiers.filter((t) => t.id !== id),
    })),
}));
