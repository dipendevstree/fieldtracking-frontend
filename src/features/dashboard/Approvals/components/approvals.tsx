import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertTriangle, Eye } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useApprovalsStore } from "../store/approvals.store"
import { Approval } from "../type/type"

interface ApprovalsProps {
  approvals: Approval[]
  loading?: boolean
}

export default function Approvals({ approvals, loading }: ApprovalsProps) {
  const { setOpen, setCurrentApproval } = useApprovalsStore()

  const handleViewApproval = (approval: Approval) => {
    setCurrentApproval(approval)
    setOpen('view')
  }

  const handleApprove = (approval: Approval) => {
    setCurrentApproval(approval)
    setOpen('approve')
  }

  const handleReject = (approval: Approval) => {
    setCurrentApproval(approval)
    setOpen('reject')
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      case 'under_review':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve expense claims and allowances</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/approvals">
                <CheckCircle className="h-4 w-4 mr-2" />
                View All Approvals
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading approvals...
                  </TableCell>
                </TableRow>
              ) : approvals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No pending approvals found
                  </TableCell>
                </TableRow>
              ) : (
                approvals.slice(0, 5).map((approval) => (
                  <TableRow key={approval.approvalId}>
                    <TableCell className="capitalize">{approval.type}</TableCell>
                    <TableCell>{approval.employeeName}</TableCell>
                    <TableCell>
                      {approval.currency} {approval.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(approval.status)} className="capitalize">
                        {approval.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(approval.priority)} className="capitalize">
                        {approval.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewApproval(approval)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {approval.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(approval)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleReject(approval)}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}