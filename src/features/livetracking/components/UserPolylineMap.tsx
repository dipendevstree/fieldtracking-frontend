import { Marker, Polyline, Circle } from "@react-google-maps/api";
import {
  getStartPointMarkerIcon,
  getUserIconMarker,
  isValidLatLng,
} from "../data/commonFunction";

export interface VisitMarker {
  visitId: string;
  lat: number;
  lng: number;
  purpose: string;
}

interface UserPolylineMapProps {
  path: { lat: number; lng: number }[];
  currentPosition: { lat: number; lng: number } | null;
  selectedUser: any;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  visitMarkers?: VisitMarker[];
}

const polylineOptions = {
  strokeColor: "#00AD34",
  strokeOpacity: 1,
  strokeWeight: 3,
};

const circleOptions = {
  fillColor: "#0096FF33",
  fillOpacity: 0.35,
  strokeWeight: 1,
  strokeColor: "#0096FFB3",
  clickable: false,
  editable: false,
  zIndex: 1,
};

export default function UserPolylineMap({
  path,
  currentPosition,
  selectedUser,
  visitMarkers = [],
}: UserPolylineMapProps) {
  return (
    <>
      {path[0] && (
        <Marker
          position={path[0]}
          icon={getStartPointMarkerIcon(selectedUser?.fullName || "")}
          title={selectedUser?.fullName || ""}
        />
      )}

      {currentPosition && isValidLatLng(currentPosition) && (
        <Marker
          position={currentPosition}
          icon={getUserIconMarker()}
          title="Live Position"
        />
      )}

      {/* 🟣 Visit Markers and Geofence Radius */}
      {visitMarkers.map((visit) => (
        <div key={`visit_group_${visit.visitId}`}>
          <Circle
            center={{ lat: visit.lat, lng: visit.lng }}
            radius={200}
            options={circleOptions}
          />
          <Marker
            position={{ lat: visit.lat, lng: visit.lng }}
            title={`Visit - ${visit.purpose}`}
          />
        </div>
      ))}

      <Polyline path={path} options={polylineOptions} />
    </>
  );
}
