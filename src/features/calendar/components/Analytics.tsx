import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const salesReps = [
  {
    id: '1',
    name: 'John Smith',
    avatar: '/placeholder.svg?height=32&width=32',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '/placeholder.svg?height=32&width=32',
  },
  {
    id: '3',
    name: 'Mike Davis',
    avatar: '/placeholder.svg?height=32&width=32',
  },
]

export default function Analytics() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card>
        <CardHeader>
          <CardTitle>Visit Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span className='text-sm'>Total Visits</span>
              <span className='font-bold'>156</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm'>Successful Visits</span>
              <span className='font-bold text-green-600'>136</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm'>Success Rate</span>
              <span className='font-bold'>87.2%</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm'>Avg. Satisfaction</span>
              <span className='font-bold'>4.6/5</span>
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
            {salesReps.slice(0, 3).map((rep, index) => (
              <div key={rep.id} className='flex items-center space-x-3'>
                <div className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold'>
                  {index + 1}
                </div>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={rep.avatar || '/placeholder.svg'} />
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
                    {Math.floor(Math.random() * 20) + 15} visits
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
              <span className='font-bold'>1.2 hrs</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm'>Follow-up Rate</span>
              <span className='font-bold'>94%</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm'>Conversion Rate</span>
              <span className='font-bold'>23%</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm'>Rescheduled Visits</span>
              <span className='font-bold'>8%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
