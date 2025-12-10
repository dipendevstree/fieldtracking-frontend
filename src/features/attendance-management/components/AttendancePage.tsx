import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 w-full h-full overflow-hidden">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Attendance Management
          </h2>
          <p className="text-muted-foreground">
            Track your attendance, view logs, and manage corrections.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">My Attendance</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="team">Team Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Punch In / Out</CardTitle>
                <CardDescription>
                  {" "}
                  diverse location checking enabled
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="text-4xl font-mono">09:41 AM</div>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Punch In
                  </Button>
                  <Button size="lg" variant="destructive">
                    Punch Out
                  </Button>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>Location: Office HQ (Detected)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shift:</span>
                  <span className="font-medium">General (9 AM - 6 PM)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Check In:</span>
                  <span className="font-medium">09:05 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <span className="font-bold text-green-600">Present</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline">Request Correction</Button>
                <Button variant="outline">Apply for Leave</Button>
                <Button variant="outline">View Policy</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>
                Monthly view of your attendance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Calendar Component will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Attendance Dashboard</CardTitle>
              <CardDescription>
                Real-time view of your team's presence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Team Dashboard Component will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Reports Component will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
