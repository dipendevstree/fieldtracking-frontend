export interface VisitMarker {
  visitId: string;
  lat: number;
  lng: number;
  purpose: string;
  companyName: string;
  checkInTime: string;
  checkOutTime: string;
  duration: number;
  address: string;
}

export interface IdleMarker {
  id: string;
  lat: number;
  lng: number;
  startTime: string;
  endTime: string;
  duration: string;
  address: string;
}

export interface BreakMarker {
  id: string;
  lat: number;
  lng: number;
  startTime: string;
  endTime: string;
  duration: string;
  type: string;
  address: string;
}

export interface UserTrackingTimelineProps {
  userId: any;
  setPath: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; row?: any }[]>
  >;
  setCurrentPosition: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setVisitMarkers: React.Dispatch<React.SetStateAction<VisitMarker[]>>;
  setBreakMarkers: React.Dispatch<React.SetStateAction<BreakMarker[]>>;
  setIdleMarkers: React.Dispatch<React.SetStateAction<IdleMarker[]>>;
  onBack?: () => void;
}

export interface UserPolylineMapProps {
  path: { lat: number; lng: number; row?: any }[];
  currentPosition: { lat: number; lng: number } | null;
  selectedUser: any;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  visitMarkers?: VisitMarker[];
  breakMarkers?: BreakMarker[];
  idleMarkers?: IdleMarker[];
}

export interface MapMarkerWithInfoProps {
  id: string;
  type: string;
  position: google.maps.LatLngLiteral;
  icon: any;
  activeItem: { id: string; type: string } | null;
  onMarkerClick: (
    id: string,
    type: string,
    e: google.maps.MapMouseEvent,
  ) => void;
  onClose: () => void;
  infoTitle: string;
  details: { label: string; value: string }[];
  children?: React.ReactNode;
  zIndex?: number;
}

export type PathPoint = { lat: number; lng: number; row?: any };

export interface VisitSegment {
  label: string;
  path: PathPoint[];
}
