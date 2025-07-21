import { cn } from "@/lib/utils"

const SectionTitle = ({ children, title, titleClassName, variant = 'default' }: { children?: React.ReactNode, title: string, titleClassName?: string, variant?: 'default' | 'compact' | 'spacious' }) => {
  // Title size classes based on variant
  const titleClasses = {
    compact: 'text-xl font-semibold',
    default: 'text-2xl font-bold',
    spacious: 'text-3xl font-bold'
  }
  return (
    <h2
      className={cn(
        'tracking-tight',
        titleClasses[variant],
        titleClassName
      )}
    >
      {children ? children : title}
    </h2>
  )
}

export default SectionTitle
