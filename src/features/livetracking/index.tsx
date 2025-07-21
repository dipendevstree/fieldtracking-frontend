import { useState, useEffect, useRef } from 'react'
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Main } from '@/components/layout/main'
import { useGetUserTrackingByUserId } from './services/live-tracking-services'

const containerStyle = {
  width: '100%',
  height: '60vh',
}

export default function Livetracking() {
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([])
  const [mapCenter, setMapCenter] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [idsSet, setIdsSet] = useState<Set<string>>(new Set())
  const mapRef = useRef<google.maps.Map | null>(null)

  // Get userId from query
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('userId')

  const { data, refetch, isFetched } = useGetUserTrackingByUserId(userId ?? '')

  useEffect(() => {
    if (data && isFetched && idsSet.size === 0) {
      const newIds = new Set<string>()
      const initialPath = data.map((item: any) => {
        newIds.add(item.liveTrackingId)
        return {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.long),
        }
      })

      setPath(initialPath)
      setIdsSet(newIds)

      if (initialPath.length > 0) {
        setMapCenter(initialPath[0]) // ✅ Set initial center
        setCurrentPosition(initialPath[initialPath.length - 1])
      }
    }
  }, [data, isFetched])

  // Poll every 5 seconds to add only new entries
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch().then((res) => {
  //       const newItems =
  //         res.data?.filter((item: any) => !idsSet.has(item.liveTrackingId)) ||
  //         []

  //       if (newItems.length > 0) {
  //         const newIds = new Set(idsSet)
  //         newItems.forEach((item: any) => newIds.add(item.liveTrackingId))

  //         setIdsSet(newIds)

  //         const newPoints = newItems.map((item: any) => ({
  //           lat: parseFloat(item.lat),
  //           lng: parseFloat(item.long),
  //         }))

  //         setPath((prev) => [...prev, ...newPoints])
  //         setCurrentPosition(newPoints[newPoints.length - 1])
  //       }
  //     })
  //   }, 5000)

  //   return () => clearInterval(interval)
  // }, [idsSet, refetch])

  // Auto-pan to current marker
  useEffect(() => {
    if (
      mapRef.current &&
      currentPosition &&
      typeof currentPosition.lat === 'number' &&
      typeof currentPosition.lng === 'number'
    ) {
      mapRef.current.panTo(currentPosition)
    }
  }, [currentPosition])

  const polylineOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 1,
    strokeWeight: 3,
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      <div className='mt-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Live Tracking</h2>
          <p className='text-muted-foreground'>
            Track real-time activity and manage admin approvals.
          </p>
        </div>
      </div>
      <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-3'>
        {/* Select Zone */}
        <div className='w-full'>
          <label className='mb-1 block text-sm font-medium'>Select Zone</label>
          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Zone' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='north'>North</SelectItem>
              <SelectItem value='south'>South</SelectItem>
              <SelectItem value='east'>East</SelectItem>
              <SelectItem value='west'>West</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Select Reps */}
        <div className='w-full'>
          <label className='mb-1 block text-sm font-medium'>Select Reps</label>
          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Reps' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='rep1'>Rep 1</SelectItem>
              <SelectItem value='rep2'>Rep 2</SelectItem>
              <SelectItem value='rep3'>Rep 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Select Status */}
        <div className='w-full'>
          <label className='mb-1 block text-sm font-medium'>
            Select Status
          </label>
          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='inactive'>Inactive</SelectItem>
              <SelectItem value='pending'>Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* <div className='mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Reps</CardTitle>
            <Building2 className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{1 || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Active Reps Today
            </CardTitle>
            <Clock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{2}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Scheduled Visits Today
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{2}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Completed Visits Today
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{6}</div>
          </CardContent>
        </Card>
      </div> */}

      <Card>
        <CardContent className=''>
          <h2 className='mb-2'>Interactive Map View</h2>
          {mapCenter && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={17}
              onLoad={(map) => {
                mapRef.current = map
              }}
            >
              {/* ✅ Route line */}
              {path.length > 1 && (
                <Polyline path={path} options={polylineOptions} />
              )}

              {/* ✅ Trail markers */}
              {path.slice(0, -1).map(
                (pos, idx) =>
                  isValidLatLng(pos) && (
                    <Marker
                      key={idx}
                      position={pos}
                      icon={getSmallDotIcon()}
                      onClick={() => {
                        console.log('posfafasfafafafa', pos)
                      }}
                    />
                  )
              )}

              {/* ✅ Moving marker */}
              {currentPosition && isValidLatLng(currentPosition) && (
                <Marker
                  position={currentPosition}
                  icon={getBikeIcon()}
                  title='Live Position'
                />
              )}
            </GoogleMap>
          )}
        </CardContent>
      </Card>
    </Main>
  )
}

// ✅ Validate coordinates
function isValidLatLng(point: any): point is { lat: number; lng: number } {
  return (
    point &&
    typeof point === 'object' &&
    typeof point.lat === 'number' &&
    typeof point.lng === 'number' &&
    isFinite(point.lat) &&
    isFinite(point.lng)
  )
}

// 🛵 Bike icon
const getBikeIcon = () => ({
  url: 'https://maps.google.com/mapfiles/kml/shapes/motorcycling.png',
  scaledSize: new window.google.maps.Size(30, 30),
})

// 🔵 Trail dot icon
const getSmallDotIcon = () => ({
  path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
  scale: 5,
  fillColor: '#0000FF',
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: '#fff',
})
