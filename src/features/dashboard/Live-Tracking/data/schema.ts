// Live tracking doesn't require form schemas as it's primarily for viewing data
// This file is kept for potential future form schemas if needed

export const liveTrackingFilterSchema = {
  status: 'active' | 'idle' | 'offline' | 'on_break',
  activityStatus: 'working' | 'traveling' | 'at_customer' | 'break' | 'offline',
  roleId: 'string',
  territoryId: 'string',
  dateFrom: 'string',
  dateTo: 'string',
  searchFor: 'string',
}
