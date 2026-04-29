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
  DEFAULT_COLORS,
  getStartPointMarkerIcon,
  getUserIconMarker,
  IDLE_MARKER_ICON,
  isValidLatLng,
  VISIT_MARKER_ICON,
  getPolylineOptions,
  InfoWindowContent,
  buildVisitSegments,
  // DEBUG_MARKER_ICON,
} from "../data/commonFunction";
import { MapMarkerWithInfoProps, UserPolylineMapProps } from "../types";

// markers hide and show config
const MAP_CONFIG = {
  showIdleMarkers: false,
  showBreakMarkers: false,
} as const;

export default function UserPolylineMap({
  path,
  currentPosition,
  selectedUser,
  visitMarkers = [],
  idleMarkers = [],
  breakMarkers = [],
}: UserPolylineMapProps) {
  const map = useGoogleMap();

  const [activeItem, setActiveItem] = useState<{
    id: string;
    type: string;
  } | null>(null);

  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(
    null,
  );

  // const [showPathDebugPoints, setShowDebugPathPoints] = useState(false);

  const polylineOptions = useMemo(() => getPolylineOptions(false), []);

  const handleMarkerClick = useCallback(
    (id: string, type: string, e: google.maps.MapMouseEvent) => {
      e.stop?.();
      setActiveItem((prev) => (prev?.id === id ? null : { id, type }));
    },
    [],
  );

  const closeAll = useCallback(() => {
    setActiveItem(null);
    setActiveSegmentIndex(null);
  }, []);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener("click", closeAll);
    return () => google.maps.event.removeListener(listener);
  }, [map, closeAll]);

  const visitSegments = useMemo(
    () => buildVisitSegments(visitMarkers, path),
    [visitMarkers, path],
  );

  return (
    <>
      {/* Toggle Button for Path Points (For Debugging) */}
      {/* {path.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 60,
            zIndex: 1000,
            background: "white",
            padding: "8px 10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            borderRadius: 2,
          }}
        >
          <label
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <input
              type="checkbox"
              checked={showPathDebugPoints}
              onChange={(e) => setShowDebugPathPoints(e.target.checked)}
            />
            <span>Debug Path</span>
          </label>
        </div>
      )} */}

      {/* Debug Path Points */}
      {/* {showPathDebugPoints &&
        path.map((point, index) => {
          if (!isValidLatLng(point)) return null;

          return (
            <MapMarkerWithInfo
              key={`path-point-${index}`}
              id={`path-${index}`}
              type="path"
              position={point}
              icon={DEBUG_MARKER_ICON}
              activeItem={activeItem}
              onMarkerClick={handleMarkerClick}
              onClose={closeAll}
              zIndex={1}
              infoTitle={`Path Point details`}
              details={[
                { label: "ID", value: point?.row?._id },
                {
                  label: "Workday Session Id",
                  value: point?.row?.workDaySessionId,
                },
                { label: "Latitude", value: String(point?.lat) },
                { label: "Longitude", value: String(point?.lng) },
                { label: "Date", value: point?.row?.date },
                {
                  label: "type",
                  value: point?.row?.locationRawData?.activity.type,
                },
                { label: "Speed", value: point?.row?.speed },
              ]}
            />
          );
        })} */}

      {/* Start Point */}
      {path[0] && (
        <Marker
          position={path[0]}
          icon={getStartPointMarkerIcon(
            selectedUser?.fullName ?? "",
            DEFAULT_COLORS.normal,
          )}
          zIndex={10}
        />
      )}

      {/* Live Position */}
      {currentPosition && isValidLatLng(currentPosition) && (
        <Marker
          position={currentPosition}
          icon={getUserIconMarker(DEFAULT_COLORS.normal)}
          title="Live Position"
          zIndex={100}
        />
      )}

      {/* Idle Markers */}
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
            onClose={closeAll}
            infoTitle="Idle Details"
            details={[
              { label: "Duration", value: idle.duration },
              { label: "From", value: formatDate(idle.startTime, "hh:mm a") },
              { label: "To", value: formatDate(idle.endTime, "hh:mm a") },
              { label: "Address", value: idle.address },
            ]}
          />
        ))}

      {/* Break Markers */}
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
            onClose={closeAll}
            infoTitle="Break Details"
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

      {/* Visit Markers */}
      {visitMarkers.map((visit) => (
        <MapMarkerWithInfo
          key={visit.visitId}
          id={visit.visitId}
          type="visit"
          position={{ lat: visit.lat, lng: visit.lng }}
          icon={VISIT_MARKER_ICON}
          activeItem={activeItem}
          onMarkerClick={handleMarkerClick}
          onClose={closeAll}
          infoTitle="Visit Details"
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

      {/* Base Polyline — full path, always visible */}
      <Polyline path={path} options={polylineOptions} />

      {/* Visit Segments — invisible until clicked, one active at a time */}
      {visitSegments.map((segment, index) => {
        if (segment.path.length < 2) return null;
        const isActive = activeSegmentIndex === index;

        return (
          <Polyline
            key={`segment-${index}`}
            path={segment.path}
            options={getPolylineOptions(isActive)}
            onClick={(e) => {
              e.stop?.();
              setActiveSegmentIndex((prev) => (prev === index ? null : index));
            }}
          />
        );
      })}

      <style>{`
         /* Custom header styles for InfoWindow */
        .gm-style-iw-ch { font-weight: bold !important; }
      `}</style>
    </>
  );
}

// ─── MapMarkerWithInfo ────────────────────────────────────────────────────────

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
}: MapMarkerWithInfoProps) {
  const isOpen = activeItem?.id === id && activeItem.type === type;

  return (
    <Fragment>
      {children}
      <Marker
        position={position}
        icon={icon}
        zIndex={zIndex}
        onClick={(e) => onMarkerClick(id, type, e)}
      >
        {isOpen && (
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
