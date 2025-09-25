import moment from "moment-timezone"

export default function Notification({
    notification
}: {
    notification: any
}) {
    return (
        <div className='flex items-center gap-3'>
            <div className='truncate w-12'>
                {notification?.createdByData && (
                <img
                    src={
                    notification.createdByData.profileUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        (notification.createdByData.firstName + " " + notification.createdByData.lastName)
                    )}`
                    }
                    alt={notification.createdByData.fullName}
                    className="h-12 w-12 rounded-full object-cover"
                />
                )}
            </div>
            <div className="w-77 truncate">
                <span className='flex justify-between'>
                <span>{notification.title}</span>
                <span className='text-sm'>{moment(notification.createdDate).format('DD/MM/YYYY')}</span>
                </span>
                <div className='flex justify-between items-center gap-1 font-light'>
                <span className='text-sm'>
                    {notification.body.length > 25 ? notification.body.slice(0, 25) + "...": notification.body}
                </span>
                <span className='text-sm'>
                    {moment(notification.createdDate).format('hh:mm A')}
                </span>
                </div>
            </div>
        </div>
    )
}