import { create } from "zustand";
import {
  EmployeeTier,
  HolidayTemplate,
  LeaveRules,
  Holiday,
} from "../data/schema";

export interface LeaveRequest {
  id: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}

interface LeaveState {
  holidays: Holiday[];
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

  addHoliday: (holiday: Holiday) => void;
  updateHoliday: (id: string, holiday: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;

  addHolidayToTemplate: (templateId: string, holidayId: string) => void;
  updateHolidayInTemplate: (templateId: string, holidayId: string) => void;
  deleteHolidayFromTemplate: (templateId: string, holidayId: string) => void;

  updateLeaveRules: (rules: Partial<LeaveRules>) => void;

  addEmployeeTier: (tier: EmployeeTier) => void;
  updateEmployeeTier: (id: string, tier: Partial<EmployeeTier>) => void;
  deleteEmployeeTier: (id: string) => void;
}

const currentYear = new Date().getFullYear();

const INITIAL_HOLIDAY_LIST: Holiday[] = [
  {
    id: "h1",
    name: "New Year's Day",
    date: new Date(currentYear, 0, 1),
    type: "National",
    holidayTemplateId: ["default-template"],
  },
  {
    id: "h2",
    name: "Republic Day",
    date: new Date(currentYear, 0, 26),
    type: "National",
    holidayTemplateId: ["default-template"],
  },
  {
    id: "h3",
    name: "Independence Day",
    date: new Date(currentYear, 7, 15),
    type: "National",
    holidayTemplateId: ["default-template"],
  },
  {
    id: "h4",
    name: "Gandhi Jayanti",
    date: new Date(currentYear, 9, 2),
    type: "National",
    holidayTemplateId: ["default-template"],
  },
  {
    id: "h5",
    name: "Christmas",
    date: new Date(currentYear, 11, 25),
    type: "National",
    holidayTemplateId: ["default-template"],
  },
];

const INITIAL_HOLIDAY_TEMPLATES: HolidayTemplate[] = [
  {
    id: "default-template",
    name: "General Holidays",
    region: "National",
    description: "Standard list",
    holidayIds: INITIAL_HOLIDAY_LIST.map((h) => h.id),
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
  holidays: INITIAL_HOLIDAY_LIST,
  holidayTemplates: INITIAL_HOLIDAY_TEMPLATES,
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
  addHoliday: (holiday) =>
    set((state) => ({
      holidays: [...state.holidays, { ...holiday, id: crypto.randomUUID() }],
    })),
  updateHoliday: (id, holiday) =>
    set((state) => ({
      holidays: state.holidays.map((h) =>
        h.id === id ? { ...h, ...holiday } : h
      ),
    })),
  deleteHoliday: (id) =>
    set((state) => ({
      holidays: state.holidays.filter((h) => h.id !== id),
      holidayTemplates: state.holidayTemplates.map((t) => ({
        ...t,
        holidayIds: t.holidayIds.filter((hid) => hid !== id),
      })),
    })),

  addHolidayToTemplate: (templateId, holidayId) =>
    set((state) => ({
      holidayTemplates: state.holidayTemplates.map((t) =>
        t.id === templateId
          ? { ...t, holidayIds: [...t.holidayIds, holidayId] }
          : t
      ),
    })),
  updateHolidayInTemplate: () =>
    // templates now only reference ids; updating holiday details is handled by updateHoliday
    set((state) => ({ ...state })),
  deleteHolidayFromTemplate: (templateId, holidayId) =>
    set((state) => ({
      holidayTemplates: state.holidayTemplates.map((t) =>
        t.id === templateId
          ? {
              ...t,
              holidayIds: t.holidayIds.filter((hid) => hid !== holidayId),
            }
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
