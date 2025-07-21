import { useState } from 'react'
import { MapPin } from 'lucide-react'

interface UserTrackingTimelineProps {
  userId: string
}

const UserTrackingTimeline = ({ userId }: UserTrackingTimelineProps) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  // Mock data (replace with actual data fetching logic if needed)
  const mockData = {
    user: {
      name: 'Hathryn Surphy',
      initials: 'HS',
      district: 'Downtown District',
      status: 'Active',
      completionRate: 100,
    },
    stats: {
      totalVisit: 3,
      completed: 1,
      distance: '26 km',
    },
    timeline: [
      {
        id: 1,
        type: 'punch_in',
        title: 'Punch In',
        location: 'Santa Ana, Illinois',
        time: '10:00 AM',
        timeBottom: '10:05 AM',
        color: 'bg-teal-500',
      },
      {
        id: 2,
        type: 'task',
        title: 'Task - 01',
        description: 'Test pvt.ltd',
        color: 'bg-gray-400',
      },
      {
        id: 3,
        type: 'break',
        title: 'Break',
        description: '11:00 - 11:10',
        subtitle: 'Tea Break',
        color: 'bg-yellow-400',
      },
      {
        id: 4,
        type: 'punch_out',
        title: 'Punch Out',
        location: 'Santa Ana, Illinois',
        time: '02:05 AM',
        color: 'bg-red-500',
      },
    ],
    nearestLocation: {
      address: '4517 Washington Ave, Manchester, Kentucky 39495',
    },
  }

  // TODO: Replace with actual data fetching using userId
  // Example: const { data } = useGetUserTrackingByUserId(userId)
  const data = mockData

  return (
    <div className='bg-gray-50'>
      {/* Stats Cards */}
      <div className='py-6'>
        <div className='grid grid-cols-3 gap-3'>
          <div className='rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm'>
            <div className='mb-2 text-xs text-gray-500'>Total Visit</div>
            <div className='font-bold text-gray-900'>
              {data.stats.totalVisit}
            </div>
          </div>
          <div className='rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm'>
            <div className='mb-2 text-xs text-gray-500'>Completed</div>
            <div className='font-bold text-gray-900'>
              {data.stats.completed}
            </div>
          </div>
          <div className='rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm'>
            <div className='mb-2 text-xs text-gray-500'>Distance</div>
            <div className='font-bold text-gray-900'>{data.stats.distance}</div>
          </div>
        </div>
      </div>

      {/* Main Content Card - User Info + Timeline + Nearest Location */}
      <div className='mb-6 rounded-lg border border-gray-200 bg-white shadow-sm'>
        {/* User Info */}
        <div className='border-b border-gray-100 p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 font-bold text-white'>
              {data.user.initials}
            </div>
            <div className='flex-1'>
              <div className='font-semibold text-gray-900'>
                {data.user.name}
              </div>
              <div className='text-sm text-gray-500'>{data.user.district}</div>
              <div className='mt-1 flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-teal-500'></div>
                <span className='text-sm text-gray-600'>
                  {data.user.completionRate}%
                </span>
              </div>
            </div>
            <span className='flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              {data.user.status}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className='border-b border-gray-100 p-4'>
          <div className='relative'>
            {data.timeline.map((item, index) => (
              <div
                key={item.id}
                className='flex items-start gap-4 pb-8 last:pb-0'
              >
                {/* Timeline line */}
                {index < data.timeline.length - 1 && (
                  <div className='absolute top-[12px] left-[6px] h-16 w-0.5 bg-gray-200'></div>
                )}

                {/* Timeline dot */}
                <div
                  className={`h-3 w-3 ${item.color} relative z-10 mt-1 flex-shrink-0 rounded-full`}
                ></div>

                {/* Content */}
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='text-sm font-medium text-gray-900'>
                        {item.title}
                      </div>

                      {item.description && (
                        <div className='mt-1 text-sm text-gray-600'>
                          {item.description}
                        </div>
                      )}

                      {item.subtitle && (
                        <div className='mt-1 text-sm text-gray-500'>
                          {item.subtitle}
                        </div>
                      )}

                      {item.location && (
                        <div className='mt-2 flex items-center gap-1'>
                          <MapPin className='h-3 w-3 text-gray-400' />
                          <span className='text-sm text-gray-500'>
                            {item.location}
                          </span>
                        </div>
                      )}

                      {item.timeBottom && (
                        <div className='mt-1 text-sm text-gray-500'>
                          {item.timeBottom}
                        </div>
                      )}
                    </div>

                    {item.time && (
                      <div className='ml-4 flex-shrink-0 text-sm text-gray-500'>
                        {item.time}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearest Location */}
        <div className='p-4'>
          <div className='mb-3 font-semibold text-gray-900'>
            Nearest Location
          </div>
          <div className='flex items-start gap-2'>
            <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400' />
            <div className='text-sm leading-relaxed text-gray-600'>
              {data.nearestLocation.address}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTrackingTimeline
