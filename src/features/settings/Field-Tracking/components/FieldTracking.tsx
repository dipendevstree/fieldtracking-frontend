import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MapPin } from "lucide-react"

export default function FieldTracking() {
  return (
    <Card>
      <CardContent className="space-y-6"> 
      {/* <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Field Tracking Configuration
        </CardTitle>
        <CardDescription>Configure location tracking, map views, and field activity monitoring.</CardDescription>
      </CardHeader>
        {/* <div className="space-y-4">
          <h4 className="text-lg font-medium">Map Display Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="live-pins">Show Live Location Pins</Label>
                <p className="text-sm text-muted-foreground">Display real-time location of active sales reps</p>
              </div>
              <Switch id="live-pins" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="route-history">Show Route History</Label>
                <p className="text-sm text-muted-foreground">Display travel routes and visit history</p>
              </div>
              <Switch id="route-history" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="customer-pins">Show Customer Location Pins</Label>
                <p className="text-sm text-muted-foreground">Display customer locations on map</p>
              </div>
              <Switch id="customer-pins" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-lg font-medium">Tracking Intervals</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location-update">Location Update Frequency</Label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every 1 minute</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="10">Every 10 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="geofence-radius">Geofence Radius (meters)</Label>
              <Input id="geofence-radius" defaultValue="100" />
            </div>
          </div>
        </div>

        <Separator /> */}

        <div className="space-y-6">
          <h4 className="text-lg font-medium">Activity Monitoring</h4>
          <div className="divide-y divide-border border rounded-lg">
            <div className="flex items-center justify-between px-4 py-5">
              <div>
                <Label htmlFor="auto-checkin" className="font-medium">Auto Check-in at Customer Locations</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically check-in when entering geofenced areas
                </p>
              </div>
              <Switch id="auto-checkin" />
            </div>
            <div className="flex items-center justify-between px-4 py-5">
              <div>
                <Label htmlFor="idle-detection" className="font-medium">Idle Time Detection</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor for extended periods of inactivity
                </p>
              </div>
              <Switch id="idle-detection" />
            </div>
            <div className="flex items-center justify-between px-4 py-5">
              <div>
                <Label htmlFor="territory-users" className="font-medium">Allow to add Users based on Territories</Label>
              </div>
              <Switch id="territory-users" defaultChecked />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <Label htmlFor="idle-threshold" className="mb-2 block">Idle Time Threshold (minutes)</Label>
              <Input id="idle-threshold" defaultValue="30" />
            </div>
            <div>
              <Label htmlFor="break-threshold" className="mb-2 block">Long Break Threshold (minutes)</Label>
              <Input id="break-threshold" defaultValue="60" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}