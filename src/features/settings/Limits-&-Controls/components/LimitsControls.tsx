import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Edit, Shield } from "lucide-react"

export default function LimitsControls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Expense Limits & Controls
        </CardTitle>
        <CardDescription>Configure expense limits based on designation, location, and category.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Designation-Based Limits</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Designation</TableHead>
                <TableHead>Daily Limit</TableHead>
                <TableHead>Monthly Limit</TableHead>
                <TableHead>Travel Limit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Junior Sales Rep</TableCell>
                <TableCell>$50</TableCell>
                <TableCell>$1,000</TableCell>
                <TableCell>$0.45/mile</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Senior Sales Rep</TableCell>
                <TableCell>$75</TableCell>
                <TableCell>$1,500</TableCell>
                <TableCell>$0.50/mile</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sales Manager</TableCell>
                <TableCell>$100</TableCell>
                <TableCell>$2,500</TableCell>
                <TableCell>$0.60/mile</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-lg font-medium">Location-Based Adjustments</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metro-adjustment">Metropolitan Areas (+%)</Label>
              <Input id="metro-adjustment" defaultValue="25" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rural-adjustment">Rural Areas (-% )</Label>
              <Input id="rural-adjustment" defaultValue="10" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-lg font-medium">Expense Expiry Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-expiry">Expense Submission Deadline</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warning-period">Warning Period Before Expiry</Label>
              <Select defaultValue="7">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}