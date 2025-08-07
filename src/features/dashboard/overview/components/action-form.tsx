import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { BarChart3, Activity, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SalesRep, RecentActivity } from "../type/type";
import { Label } from "@/components/ui/label";

// Sales Rep Details Modal
interface SalesRepModalProps {
  currentUser: SalesRep;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SalesRepModal({
  currentUser,
  open,
  onOpenChange,
}: SalesRepModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] !max-w-lg overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Sales Rep Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              View detailed information about the sales representative
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={currentUser.avatar || "/placeholder.svg"}
                  alt={currentUser.name}
                />
                <AvatarFallback>
                  {currentUser.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                <p className="text-muted-foreground">{currentUser.email}</p>
                <p className="text-sm">{currentUser.role}</p>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge
                    variant={currentUser.isOnline ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {currentUser.isOnline
                      ? currentUser.status.replace("_", " ")
                      : "offline"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <div className="text-sm mt-1">{currentUser.location}</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Today's Performance</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Visits</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {currentUser.todayVisits}
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  ${currentUser.todayRevenue.toLocaleString()}
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
                  <Label className="text-xs text-muted-foreground">
                    Latitude
                  </Label>
                  <div className="text-sm">
                    {currentUser.currentLocation.lat.toFixed(6)}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Longitude
                  </Label>
                  <div className="text-sm">
                    {currentUser.currentLocation.lng.toFixed(6)}
                  </div>
                </div>
                {currentUser.currentLocation.accuracy && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Accuracy
                    </Label>
                    <div className="text-sm">
                      {currentUser.currentLocation.accuracy}m
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Last Updated
                  </Label>
                  <div className="text-sm">
                    {new Date(
                      currentUser.currentLocation.timestamp
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Last Seen */}
          <div>
            <Label className="text-sm font-medium">Last Seen</Label>
            <div className="text-sm mt-1">{currentUser.lastSeen}</div>
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

// Performance Modal
interface PerformanceModalProps {
  currentUser: SalesRep;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PerformanceModal({
  currentUser,
  open,
  onOpenChange,
}: PerformanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] !max-w-lg overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Performance Analytics
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              View performance metrics for {currentUser.name}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Performance Analytics
            </h3>
            <p className="text-muted-foreground">
              Performance charts and metrics will be displayed here
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

// Activity Modal
interface ActivityModalProps {
  currentActivity: RecentActivity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityModal({ open, onOpenChange }: ActivityModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] !max-w-lg overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Activity Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              View detailed information about the activity
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Activity Details</h3>
            <p className="text-muted-foreground">
              Activity information will be displayed here
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
