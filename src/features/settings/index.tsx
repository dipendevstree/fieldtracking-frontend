import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Main } from "@/components/layout/main"
import { cn } from "@/lib/utils"

// Import the actual page components
import ExpenseCategoriesPage from './Expense-categories'
import LimitsControlsPage from './Limits-&-Controls'
import ApproversPage from './Approvers'
import FieldTrackingPage from './Field-Tracking'
import NotificationsPage from './notifications'
import MobileFeaturesPage from './Mobile-Features'
import GeneralSettingsPage from './General'

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
    value: '/settings/ExpenseCategories',
    label: 'Expense Categories',
    component: ExpenseCategoriesPage
  },
  {
    value: '/settings/LimitsControls',
    label: 'Limits & Controls',
    component: LimitsControlsPage
  },
  {
    value: '/settings/Approvers',
    label: 'Approvers',
    component: ApproversPage
  },
  {
    value: '/settings/field-tracking',
    label: 'Field Tracking',
    component: FieldTrackingPage
  },
  {
    value: '/settings/Notifications',
    label: 'Notifications',
    component: NotificationsPage
  },
  {
    value: '/settings/MobileFeatures',
    label: 'Mobile Features',
    component: MobileFeaturesPage
  },
  {
    value: '/settings/GeneralSettings',
    label: 'General',
    component: GeneralSettingsPage
  }
] as const

export default function SettingsPage() {
  // Initialize with first tab as default (similar to calendar pattern)
  const [activeTab, setActiveTab] = useState<SettingsTabValue>('/settings/expense-categories')

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
        <TabsList className="grid w-full grid-cols-7">
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
