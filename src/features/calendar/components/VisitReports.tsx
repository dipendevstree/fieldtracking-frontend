import { Star, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const visitReports = [
  {
    id: '1',
    rep: 'John Smith',
    customer: 'Acme Corp',
    date: '2024-01-10',
    outcome: 'Successful demo, client interested in premium package',
    clientFeedback: 'Very impressed with the features and pricing',
    satisfaction: 5,
    nextActions: 'Send proposal by Friday, schedule follow-up call',
    status: 'completed',
  },
  // ... other reports
]

export default function VisitReports() {
  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
    }
    return (
      variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit Reports</CardTitle>
        <CardDescription>
          Completed visit summaries and client feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {visitReports.map((report) => (
            <div key={report.id} className='space-y-4 rounded-lg border p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold'>{report.customer}</h3>
                  <p className='text-muted-foreground text-sm'>
                    {report.rep} • {report.date}
                  </p>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < report.satisfaction ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <Badge className={getStatusBadge(report.status)}>
                    {report.status}
                  </Badge>
                </div>
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <h4 className='mb-2 font-medium text-green-800'>
                    Visit Outcome
                  </h4>
                  <p className='rounded-md bg-green-50 p-3 text-sm'>
                    {report.outcome}
                  </p>
                </div>
                <div>
                  <h4 className='mb-2 font-medium text-blue-800'>
                    Client Feedback
                  </h4>
                  <p className='rounded-md bg-blue-50 p-3 text-sm'>
                    {report.clientFeedback}
                  </p>
                </div>
              </div>
              <div>
                <h4 className='mb-2 font-medium text-purple-800'>
                  Next Actions
                </h4>
                <p className='rounded-md bg-purple-50 p-3 text-sm'>
                  {report.nextActions}
                </p>
              </div>
              <div className='flex justify-end space-x-2'>
                <Button variant='outline' size='sm'>
                  <Eye className='mr-2 h-4 w-4' /> View Details
                </Button>
                <Button variant='outline' size='sm'>
                  Export Report
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
