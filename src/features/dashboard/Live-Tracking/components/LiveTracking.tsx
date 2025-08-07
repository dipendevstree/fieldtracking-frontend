import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
import { LiveTrackingUser } from "../type/type"

interface LiveTrackingProps {
  users: LiveTrackingUser[]
  loading?: boolean
}

// Center on India
const center = { lat: 20.5937, lng: 78.9629 }

export default function LiveTracking({ users }: LiveTrackingProps) {
  // TODO: Replace with your real API key (keep it secret in .env for production)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCEkQ_KW66M2BjP03QiJ3R4dyzPWcOfuvw"
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-5">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Live Team Tracking</h2>
        <p className="text-muted-foreground">
          Real-time location and status of your field team
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-8 mb-2 mt-5 ">
        <div className="flex flex-col w-60">
          <label className="text-sm font-medium mb-1">Select Zone</label>
          <Select>
            <SelectTrigger className="w-full max-w-m">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="east">East Zone</SelectItem>
              <SelectItem value="west">West Zone</SelectItem>
              <SelectItem value="north">North Zone</SelectItem>
              <SelectItem value="south">South Zone</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-60">
          <label className="text-sm font-medium mb-1">Sales Rep</label>
          <Select>
            <SelectTrigger className="w-full max-w-m">
              <SelectValue placeholder="Select Sales Rep" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.userId} value={user.userId}>
                  {user.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map Display */}
      
        
          <div className="w-full h-96 rounded-xl overflow-hidden mt-5">
            {isLoaded ? (
              <GoogleMap
                mapContainerClassName="w-full h-full rounded-xl"
                center={center}
                zoom={12}
              >
                {/* Markers for each user with a location */}
                {users
                  .filter((u) => u.currentLocation)
                  .map((user) => (
                    <Marker
                      key={user.userId}
                      position={{
                        lat: user.currentLocation!.lat,
                        lng: user.currentLocation!.lng
                      }}
                      label={user.fullName}
                    />
                  ))}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading map...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}