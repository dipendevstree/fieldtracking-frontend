import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetVisitEmployeeAnalytics } from '../services/calendar-view.hook'
import { TopUsers, VisitEmployeeAnalytics } from '../type/type';

export default function Analytics() {
  const visitEmployeeAnalytics = useGetVisitEmployeeAnalytics();
  const analyticsData = (visitEmployeeAnalytics?.data ?? {}) as VisitEmployeeAnalytics;

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {Object.keys(analyticsData).length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Visit Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-sm'>Total Visits</span>
                  <span className='font-bold'>{analyticsData?.totalVisitsCount}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Successful Visits</span>
                  <span className='font-bold text-green-600'>{analyticsData?.successVisits}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Success Rate</span>
                  <span className='font-bold'>{analyticsData?.successRate}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Avg. Satisfaction</span>
                  <span className='font-bold'>{analyticsData?.avgSatisfaction}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {analyticsData?.topUsers?.length > 0 && analyticsData?.topUsers.slice(0, 3).map((rep: TopUsers, index: number) => (
                  <div key={index} className='flex items-center space-x-3'>
                    <div className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold'>
                      {index + 1}
                    </div>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={rep?.profileUrl || '/placeholder.svg'} />
                      <AvatarFallback>
                        {rep.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>{rep.name}</p>
                      <p className='text-muted-foreground text-xs'>
                        {rep.visitCount} visits
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-sm'>Avg. Visit Duration</span>
                  <span className='font-bold'>{analyticsData?.avgVisitDuration} hrs</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Follow-up Rate</span>
                  <span className='font-bold'>{analyticsData?.followupRate}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Cancelled Visits</span>
                  <span className='font-bold'>{analyticsData?.cancelledVisits}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Rescheduled Visits</span>
                  <span className='font-bold'>{analyticsData?.rescheduledVisits}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
