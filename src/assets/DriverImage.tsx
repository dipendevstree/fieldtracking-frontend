import image from './driver.png'

const IconAsImage = ({ className, icon }: { className?: string, icon?: string }) => {
    return (
        <img
            src={icon ?? image}
            alt="Driver Image"
            className={`h-6 w-6 ${className ?? ''}`}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            loading="lazy"
            decoding="async"
        // style={{ width: '24px', height: '24px' }}
        />
    )
}

export default IconAsImage