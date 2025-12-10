import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Clock, DollarSign } from "lucide-react";

export default function PayrollPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 w-full h-full overflow-hidden">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Payroll Management
          </h2>
          <p className="text-muted-foreground">
            Manage your salary details, download payslips, and view tax info.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">My Pay</TabsTrigger>
          <TabsTrigger value="history">Payslip History</TabsTrigger>
          <TabsTrigger value="structure">Salary Structure</TabsTrigger>
          <TabsTrigger value="compliance">Compliance & Tax</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Last Month Pay
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,231.00</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  {" "}
                  <Download className="mr-2 h-4 w-4" /> Download Slip
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Pay Date
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Jan 01, 2026</div>
                <p className="text-xs text-muted-foreground">in 23 days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payslips</CardTitle>
              <CardDescription>Download your past payslips.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Payslip History Table Component will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Salary Structure</CardTitle>
              <CardDescription>Detailed breakdown of your CTC.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Salary Structure View Component will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Tax & Compliance</CardTitle>
              <CardDescription>
                View your tax deductions and PF details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Compliance Component will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
