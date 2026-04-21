import { Fragment, useState } from "react";
import { Marker, Polyline, Circle } from "@react-google-maps/api";
import {
  DEFAULT_COLORS,
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
  path: { lat: number; lng: number; row?: any }[];
  currentPosition: { lat: number; lng: number } | null;
  selectedUser: any;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  visitMarkers?: VisitMarker[];
}

const getPolylineOptions = (isHighlighted: boolean) => ({
  strokeColor: isHighlighted ? DEFAULT_COLORS.active : DEFAULT_COLORS.normal,
  strokeOpacity: 1,
  strokeWeight: isHighlighted ? 6 : 3,
  geodesic: true,
  icons: [
    {
      icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        fillColor: isHighlighted
          ? DEFAULT_COLORS.active
          : DEFAULT_COLORS.normal,
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        scale: 3,
      },
      offset: "0",
      repeat: "100px",
    },
  ],
});

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
  const [isHighlighted, setIsHighlighted] = useState(false);
  const activeColor = isHighlighted
    ? DEFAULT_COLORS.active
    : DEFAULT_COLORS.normal;

  return (
    <>
      {path[0] && (
        <Marker
          position={path[0]}
          icon={getStartPointMarkerIcon(
            selectedUser?.fullName || "",
            activeColor,
          )}
          title={selectedUser?.fullName || ""}
        />
      )}

      {currentPosition && isValidLatLng(currentPosition) && (
        <Marker
          position={currentPosition}
          icon={getUserIconMarker(activeColor)}
          title="Live Position"
        />
      )}

      {/* 🟢 Path Points Markers (Debug info) - Visible only when highlighted */}
      {isHighlighted &&
        path.map((point, index) => (
          <Marker
            key={`point-${index}`}
            position={point}
            title={`ID: ${point.row?._id ?? index}${
              point.row?.speed ? ` | Speed: ${point.row?.speed}` : ""
            }${point.row?.date ? ` | Time: ${point.row?.date}` : ""}`}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 4,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: "#ffffff",
            }}
          />
        ))}

      {/* 🟣 Visit Markers and Geofence Radius */}
      {visitMarkers.map((visit) => {
        const position = { lat: visit.lat, lng: visit.lng };
        return (
          <Fragment key={visit.visitId}>
            <Circle center={position} radius={200} options={circleOptions} />
            <Marker position={position} title={`Visit - ${visit.purpose}`} />
          </Fragment>
        );
      })}

      <Polyline
        path={path}
        options={getPolylineOptions(isHighlighted)}
        onClick={() => setIsHighlighted(!isHighlighted)}
      />
    </>
  );
}
