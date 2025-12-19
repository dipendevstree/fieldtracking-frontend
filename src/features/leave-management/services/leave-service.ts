import { HolidayTemplate, LeaveRules, LeaveType } from "../data/schema";

// Mock Service - In a real app, this would use Axios to call the backend
export const LeaveService = {
  getLeaveTypes: async (): Promise<LeaveType[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return []; // In real app, fetch from network
  },

  saveLeaveType: async (leave: LeaveType): Promise<LeaveType> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return leave;
  },

  getHolidayTemplates: async (): Promise<HolidayTemplate[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [];
  },

  saveHolidayTemplate: async (
    template: HolidayTemplate
  ): Promise<HolidayTemplate> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return template;
  },

  getLeaveRules: async (): Promise<LeaveRules> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      sandwich: { enabled: true, maxDays: 2 },
      carryForward: { enabled: true, maxDays: 10, expiryMonths: 3 },
      encashment: { enabled: true, maxDays: 15, minBalance: 5 },
    };
  },
};
