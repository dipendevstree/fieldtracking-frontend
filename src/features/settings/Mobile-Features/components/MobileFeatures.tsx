import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Smartphone } from "lucide-react"

export default function MobileFeatures() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smartphone className="h-5 w-5 mr-2" />
          Mobile App Features Configuration
        </CardTitle>
        <CardDescription>
          Configure mobile app features and permissions for sales representatives.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Schedule & Reports Access</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="view-schedule">Allow Reps to View Their Schedule</Label>
                <p className="text-sm text-muted-foreground">Enable schedule viewing in mobile app</p>
              </div>
              <Switch id="view-schedule" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="visit-summary">Allow Visit Summary Access</Label>
                <p className="text-sm text-muted-foreground">Enable viewing of visit history and summaries</p>
              </div>
              <Switch id="visit-summary" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="expense-reports">Allow Expense Report Access</Label>
                <p className="text-sm text-muted-foreground">Enable viewing and submitting expense reports</p>
              </div>
              <Switch id="expense-reports" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-lg font-medium">Camera & Photo Features</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="selfie-checkin">Enable Selfie Check-in</Label>
                <p className="text-sm text-muted-foreground">Require selfie photos during check-in</p>
              </div>
              <Switch id="selfie-checkin" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="photo-capture">Allow Photo Capture</Label>
                <p className="text-sm text-muted-foreground">Enable taking photos during visits</p>
              </div>
              <Switch id="photo-capture" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="receipt-photos">Receipt Photo Capture</Label>
                <p className="text-sm text-muted-foreground">Enable receipt photography for expenses</p>
              </div>
              <Switch id="receipt-photos" defaultChecked />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="photo-quality">Photo Quality</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Faster upload)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Best quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-photos">Max Photos per Visit</Label>
              <Input id="max-photos" defaultValue="5" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-lg font-medium">Offline Capabilities</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="offline-mode">Enable Offline Mode</Label>
                <p className="text-sm text-muted-foreground">Allow app to work without internet connection</p>
              </div>
              <Switch id="offline-mode" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="offline-sync">Auto-sync When Online</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync data when connection is restored
                </p>
              </div>
              <Switch id="offline-sync" defaultChecked />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sync-frequency">Sync Frequency</Label>
            <Select defaultValue="15">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}