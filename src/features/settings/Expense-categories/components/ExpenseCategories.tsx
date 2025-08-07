import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Edit, DollarSign } from "lucide-react"

export default function ExpenseCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Expense Categories Configuration
        </CardTitle>
        <CardDescription>Manage expense categories, their types, and default settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium">Active Categories</h4>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Default Limit</TableHead>
              <TableHead>Requires Receipt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Travel Allowance</TableCell>
              <TableCell>Mileage</TableCell>
              <TableCell>$0.50/mile</TableCell>
              <TableCell>
                <Badge variant="secondary">Optional</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="default">Active</Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Daily Allowance</TableCell>
              <TableCell>Per Diem</TableCell>
              <TableCell>$75/day</TableCell>
              <TableCell>
                <Badge variant="destructive">Required</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="default">Active</Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Meals & Entertainment</TableCell>
              <TableCell>Fixed Amount</TableCell>
              <TableCell>$50/meal</TableCell>
              <TableCell>
                <Badge variant="destructive">Required</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="default">Active</Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-lg font-medium">Per Diem Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breakfast-allowance">Breakfast Allowance</Label>
              <Input id="breakfast-allowance" defaultValue="$15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lunch-allowance">Lunch Allowance</Label>
              <Input id="lunch-allowance" defaultValue="$25" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dinner-allowance">Dinner Allowance</Label>
              <Input id="dinner-allowance" defaultValue="$35" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}