import { Marker, Polyline } from "@react-google-maps/api";
import {
  getStartPointMarkerIcon,
  getUserIconMarker,
  isValidLatLng,
} from "../data/commonFunction";

interface UserPolylineMapProps {
  path: { lat: number; lng: number }[];
  currentPosition: { lat: number; lng: number } | null;
  selectedUser: any;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

const polylineOptions = {
  strokeColor: "#00AD34",
  strokeOpacity: 1,
  strokeWeight: 3,
};

export default function UserPolylineMap({
  path,
  currentPosition,
  selectedUser,
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
      <Polyline path={path} options={polylineOptions} />
    </>
  );
}
