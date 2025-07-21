import { IconCheck, IconPalette, IconPaletteOff } from '@tabler/icons-react'
import { useTheme, type ThemeVariant, THEMES } from '@/context/theme-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeSelector() {
  const { themeVariant, setThemeVariant } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-accent/20 relative'
        >
          <IconPalette className='h-5 w-5' />
          <span className='sr-only'>Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuLabel>Themes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {Object.entries(THEMES).map(([key, config]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setThemeVariant(key as ThemeVariant)}
              className='flex items-center justify-between'
            >
              <div className='flex items-center gap-2'>
                <span className='flex-1'>{config.label}</span>
                <div className='flex items-center gap-1'>
                  {config.isNew && (
                    <span className='bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs'>
                      New
                    </span>
                  )}
                  {config.isTrending && (
                    <span className='rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900 dark:bg-amber-900/20 dark:text-amber-300'>
                      Trending
                    </span>
                  )}
                </div>
              </div>
              {themeVariant === key && (
                <IconCheck className='text-primary h-4 w-4' />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-muted-foreground'
          onClick={(e) => {
            e.stopPropagation()
            setThemeVariant('default')
          }}
        >
          <IconPaletteOff className='mr-2 h-4 w-4' />
          <span>Reset to default</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
