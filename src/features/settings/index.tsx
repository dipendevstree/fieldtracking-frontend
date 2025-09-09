import { useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Main } from "@/components/layout/main"
import { cn } from "@/lib/utils"

// Import the actual page components
import ExpenseCategoriesPage from '../settings/Expense-categories'
import LimitsControlsPage from '../settings/Limits-&-Controls'
import ApproversPage from '../settings/Approvers'
// import FieldTrackingPage from '../settings/Field-Tracking'
import MobileFeaturesPage from '../settings/Mobile-Features'
import GeneralSettingsPage from '../settings/General'
import Notifications from "./notifications/components/Notifications"

// Define valid tab values with proper typing
export type SettingsTabValue =
  | '/settings'
  | '/settings/expense-categories'
  | '/settings/limits-controls'
  | '/settings/approvers'
  | '/settings/field-tracking'
  | '/settings/notifications'
  | '/settings/mobile-features'
  | '/settings/general'

// Tab configuration for better maintainability
const SETTINGS_TABS = [
  {
    value: '/settings/expense-categories',
    label: 'Expense Categories',
    component: ExpenseCategoriesPage
  },
  {
    value: '/settings/limits-controls',
    label: 'Limits & Controls',
    component: LimitsControlsPage
  },
  {
    value: '/settings/approvers',
    label: 'Approvers',
    component: ApproversPage
  },
  // {
  //   value: '/settings/field-tracking/',
  //   label: 'Field Tracking',
  //   component: FieldTrackingPage
  // },
  {
    value: '/settings/notifications',
    label: 'Notifications',
    component: Notifications
  },
  {
    value: '/settings/mobile-features',
    label: 'Mobile Features',
    component: MobileFeaturesPage
  },
  {
    value: '/settings/general',
    label: 'General',
    component: GeneralSettingsPage
  }
] as const

// Configurable default tab - change this to set the default tab
      const DEFAULT_SETTINGS_TAB: SettingsTabValue = '/settings/expense-categories'

export default function SettingsPage() {
  const { latestLocation } = useRouter()
  const pathname = latestLocation.pathname
  
  // Initialize with URL-based default or fallback to configured default
  const [activeTab, setActiveTab] = useState<SettingsTabValue>(
    pathname.includes('/settings/') ? pathname as SettingsTabValue : DEFAULT_SETTINGS_TAB
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value as SettingsTabValue)
  }

  const handleExportSettings = () => {
    // TODO: Implement settings export functionality
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Settings & Configuration
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportSettings}>
            Export Settings
          </Button>
          {/* <Button onClick={handleSaveAllChanges}>
            Save All Changes
          </Button> */}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-4 space-y-5"
      >
        <TabsList className="grid w-full grid-cols-6">
          {SETTINGS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SETTINGS_TABS.map((tab) => {
          const Component = tab.component
          return (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              <Component />
            </TabsContent>
          )
        })}
      </Tabs>
    </Main>
  )
}
