import { useState } from "react";
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
  const [showLabels, setShowLabels] = useState(false); // 🔘 Toggle state

  return (
    <>
      {/* 🟢 Toggle Button */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "182px",
          backgroundColor: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <input
            type="checkbox"
            checked={showLabels}
            onChange={() => setShowLabels((prev) => !prev)}
          />
          {path.length}
        </label>
      </div>

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

      {/* 🟢 Show trail dots only if toggle is ON */}
      {showLabels &&
        path.slice(0, -1).map(
          (pos, idx) =>
            isValidLatLng(pos) && (
              <Marker
                key={idx}
                position={pos}
                label={{
                  text: `${idx + 1}`,
                  color: "#0000FF",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  console.log("Trail Point", pos);
                }}
              />
            )
        )}

      <Polyline path={path} options={polylineOptions} />
    </>
  );
}
