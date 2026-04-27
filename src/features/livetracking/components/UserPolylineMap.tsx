import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import {
  Marker,
  Polyline,
  Circle,
  InfoWindow,
  useGoogleMap,
} from "@react-google-maps/api";
import { formatDate } from "date-fns";
import {
  BREAK_MARKER_ICON,
  visitOverCircleOptions,
  DEBUG_MARKER_ICON,
  DEFAULT_COLORS,
  getStartPointMarkerIcon,
  getUserIconMarker,
  IDLE_MARKER_ICON,
  isValidLatLng,
  VISIT_MARKER_ICON,
  getPolylineOptions,
  InfoWindowContent,
} from "../data/commonFunction";
import { UserPolylineMapProps } from "../types";

const MAP_CONFIG = {
  showDebugPath: false,
  showIdleMarkers: false,
  showBreakMarkers: false,
};

export default function UserPolylineMap({
  path,
  currentPosition,
  selectedUser,
  visitMarkers = [],
  idleMarkers = [],
  breakMarkers = [],
}: UserPolylineMapProps) {
  const map = useGoogleMap();
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [activeItem, setActiveItem] = useState<{
    id: string;
    type: string;
  } | null>(null);

  const isDebugPathEnabled = MAP_CONFIG.showDebugPath;
  const activeColor =
    isDebugPathEnabled && isHighlighted
      ? DEFAULT_COLORS.active
      : DEFAULT_COLORS.normal;

  // 1. Memoized Options
  const polylineOptions = useMemo(
    () => getPolylineOptions(isDebugPathEnabled && isHighlighted),
    [isDebugPathEnabled, isHighlighted],
  );

  // 2. Memoized Event Handlers
  const handleMarkerClick = useCallback(
    (id: string, type: string, e: google.maps.MapMouseEvent) => {
      if (e.stop) e.stop();
      setActiveItem((prev) => (prev?.id === id ? null : { id, type }));
    },
    [],
  );

  const closeInfoWindow = useCallback(() => setActiveItem(null), []);

  useEffect(() => {
    if (!map) return;
    const clickListener = map.addListener("click", closeInfoWindow);
    return () => google.maps.event.removeListener(clickListener);
  }, [map, closeInfoWindow]);

  return (
    <>
      {/* 🏁 Start Point */}
      {path[0] && (
        <Marker
          position={path[0]}
          icon={getStartPointMarkerIcon(
            selectedUser?.fullName || "",
            activeColor,
          )}
          zIndex={10}
        />
      )}

      {/* 📍 Live Position */}
      {currentPosition && isValidLatLng(currentPosition) && (
        <Marker
          position={currentPosition}
          icon={getUserIconMarker(activeColor)}
          title="Live Position"
          zIndex={100} // Always on top
        />
      )}

      {/* Debug Markers (only shown when highlighed) */}
      {isDebugPathEnabled &&
        isHighlighted &&
        path.map((point, index) => (
          <Marker
            key={`debug-${index}`}
            position={point}
            icon={DEBUG_MARKER_ICON}
            zIndex={1}
            title={`ID: ${point.row?._id ?? index}${point.row?.speed ? ` | Spd: ${point.row?.speed}` : ""}`}
          />
        ))}

      {/* 🟠 Idle Markers */}
      {MAP_CONFIG.showIdleMarkers &&
        idleMarkers.map((idle) => (
          <MapMarkerWithInfo
            key={idle.id}
            id={idle.id}
            type="idle"
            position={{ lat: idle.lat, lng: idle.lng }}
            icon={IDLE_MARKER_ICON}
            activeItem={activeItem}
            onMarkerClick={handleMarkerClick}
            onClose={closeInfoWindow}
            infoTitle="Idle Details"
            details={[
              { label: "Duration", value: idle.duration },
              { label: "From", value: formatDate(idle.startTime, "hh:mm a") },
              { label: "To", value: formatDate(idle.endTime, "hh:mm a") },
              { label: "Address", value: idle.address },
            ]}
          />
        ))}

      {/* 🟡 Break Markers */}
      {MAP_CONFIG.showBreakMarkers &&
        breakMarkers.map((brk) => (
          <MapMarkerWithInfo
            key={brk.id}
            id={brk.id}
            type="break"
            position={{ lat: brk.lat, lng: brk.lng }}
            icon={BREAK_MARKER_ICON}
            activeItem={activeItem}
            onMarkerClick={handleMarkerClick}
            onClose={closeInfoWindow}
            infoTitle={"Break Details"}
            details={[
              { label: "Type", value: brk.type },
              { label: "From", value: formatDate(brk.startTime, "hh:mm a") },
              {
                label: "To",
                value: brk.endTime
                  ? formatDate(brk.endTime, "hh:mm a")
                  : "Ongoing",
              },
              { label: "Address", value: brk.address },
            ]}
          />
        ))}

      {/* 🔵 Visit Markers */}
      {visitMarkers.map((visit) => (
        <MapMarkerWithInfo
          key={visit.visitId}
          id={visit.visitId}
          type="visit"
          position={{ lat: visit.lat, lng: visit.lng }}
          icon={VISIT_MARKER_ICON}
          activeItem={activeItem}
          onMarkerClick={handleMarkerClick}
          onClose={closeInfoWindow}
          infoTitle={"Visit Details"}
          details={[
            { label: "Company", value: visit.companyName },
            { label: "Purpose", value: visit.purpose },
            {
              label: "Check-in",
              value: formatDate(visit.checkInTime, "dd-MM-yyyy hh:mm a"),
            },
            {
              label: "Check-out",
              value: formatDate(visit.checkOutTime, "dd-MM-yyyy hh:mm a"),
            },
            { label: "Duration", value: `${visit.duration} hr` },
            { label: "Address", value: visit.address },
          ]}
        >
          <Circle
            center={{ lat: visit.lat, lng: visit.lng }}
            radius={100}
            options={visitOverCircleOptions}
          />
        </MapMarkerWithInfo>
      ))}

      <Polyline
        path={path}
        options={polylineOptions}
        onClick={
          isDebugPathEnabled
            ? () => {
                setIsHighlighted(!isHighlighted);
                closeInfoWindow();
              }
            : undefined
        }
      />
      <style>{`
        /* Custom styles for InfoWindow */
        .gm-style-iw-ch {
          font-weight: bold !important;
        }
      `}</style>
    </>
  );
}

// Internal Helper to keep things DRY
function MapMarkerWithInfo({
  id,
  type,
  position,
  icon,
  activeItem,
  onMarkerClick,
  onClose,
  infoTitle,
  details,
  children,
  zIndex = 5,
}: any) {
  return (
    <Fragment>
      {children}
      <Marker
        position={position}
        icon={icon}
        onClick={(e) => onMarkerClick(id, type, e)}
        zIndex={zIndex}
      >
        {activeItem?.id === id && activeItem.type === type && (
          <InfoWindow
            onCloseClick={onClose}
            options={{ headerContent: infoTitle }}
          >
            <InfoWindowContent details={details} />
          </InfoWindow>
        )}
      </Marker>
    </Fragment>
  );
}
