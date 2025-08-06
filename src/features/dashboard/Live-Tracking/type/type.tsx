export interface LiveTrackingUser {
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  roleId: string;
  roleName: string;
  territoryId?: string;
  territoryName?: string;
  isOnline: boolean;
  lastSeen?: string;
  currentLocation?: {
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp: string;
  };
  status: "active" | "idle" | "offline" | "on_break";
  activityStatus: "working" | "traveling" | "at_customer" | "break" | "offline";
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackingSession {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  path: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    accuracy?: number;
  }>;
  totalDistance?: number; // in meters
  status: "active" | "completed" | "paused";
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackingEvent {
  eventId: string;
  userId: string;
  eventType:
    | "checkin"
    | "checkout"
    | "location_update"
    | "status_change"
    | "geofence_enter"
    | "geofence_exit";
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  timestamp: string;
  metadata?: {
    customerId?: string;
    customerName?: string;
    notes?: string;
    [key: string]: string | number | boolean | undefined;
  };
  createdAt?: string;
}

export interface LiveTrackingStats {
  totalUsers: number;
  onlineUsers: number;
  activeSessions: number;
  totalDistance: number;
  averageSessionDuration: number;
  usersByStatus: {
    active: number;
    idle: number;
    offline: number;
    on_break: number;
  };
  usersByActivity: {
    working: number;
    traveling: number;
    at_customer: number;
    break: number;
    offline: number;
  };
}

export interface TrackingFilter {
  status?: "active" | "idle" | "offline" | "on_break";
  activityStatus?:
    | "working"
    | "traveling"
    | "at_customer"
    | "break"
    | "offline";
  roleId?: string;
  territoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchFor?: string;
  includeLatLong?: boolean;
}
