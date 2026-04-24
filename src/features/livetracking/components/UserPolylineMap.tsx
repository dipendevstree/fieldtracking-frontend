import { Fragment, useState, useEffect } from "react";
import {
  Marker,
  Polyline,
  Circle,
  InfoWindow,
  useGoogleMap,
} from "@react-google-maps/api";
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
import { formatDate } from "date-fns";
import { UserPolylineMapProps } from "../types";

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

  const activeColor = isHighlighted
    ? DEFAULT_COLORS.active
    : DEFAULT_COLORS.normal;

  useEffect(() => {
    if (!map) return;
    const clickListener = map.addListener("click", () => setActiveItem(null));
    return () => {
      if (clickListener) google.maps.event.removeListener(clickListener);
    };
  }, [map]);

  const handleMarkerClick = (
    id: string,
    type: string,
    e: google.maps.MapMouseEvent,
  ) => {
    if (e.stop) e.stop();
    setActiveItem(activeItem?.id === id ? null : { id, type });
  };

  return (
    <>
      {/* Start Point */}
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

      {/* Live Position */}
      {currentPosition && isValidLatLng(currentPosition) && (
        <Marker
          position={currentPosition}
          icon={getUserIconMarker(activeColor)}
          title="Live Position"
        />
      )}

      {/* Debug Markers */}
      {isHighlighted &&
        path.map((point, index) => (
          <Marker
            key={`point-${index}`}
            position={point}
            icon={DEBUG_MARKER_ICON}
            title={`ID: ${point.row?._id ?? index}${point.row?.speed ? ` | Spd: ${point.row?.speed}` : ""}`}
          />
        ))}

      {/* 🟠 Idle Markers */}
      {idleMarkers.map((idle) => (
        <Fragment key={idle.id}>
          <Marker
            position={{ lat: idle.lat, lng: idle.lng }}
            icon={IDLE_MARKER_ICON}
            onClick={(e) => handleMarkerClick(idle.id, "idle", e)}
          >
            {activeItem?.id === idle.id && activeItem.type === "idle" && (
              <InfoWindow onCloseClick={() => setActiveItem(null)}>
                <InfoWindowContent
                  title="Idle Record"
                  details={[
                    { label: "Duration", value: idle.duration },
                    {
                      label: "From",
                      value: formatDate(idle.startTime, "hh:mm a"),
                    },
                    { label: "To", value: formatDate(idle.endTime, "hh:mm a") },
                    { label: "Address", value: idle.address },
                  ]}
                />
              </InfoWindow>
            )}
          </Marker>
        </Fragment>
      ))}

      {/* 🟡 Break Markers */}
      {breakMarkers.map((brk) => (
        <Fragment key={brk.id}>
          <Marker
            position={{ lat: brk.lat, lng: brk.lng }}
            icon={BREAK_MARKER_ICON}
            onClick={(e) => handleMarkerClick(brk.id, "break", e)}
          >
            {activeItem?.id === brk.id && activeItem.type === "break" && (
              <InfoWindow onCloseClick={() => setActiveItem(null)}>
                <InfoWindowContent
                  title={brk.type}
                  details={[
                    {
                      label: "From",
                      value: formatDate(brk.startTime, "hh:mm a"),
                    },
                    {
                      label: "To",
                      value: brk.endTime
                        ? formatDate(brk.endTime, "hh:mm a")
                        : "Ongoing",
                    },
                    { label: "Address", value: brk.address },
                  ]}
                />
              </InfoWindow>
            )}
          </Marker>
        </Fragment>
      ))}

      {/* 🔵 Visit Markers */}
      {visitMarkers.map((visit) => (
        <Fragment key={visit.visitId}>
          <Circle
            center={{ lat: visit.lat, lng: visit.lng }}
            radius={100}
            options={visitOverCircleOptions}
          />
          <Marker
            position={{ lat: visit.lat, lng: visit.lng }}
            icon={VISIT_MARKER_ICON}
            onClick={(e) => handleMarkerClick(visit.visitId, "visit", e)}
          >
            {activeItem?.id === visit.visitId &&
              activeItem.type === "visit" && (
                <InfoWindow onCloseClick={() => setActiveItem(null)}>
                  <InfoWindowContent
                    title={visit.companyName}
                    details={[
                      { label: "Purpose", value: visit.purpose },
                      {
                        label: "start time",
                        value: formatDate(
                          visit.checkInTime,
                          "dd-MM-yyyy hh:mm a",
                        ),
                      },
                      {
                        label: "end time",
                        value: formatDate(
                          visit.checkOutTime,
                          "dd-MM-yyyy hh:mm a",
                        ),
                      },
                      { label: "Duration", value: `${visit.duration} hr` },
                      { label: "Address", value: visit.address },
                    ]}
                  />
                </InfoWindow>
              )}
          </Marker>
        </Fragment>
      ))}

      <Polyline
        path={path}
        options={getPolylineOptions(isHighlighted)}
        onClick={() => {
          setIsHighlighted(!isHighlighted);
          setActiveItem(null);
        }}
      />

      <style>{`.gm-ui-hover-effect { display: none !important; }`}</style>
    </>
  );
}
