import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

// Mock data for daily expenses
const dailyExpenses = [
  {
    id: 1,
    repName: "John Smith",
    repAvatar: "/placeholder.svg?height=32&width=32",
    date: "2024-01-15",
    category: "Travel Allowance",
    amount: 45.5,
    description: "Client visit - Downtown office",
    receipt: true,
    status: "pending",
    submittedAt: "2024-01-15 14:30",
    mileage: "25 miles",
  },
  {
    id: 2,
    repName: "Sarah Johnson",
    repAvatar: "/placeholder.svg?height=32&width=32",
    date: "2024-01-15",
    category: "Daily Allowance",
    amount: 75.0,
    description: "Field work - North Zone",
    receipt: true,
    status: "pending",
    submittedAt: "2024-01-15 16:45",
    mileage: null,
  },
  {
    id: 3,
    repName: "Mike Wilson",
    repAvatar: "/placeholder.svg?height=32&width=32",
    date: "2024-01-14",
    category: "Meals & Entertainment",
    amount: 120.0,
    description: "Client lunch meeting",
    receipt: true,
    status: "approved",
    submittedAt: "2024-01-14 19:20",
    mileage: null,
  },
  {
    id: 4,
    repName: "Emily Davis",
    repAvatar: "/placeholder.svg?height=32&width=32",
    date: "2024-01-14",
    category: "Travel Allowance",
    amount: 67.25,
    description: "Training session travel",
    receipt: false,
    status: "pending",
    submittedAt: "2024-01-14 17:15",
    mileage: "35 miles",
  },
]

// // Mock data for monthly consolidated expenses
// const monthlyConsolidated = [
//   {
//     repId: 1,
//     repName: "John Smith",
//     repAvatar: "/placeholder.svg?height=40&width=40",
//     dailyExpenses: {
//       travel: 450.75,
//       dailyAllowance: 1200.0,
//       meals: 340.5,
//       other: 125.0,
//     },
//     monthlyExpenses: {
//       trainPass: 150.0,
//       phoneRecharge: 75.0,
//       internetAllowance: 50.0,
//     },
//     totalDaily: 2116.25,
//     totalMonthly: 275.0,
//     netTotal: 2391.25,
//     status: "pending",
//   },
//   {
//     repId: 2,
//     repName: "Sarah Johnson",
//     repAvatar: "/placeholder.svg?height=40&width=40",
//     dailyExpenses: {
//       travel: 380.25,
//       dailyAllowance: 1050.0,
//       meals: 290.75,
//       other: 85.0,
//     },
//     monthlyExpenses: {
//       trainPass: 150.0,
//       phoneRecharge: 75.0,
//       internetAllowance: 50.0,
//     },
//     totalDaily: 1806.0,
//     totalMonthly: 275.0,
//     netTotal: 2081.0,
//     status: "approved",
//   },
//   {
//     repId: 3,
//     repName: "Mike Wilson",
//     repAvatar: "/placeholder.svg?height=40&width=40",
//     dailyExpenses: {
//       travel: 520.5,
//       dailyAllowance: 1350.0,
//       meals: 425.25,
//       other: 165.0,
//     },
//     monthlyExpenses: {
//       trainPass: 150.0,
//       phoneRecharge: 75.0,
//       internetAllowance: 50.0,
//     },
//     totalDaily: 2460.75,
//     totalMonthly: 275.0,
//     netTotal: 2735.75,
//     status: "pending",
//   },
// ]

export default function ReportsAnalytics() {
  const handleExportPDF = () => {
    console.log("Exporting to PDF")
  }

  const handleExportExcel = () => {
    console.log("Exporting to Excel")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Reports & Analytics Content */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Generate detailed reports for expense analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-300" onClick={handleExportPDF}>
                  <div className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded flex items-center justify-center mr-3">PDF</div>
                  Export Daily Expenses (PDF)
                </Button>
                <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-300" variant="outline" onClick={handleExportExcel}>
                  <div className="w-6 h-6 bg-green-500 text-white text-xs font-bold rounded flex items-center justify-center mr-3">XLS</div>
                  Export Daily Expenses (Excel)
                </Button>
                <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-300" onClick={handleExportPDF}>
                  <div className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded flex items-center justify-center mr-3">PDF</div>
                  Export Monthly Consolidated (PDF)
                </Button>
                <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-300" variant="outline" onClick={handleExportExcel}>
                  <div className="w-6 h-6 bg-green-500 text-white text-xs font-bold rounded flex items-center justify-center mr-3">XLS</div>
                  Export Monthly Consolidated (Excel)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Overview of expense approval metrics.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending Approvals</span>
                  <span className="font-medium">{dailyExpenses.filter((e) => e.status === "pending").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Approved Today</span>
                  <span className="font-medium">
                    {dailyExpenses.filter((e) => e.status === "approved" && e.date === "2024-01-15").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Daily Expense</span>
                  <span className="font-medium">
                    ${(dailyExpenses.reduce((sum, e) => sum + e.amount, 0) / dailyExpenses.length).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Highest Monthly Total</span>
                    <span className="font-medium">
                    ${Math.max(...dailyExpenses.map((r) => r.amount)).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
