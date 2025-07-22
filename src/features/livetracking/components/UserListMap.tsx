import { GoogleMap, Marker } from "@react-google-maps/api";
import { getPingMarkerIcon, isValidLatLng } from "../data/commonFunction";

interface UserListMapProps {
  mapCenter: { lat: number; lng: number };
  enhancedUserList: any[];
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  onMarkerClick: (userId: string) => void;
}

const containerStyle = {
  width: "100%",
  height: "60vh",
  borderRadius: "7px",
  overflow: "hidden",
};

export default function UserListMap({
  mapCenter,
  enhancedUserList,
  mapRef,
  onMarkerClick,
}: UserListMapProps) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={17}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {enhancedUserList.map(
        (user: any) =>
          user.latLong &&
          isValidLatLng(user.latLong) && (
            <Marker
              key={user.id}
              position={user.latLong}
              title={user.fullName}
              onClick={() => onMarkerClick(user.id)}
              icon={getPingMarkerIcon(user.fullName)}
            />
          )
      )}
    </GoogleMap>
  );
}
