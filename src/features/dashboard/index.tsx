import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

// Define types for metric card props
interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

// Reusable MetricCard component
const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-muted-foreground text-xs">{change}</p>
    </CardContent>
  </Card>
)

// Dashboard header component
const DashboardHeader: React.FC = () => (
  <div className="mb-2 flex items-center justify-between space-y-2">
    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
    <div className="flex items-center space-x-2">
      <Button>Download</Button>
    </div>
  </div>
)

// Tabs navigation component
const DashboardTabsNav: React.FC = () => (
  <div className="w-full overflow-x-auto pb-2">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      {/* <TabsTrigger value="analytics" disabled>
        Analytics
      </TabsTrigger>
      <TabsTrigger value="reports" disabled>
        Reports
      </TabsTrigger>
      <TabsTrigger value="notifications" disabled>
        Notifications
      </TabsTrigger> */}
    </TabsList>
  </div>
)

// Overview section component
const OverviewSection: React.FC = () => (
  <Card className="col-span-1 lg:col-span-4">
    <CardHeader>
      <CardTitle>Overview</CardTitle>
    </CardHeader>
    <CardContent className="pl-2">
      <Overview />
    </CardContent>
  </Card>
)

// Recent sales section component
const RecentSalesSection: React.FC = () => (
  <Card className="col-span-1 lg:col-span-3">
    <CardHeader>
      <CardTitle>Recent Sales</CardTitle>
      <CardDescription>You made 265 sales this month.</CardDescription>
    </CardHeader>
    <CardContent>
      <RecentSales />
    </CardContent>
  </Card>
)

// Main Dashboard component
export default function Dashboard() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1% from last month',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="text-muted-foreground h-4 w-4"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: 'Total Drivers',
      value: '+2350',
      change: '+180.1% from last month',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="text-muted-foreground h-4 w-4"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Total Sellers',
      value: '+12,234',
      change: '+19% from last month',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="text-muted-foreground h-4 w-4"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      ),
    },
    {
      title: 'Total Buyers',
      value: '+573',
      change: '+201 since last hour',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="text-muted-foreground h-4 w-4"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
  ]

  return (
    <Main>
      <DashboardHeader />
      <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
        <DashboardTabsNav />
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <OverviewSection />
            <RecentSalesSection />
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  )
}