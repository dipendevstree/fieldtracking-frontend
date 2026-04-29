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

  const activeColor = DEFAULT_COLORS.normal;

  return (
    <>
      {/* Start Point */}
      {path[0] && (
        <Marker
          position={path[0]}
          icon={getStartPointMarkerIcon(
            selectedUser?.fullName ?? "",
            activeColor,
          )}
          zIndex={10}
        />
      )}

      {/* Live Position */}
      {currentPosition && isValidLatLng(currentPosition) && (
        <Marker
          position={currentPosition}
          icon={getUserIconMarker(activeColor)}
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
