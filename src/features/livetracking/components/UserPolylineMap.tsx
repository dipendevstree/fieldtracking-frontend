import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import {
  getStartPointMarkerIcon,
  getUserIconMarker,
  isValidLatLng,
} from "../data/commonFunction";

interface UserPolylineMapProps {
  mapCenter: { lat: number; lng: number };
  path: { lat: number; lng: number }[];
  currentPosition: { lat: number; lng: number } | null;
  selectedUser: any;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

const containerStyle = {
  width: "100%",
  height: "60vh",
  borderRadius: "7px",
  overflow: "hidden",
};

const polylineOptions = {
  strokeColor: "#00AD34",
  strokeOpacity: 1,
  strokeWeight: 3,
};

export default function UserPolylineMap({
  mapCenter,
  path,
  currentPosition,
  selectedUser,
  mapRef,
}: UserPolylineMapProps) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={17}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
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
    </GoogleMap>
  );
}
