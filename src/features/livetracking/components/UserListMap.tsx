import { Marker } from "@react-google-maps/api";
import { getPingMarkerIcon, isValidLatLng } from "../data/commonFunction";

interface UserListMapProps {
  enhancedUserList: any[];
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  onMarkerClick: (userId: string) => void;
}

export default function UserListMap({
  enhancedUserList,

  onMarkerClick,
}: UserListMapProps) {
  return (
    <>
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
    </>
  );
}
