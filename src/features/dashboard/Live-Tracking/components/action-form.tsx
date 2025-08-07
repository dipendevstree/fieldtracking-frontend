import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { Clock, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LiveTrackingUser } from "../type/type";

// User Details Modal
interface LiveTrackingUserModalProps {
  currentUser: LiveTrackingUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LiveTrackingUserModal({
  currentUser,
  open,
  onOpenChange,
}: LiveTrackingUserModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] !max-w-lg overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              User Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              View detailed information about the user
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <div className="text-sm mt-1">{currentUser.fullName}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <div className="text-sm mt-1">{currentUser.email}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <div className="text-sm mt-1">{currentUser.roleName}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Territory</Label>
                <div className="text-sm mt-1">{currentUser.territoryName || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge variant={currentUser.isOnline ? 'default' : 'secondary'} className="capitalize">
                    {currentUser.isOnline ? currentUser.status.replace('_', ' ') : 'offline'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Activity</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {currentUser.activityStatus.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          {currentUser.currentLocation && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Current Location</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Latitude</Label>
                  <div className="text-sm">{currentUser.currentLocation.lat.toFixed(6)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Longitude</Label>
                  <div className="text-sm">{currentUser.currentLocation.lng.toFixed(6)}</div>
                </div>
                {currentUser.currentLocation.accuracy && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Accuracy</Label>
                    <div className="text-sm">{currentUser.currentLocation.accuracy}m</div>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">Last Updated</Label>
                  <div className="text-sm">
                    {new Date(currentUser.currentLocation.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Last Seen */}
          {currentUser.lastSeen && (
            <div>
              <Label className="text-sm font-medium">Last Seen</Label>
              <div className="text-sm mt-1">
                {new Date(currentUser.lastSeen).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Tracking Session Modal
interface TrackingSessionModalProps {
  currentUser: LiveTrackingUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrackingSessionModal({
  currentUser,
  open,
  onOpenChange,
}: TrackingSessionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] !max-w-lg overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Tracking History
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              View tracking session history for {currentUser.fullName}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tracking Sessions</h3>
            <p className="text-muted-foreground">
              Session history will be displayed here
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Tracking Events Modal
interface TrackingEventsModalProps {
  currentUser: LiveTrackingUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrackingEventsModal({
  currentUser,
  open,
  onOpenChange,
}: TrackingEventsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] !max-w-lg overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Activity Events
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              View activity events for {currentUser.fullName}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Activity Events</h3>
            <p className="text-muted-foreground">
              Activity events will be displayed here
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
