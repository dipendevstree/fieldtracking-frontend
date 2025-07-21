import { Outlet } from '@tanstack/react-router'
import {
  IconPalette,
  IconTool,
  // IconBrowserCheck,
  // IconNotification,
  // IconPalette,
  // IconTool,
  IconUser,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import SectionTitle from '@/components/shared/page-section-title'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  return (
    <>
      <Main fixed className=' '>
        <div className='space-y-0.5 rounded-xl p-4 shadow'>
          <SectionTitle title='Settings' />
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden rounded-xl p-4 shadow md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/settings',
  },
  {
    title: 'Update Password',
    icon: <IconTool size={18} />,
    href: '/settings/reset-password',
  },
  {
    title: 'Appearance',
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  // {
  //   title: 'Notifications',
  //   icon: <IconNotification size={18} />,
  //   href: '/settings/notifications',
  // },
  // {
  //   title: 'Display',
  //   icon: <IconBrowserCheck size={18} />,
  //   href: '/settings/display',
  // },
]
